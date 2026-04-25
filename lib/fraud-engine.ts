import { createPublicClient, http, type Address } from "viem";
import { monadTestnet } from "./monad";

const ERC20_ABI = [
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

const OWNABLE_ABI = [
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

export type FraudFlag =
  | "HONEYPOT_SUSPECTED"
  | "OWNER_CAN_MINT"
  | "OWNER_CAN_FREEZE"
  | "SINGLE_HOLDER_RISK"
  | "TOP_HOLDER_CONCENTRATION"
  | "LOW_LIQUIDITY"
  | "NEW_TOKEN"
  | "HIGH_TRANSFER_TAX"
  | "NO_OWNER_RENOUNCED"
  | "SUSPICIOUS_BYTECODE";

export type FraudAnalysisResult = {
  tokenAddress: Address;
  riskScore: number;
  flags: FraudFlag[];
  details: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    holderCount: number;
    topHolderConcentration: string;
    ownerRenounced: boolean;
    ageHours: number;
    transferTaxBps: number;
  };
  recommendation: "SAFE" | "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK" | "CRITICAL";
  analyzedAt: string;
};

export async function analyzeToken(tokenAddress: Address): Promise<FraudAnalysisResult> {
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  const flags: FraudFlag[] = [];
  let riskScore = 0;

  let tokenName = "UNKNOWN";
  let tokenSymbol = "UNKNOWN";
  let decimals = 18;
  let totalSupply = BigInt(0);

  try {
    [tokenName, tokenSymbol, decimals, totalSupply] = await Promise.all([
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      }) as Promise<string>,
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      }) as Promise<string>,
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }) as Promise<number>,
      client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      }) as Promise<bigint>,
    ]);
  } catch {
    flags.push("HONEYPOT_SUSPECTED");
    riskScore += 40;
  }

  let ownerRenounced = false;
  try {
    const owner = (await client.readContract({
      address: tokenAddress,
      abi: OWNABLE_ABI,
      functionName: "owner",
    })) as Address;

    if (owner === "0x0000000000000000000000000000000000000000") {
      ownerRenounced = true;
    } else {
      flags.push("NO_OWNER_RENOUNCED");
      riskScore += 15;
    }
  } catch {
    ownerRenounced = true;
  }

  const code = await client.getBytecode({ address: tokenAddress });
  if (!code || code === "0x") {
    flags.push("HONEYPOT_SUSPECTED");
    riskScore += 50;
  } else {
    const codeStr = code.toLowerCase();
    if (codeStr.includes("4294967295") || codeStr.includes("0xffffffff")) {
      flags.push("HIGH_TRANSFER_TAX");
      riskScore += 30;
    }
    if (codeStr.includes("blacklist") || codeStr.includes("_blacklist")) {
      flags.push("OWNER_CAN_FREEZE");
      riskScore += 20;
    }
    if (codeStr.includes("mint") && !ownerRenounced) {
      flags.push("OWNER_CAN_MINT");
      riskScore += 25;
    }
  }

  const deployTxReceipt = await client.getTransactionCount({ address: tokenAddress });
  const ageHours = deployTxReceipt > 0 ? Math.max(1, Math.floor((100 - deployTxReceipt) / 4)) : 999;
  if (ageHours < 24) {
    flags.push("NEW_TOKEN");
    riskScore += 15;
  }

  const topHolderConcentration = "N/A";
  const holderCount = 0;
  const transferTaxBps = 0;

  if (flags.some((f) => f === "SINGLE_HOLDER_RISK" || f === "TOP_HOLDER_CONCENTRATION")) {
    riskScore += 10;
  }

  riskScore = Math.min(riskScore, 100);

  let recommendation: FraudAnalysisResult["recommendation"];
  if (riskScore <= 10) recommendation = "SAFE";
  else if (riskScore <= 30) recommendation = "LOW_RISK";
  else if (riskScore <= 55) recommendation = "MEDIUM_RISK";
  else if (riskScore <= 80) recommendation = "HIGH_RISK";
  else recommendation = "CRITICAL";

  return {
    tokenAddress,
    riskScore,
    flags,
    details: {
      name: tokenName,
      symbol: tokenSymbol,
      decimals,
      totalSupply: totalSupply.toString(),
      holderCount,
      topHolderConcentration,
      ownerRenounced,
      ageHours,
      transferTaxBps,
    },
    recommendation,
    analyzedAt: new Date().toISOString(),
  };
}
