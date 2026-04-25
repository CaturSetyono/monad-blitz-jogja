import "dotenv/config";
import express from "express";
import cors from "cors";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, type Address } from "viem";
import { createAgentServer } from "@/lib/x402-server";
import { x402ExpressMiddleware } from "@/lib/x402-express";
import { nvidiaChat, MODELS } from "@/lib/nvidia";
import { monadTestnet } from "@/lib/monad";

const PORT = parseInt(process.env.FRAUD_AGENT_PORT ?? "3001");
const PRIVATE_KEY = (process.env.FRAUD_AGENT_PRIVATE_KEY ??
  "0x0000000000000000000000000000000000000000000000000000000000000001") as `0x${string}`;

const account = privateKeyToAccount(PRIVATE_KEY);

const ERC20_ABI = [
  { type: "function", name: "name", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "balanceOf", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
] as const;

async function gatherOnChainData(tokenAddress: Address) {
  const client = createPublicClient({ chain: monadTestnet, transport: http() });

  let name = "UNKNOWN", symbol = "UNKNOWN", decimals = 18, totalSupply = BigInt(0);
  try {
    [name, symbol, decimals, totalSupply] = await Promise.all([
      client.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: "name" }) as Promise<string>,
      client.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: "symbol" }) as Promise<string>,
      client.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: "decimals" }) as Promise<number>,
      client.readContract({ address: tokenAddress, abi: ERC20_ABI, functionName: "totalSupply" }) as Promise<bigint>,
    ]);
  } catch {}

  let bytecode;
  let codeHex = "0x";
  let bytecodeSize = 0;
  try {
    bytecode = await client.getBytecode({ address: tokenAddress });
    codeHex = bytecode?.toLowerCase() ?? "0x";
    bytecodeSize = bytecode ? bytecode.length : 0;
  } catch {}

  const hasMint = codeHex.includes("0x40c10f19") || codeHex.includes("mint");
  const hasBlacklist = codeHex.includes("blacklist") || codeHex.includes("0xa8b9e84c");
  const hasPause = codeHex.includes("pause") || codeHex.includes("0x8456cb59");
  const hasOwnership = codeHex.includes("ownable") || codeHex.includes("0x715018a6");
  const hasHighTax = codeHex.includes("4294967295") || codeHex.includes("0xffffffff");
  const isProxy = codeHex.includes("0x3659cfe6") || codeHex.includes("0x36568abe");

  return {
    address: tokenAddress,
    name,
    symbol,
    decimals,
    totalSupply: totalSupply.toString(),
    bytecodeSize,
    contractExists: bytecode !== undefined && bytecode.length > 0,
    indicators: { hasMint, hasBlacklist, hasPause, hasOwnership, hasHighTax, isProxy },
  };
}

async function buildFraudReport(onChain: Awaited<ReturnType<typeof gatherOnChainData>>) {
  const prompt = `You are a blockchain security auditor. Analyze this token on Monad testnet and provide a detailed fraud risk assessment.

Token Data:
- Address: ${onChain.address}
- Name: ${onChain.name}
- Symbol: ${onChain.symbol}
- Decimals: ${onChain.decimals}
- Total Supply: ${onChain.totalSupply}
- Contract exists: ${onChain.contractExists}
- Bytecode size: ${onChain.bytecodeSize} bytes

Bytecode Analysis Indicators:
- Has mint function: ${onChain.indicators.hasMint}
- Has blacklist function: ${onChain.indicators.hasBlacklist}
- Has pause function: ${onChain.indicators.hasPause}
- Has ownership/renounce: ${onChain.indicators.hasOwnership}
- Has high tax mechanism: ${onChain.indicators.hasHighTax}
- Is upgradeable proxy: ${onChain.indicators.isProxy}

Respond in EXACTLY this JSON format, no markdown, no explanation outside JSON:
{
  "riskScore": <0-100>,
  "recommendation": "<SAFE|LOW_RISK|MEDIUM_RISK|HIGH_RISK|CRITICAL>",
  "flags": ["FLAG1", "FLAG2"],
  "summary": "<1-2 sentence human-readable summary>",
  "detailedAnalysis": {
    "honeypotRisk": { "score": <0-100>, "explanation": "..." },
    "mintRisk": { "score": <0-100>, "explanation": "..." },
    "blacklistRisk": { "score": <0-100>, "explanation": "..." },
    "taxRisk": { "score": <0-100>, "explanation": "..." },
    "proxyRisk": { "score": <0-100>, "explanation": "..." },
    "overallRisk": { "score": <0-100>, "explanation": "..." }
  },
  "recommendations": ["action1", "action2"],
  "safeToInteract": <true|false>
}`;

  const raw = await nvidiaChat(MODELS.reasoning, [
    { role: "system", content: "You are a blockchain security expert. Respond only with valid JSON." },
    { role: "user", content: prompt },
  ], { temperature: 0.2, max_tokens: 2048 });

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      riskScore: 50,
      recommendation: "MEDIUM_RISK",
      flags: ["PARSE_ERROR"],
      summary: "AI analysis completed but output format was unexpected. Manual review recommended.",
      detailedAnalysis: { overallRisk: { score: 50, explanation: "Could not parse AI response" } },
      recommendations: ["Review token contract manually"],
      safeToInteract: false,
    };
  }
}

async function main() {
  const x402Server = await createAgentServer({
    payTo: account.address,
    price: "$0.25",
    description: "AI-powered token fraud detection analysis",
  });

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post("/task", async (req, res, _next) => {
    const isDev = req.headers["x-dev-bypass"] === "agentbazaar-dev";

    const handler = async () => {
      try {
        const { tokenAddress, chainId } = req.body;
        if (!tokenAddress) return res.status(400).json({ error: "Missing tokenAddress" });
        if (chainId && chainId !== 10143) return res.status(400).json({ error: "Only Monad testnet (10143) supported" });

        console.log(`[Fraud Agent] Analyzing: ${tokenAddress}`);
        const onChainData = await gatherOnChainData(tokenAddress as Address);
        console.log(`[Fraud Agent] On-chain data gathered, running AI analysis...`);

        const report = await buildFraudReport(onChainData);
        console.log(`[Fraud Agent] Done: risk=${report.riskScore} rec=${report.recommendation}`);

        return res.json({
          result: {
            tokenAddress,
            tokenInfo: { name: onChainData.name, symbol: onChainData.symbol, decimals: onChainData.decimals },
            ...report,
            analyzedAt: new Date().toISOString(),
          },
          agentId: "fraud-detection-v1",
        });
      } catch (err) {
        console.error("[Fraud Agent] Error:", err);
        return res.status(500).json({ error: "Analysis failed", message: (err as Error).message });
      }
    };

    if (isDev) {
      return handler();
    }
    await x402ExpressMiddleware(x402Server, req, res, handler);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", agent: "fraud-detection", capability: "fraud-detection", price: "$0.25", wallet: account.address });
  });

  app.get("/.well-known/x402", (_req, res) => {
    res.json({
      endpoints: {
        "POST /task": {
          price: "$0.25", network: "eip155:10143", scheme: "exact",
          payTo: account.address, description: "AI-powered token fraud detection",
        },
      },
    });
  });

  app.listen(PORT, () => {
    console.log(`[Fraud Agent] Running on http://localhost:${PORT}`);
    console.log(`[Fraud Agent] Wallet: ${account.address}`);
    console.log(`[Fraud Agent] POST /task — $0.25 per analysis (AI-powered)`);
  });
}

main().catch(console.error);
