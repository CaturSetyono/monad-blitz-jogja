import { NextResponse } from "next/server";

type DevTask = "code_review" | "security_scan" | "run_lint" | "run_build" | "suggest_refactor";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      repoUrl?: string;
      branch?: string;
      scope?: string;
      task?: DevTask;
      notes?: string;
      tokenAddress?: string;
      code?: string;
      codePath?: string;
    };

    const developerAgentUrl = process.env.DEVELOPER_AGENT_URL ?? "http://localhost:3002";

    const agentResp = await fetch(`${developerAgentUrl}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Dev-Bypass": "agentbazaar-dev",
      },
      body: JSON.stringify({
        taskType: body.task ?? "code_review",
        repoUrl: body.repoUrl,
        branch: body.branch ?? "main",
        scope: body.scope ?? "**",
        notes: body.notes,
        tokenAddress: body.tokenAddress,
        code: body.code,
        codePath: body.codePath,
      }),
    });

    const raw = await agentResp.text();

    if (agentResp.status === 402) {
      const paymentHeader = agentResp.headers.get("payment-required");
      return NextResponse.json({
        ok: false,
        needsPayment: true,
        paymentRequired: paymentHeader ? JSON.parse(atob(paymentHeader)) : null,
        logs: [{ ts: new Date().toISOString(), level: "warn" as const, msg: "Payment required (x402). Connect wallet and retry." }],
      }, { status: 402 });
    }

    if (!agentResp.ok) {
      return NextResponse.json({
        ok: false,
        logs: [{ ts: new Date().toISOString(), level: "error" as const, msg: `Agent error: ${agentResp.status} ${raw.slice(0, 200)}` }],
      }, { status: 502 });
    }

    const data = JSON.parse(raw);
    const analysis = data.result?.analysis ?? "";
    const logs = analysis.split("\n").filter(Boolean).map((line: string) => ({
      ts: new Date().toISOString(),
      level: line.includes("🔴") ? "error" as const : line.includes("🟡") ? "warn" as const : "info" as const,
      msg: line.replace(/^#+\s*/, ""),
    }));

    return NextResponse.json({
      ok: true,
      logs,
      summary: data.result?.analysis?.slice(0, 500) ?? "",
      filesAnalyzed: data.result?.filesAnalyzed ?? [],
      fraudAudit: data.result?.fraudAudit ?? null,
      raw: data,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      logs: [{ ts: new Date().toISOString(), level: "error" as const, msg: `Failed: ${(e as Error).message}` }],
    }, { status: 500 });
  }
}
