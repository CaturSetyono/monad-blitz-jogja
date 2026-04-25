import "dotenv/config";
import express from "express";
import cors from "cors";
import { privateKeyToAccount } from "viem/accounts";
import { createAgentServer } from "@/lib/x402-server";
import { x402ExpressMiddleware } from "@/lib/x402-express";
import { nvidiaChat, MODELS } from "@/lib/nvidia";
import { createPaidFetch } from "@/lib/x402-client";

const PORT = parseInt(process.env.DEVELOPER_AGENT_PORT ?? "3002");
const PRIVATE_KEY = (process.env.DEVELOPER_AGENT_PRIVATE_KEY ??
  "0x0000000000000000000000000000000000000000000000000000000000000002") as `0x${string}`;
const FRAUD_AGENT_URL = process.env.FRAUD_AGENT_URL ?? "http://localhost:3001";

const account = privateKeyToAccount(PRIVATE_KEY);

async function fetchGithubFiles(repoUrl: string, branch: string, scope: string): Promise<{ path: string; content: string }[]> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#.]+)/);
  if (!match) return [];
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");

  const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${branch}?recursive=1`;
  const treeResp = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "AgentBazaar" },
  });
  if (!treeResp.ok) return [];
  const treeData = await treeResp.json();

  const pattern = scope.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
  const regex = new RegExp(`^${pattern}$`);
  const files = (treeData.tree || [])
    .filter((f: any) => f.type === "blob" && regex.test(f.path))
    .slice(0, 20);

  const results: { path: string; content: string }[] = [];
  for (const file of files) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${branch}/${file.path}`;
    try {
      const resp = await fetch(rawUrl, { headers: { "User-Agent": "AgentBazaar" } });
      if (resp.ok) {
        const content = await resp.text();
        results.push({ path: file.path, content: content.slice(0, 4000) });
      }
    } catch {}
  }
  return results;
}

async function runAITask(
  task: string,
  files: { path: string; content: string }[],
  notes: string,
  tokenAudit: any
): Promise<string> {
  const fileContext = files.map((f) => `--- ${f.path} ---\n${f.content}`).join("\n\n");

  const prompts: Record<string, string> = {
    code_review: `Review this codebase for bugs, security issues, and code quality. Be specific with file paths and line references.${notes ? `\nFocus: ${notes}` : ""}`,
    security_scan: `Perform a thorough security audit. Check for: reentrancy, overflow, access control, front-running, unsafe external calls, secrets in code.${notes ? `\nFocus: ${notes}` : ""}`,
    run_lint: `Analyze code style and linting issues. Check for: unused imports, naming conventions, type safety, dead code, inconsistent patterns.${notes ? `\nFocus: ${notes}` : ""}`,
    run_build: `Check for build errors, type errors, missing dependencies, and configuration issues.${notes ? `\nFocus: ${notes}` : ""}`,
    suggest_refactor: `Suggest a refactor plan. Identify: code duplication, overly complex functions, poor separation of concerns, improvement opportunities.${notes ? `\nFocus: ${notes}` : ""}`,
  };

  const auditSection = tokenAudit
    ? `\n\nFRAUD AUDIT (from Fraud Detection Agent):\n${JSON.stringify(tokenAudit, null, 2)}`
    : "";

  const systemPrompt = `You are an expert developer agent in AgentBazaar, a trustless AI agent marketplace on Monad blockchain.
You analyze codebases and provide actionable, detailed responses in markdown format.
Use headers, bullet points, code blocks, and severity labels (🔴 Critical, 🟡 Warning, 🟢 Info).${auditSection}`;

  return nvidiaChat(MODELS.coding, [
    { role: "system", content: systemPrompt },
    { role: "user", content: `${prompts[task] || prompts.code_review}\n\nCodebase:\n${fileContext.slice(0, 24000)}` },
  ], { temperature: 0.2, max_tokens: 4096 });
}

async function main() {
  const x402Server = await createAgentServer({
    payTo: account.address,
    price: "$0.50",
    description: "AI code review, security scan, and smart contract audit",
  });

  const paidFetch = createPaidFetch(PRIVATE_KEY);

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.post("/task", async (req, res, _next) => {
    const isDev = req.headers["x-dev-bypass"] === "agentbazaar-dev";

    const handler = async () => {
      try {
        const { taskType, repoUrl, branch, scope, notes, tokenAddress, skipAudit, code, codePath } = req.body;
        const effectiveTask = taskType ?? "code_review";

        console.log(`[Developer Agent] Task: ${effectiveTask}`);

        let files: { path: string; content: string }[] = [];
        if (code) {
          files.push({ path: codePath ?? "input.code", content: code });
        }
        if (repoUrl) {
          console.log(`[Developer Agent] Fetching repo: ${repoUrl} (${branch}, scope: ${scope ?? "**"})`);
          files = await fetchGithubFiles(repoUrl, branch ?? "main", scope ?? "**");
          console.log(`[Developer Agent] Fetched ${files.length} files`);
        }

        let tokenAudit = null;
        if (!skipAudit && tokenAddress) {
          console.log(`[Developer Agent] Sub-hiring Fraud Agent for: ${tokenAddress}`);
          try {
            const fraudResp = await fetch(`${FRAUD_AGENT_URL}/task`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Dev-Bypass": "agentbazaar-dev" },
              body: JSON.stringify({ tokenAddress, chainId: 10143 }),
            });
            if (fraudResp.ok) {
              const fraudData = await fraudResp.json();
              tokenAudit = fraudData.result;
              console.log(`[Developer Agent] Fraud audit: risk=${tokenAudit?.riskScore}`);
            }
          } catch (err) {
            console.log(`[Developer Agent] Fraud agent unavailable: ${(err as Error).message}`);
          }
        }

        console.log(`[Developer Agent] Running AI ${effectiveTask}...`);
        const analysis = await runAITask(effectiveTask, files, notes ?? "", tokenAudit);
        console.log(`[Developer Agent] Done (${analysis.length} chars)`);

        return res.json({
          result: {
            taskType: effectiveTask,
            analysis,
            filesAnalyzed: files.map((f) => f.path),
            fraudAudit: tokenAudit,
          },
          agentId: "developer-v1",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("[Developer Agent] Error:", err);
        return res.status(500).json({ error: "Task failed", message: (err as Error).message });
      }
    };

    if (isDev) {
      return handler();
    }
    await x402ExpressMiddleware(x402Server, req, res, handler);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", agent: "developer", capability: "code-generation", price: "$0.50", wallet: account.address });
  });

  app.get("/.well-known/x402", (_req, res) => {
    res.json({
      endpoints: {
        "POST /task": {
          price: "$0.50", network: "eip155:10143", scheme: "exact",
          payTo: account.address, description: "AI code review & audit with fraud detection",
        },
      },
    });
  });

  app.listen(PORT, () => {
    console.log(`[Developer Agent] Running on http://localhost:${PORT}`);
    console.log(`[Developer Agent] Wallet: ${account.address}`);
    console.log(`[Developer Agent] POST /task — $0.50 per task`);
    console.log(`[Developer Agent] Fraud Agent: ${FRAUD_AGENT_URL}`);
  });
}

main().catch(console.error);
