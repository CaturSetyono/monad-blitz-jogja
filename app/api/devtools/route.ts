import { NextResponse } from "next/server";

type DevTask =
  | "code_review"
  | "security_scan"
  | "run_lint"
  | "run_build"
  | "suggest_refactor";

function now() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  const ts = now();
  try {
    const body = (await req.json()) as {
      repoUrl?: string;
      branch?: string;
      scope?: string;
      task?: DevTask;
      notes?: string;
    };

    const repoUrl = (body.repoUrl || "").trim();
    const branch = (body.branch || "main").trim();
    const scope = (body.scope || "app/**").trim();
    const task = body.task || "code_review";

    if (!repoUrl) {
      return NextResponse.json(
        { ok: false, logs: [{ ts, level: "error", msg: "Missing repoUrl." }] },
        { status: 400 },
      );
    }

    // Stubbed run output. Replace this handler with your agent runtime integration.
    const logs = [
      { ts, level: "info" as const, msg: `Queued task: ${task}` },
      { ts: now(), level: "info" as const, msg: `Repo: ${repoUrl}` },
      { ts: now(), level: "info" as const, msg: `Branch: ${branch}` },
      { ts: now(), level: "info" as const, msg: `Scope: ${scope}` },
    ];

    if (task === "code_review") {
      logs.push({ ts: now(), level: "info", msg: "Simulating review pass (findings list + suggested patches)..." });
      logs.push({ ts: now(), level: "warn", msg: "Example finding: add CI/lint task runner to prevent drift." });
    }

    if (task === "security_scan") {
      logs.push({ ts: now(), level: "info", msg: "Simulating security scan (contracts + frontend)..." });
      logs.push({ ts: now(), level: "warn", msg: "Example finding: ensure no secrets committed; validate inputs for any webhook endpoints." });
    }

    if (task === "run_lint") {
      logs.push({ ts: now(), level: "info", msg: "Would run: pnpm lint" });
    }

    if (task === "run_build") {
      logs.push({ ts: now(), level: "info", msg: "Would run: pnpm build" });
    }

    if (task === "suggest_refactor") {
      logs.push({ ts: now(), level: "info", msg: "Generating a refactor plan from the selected scope..." });
    }

    if ((body.notes || "").trim()) {
      logs.push({ ts: now(), level: "info", msg: `Notes: ${(body.notes || "").trim()}` });
    }

    logs.push({ ts: now(), level: "info", msg: "Done (stub)." });

    return NextResponse.json({ ok: true, logs, summary: "stub" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, logs: [{ ts, level: "error", msg: (e as Error).message }] },
      { status: 500 },
    );
  }
}
