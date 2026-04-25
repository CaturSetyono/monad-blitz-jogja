"use client";

import { useMemo, useState } from "react";
import { saveHistoryEntry } from "@/lib/agent-history";

type DevTask =
  | "code_review"
  | "security_scan"
  | "run_lint"
  | "run_build"
  | "suggest_refactor";

type RunLog = {
  ts: string;
  level: "info" | "warn" | "error";
  msg: string;
};

export default function DashboardDeveloperPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [scope, setScope] = useState("app/**");
  const [task, setTask] = useState<DevTask>("code_review");
  const [notes, setNotes] = useState("");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<RunLog[]>([]);

  const canRun = useMemo(() => {
    try {
      if (!repoUrl.trim()) return false;
      // allow http(s) URLs and git@ urls
      if (repoUrl.startsWith("git@")) return true;
      const u = new URL(repoUrl);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, [repoUrl]);

  async function run() {
    if (!canRun || running) return;
    setRunning(true);
    setLogs([]);
    try {
      const res = await fetch("/api/devtools", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim(), branch: branch.trim(), scope: scope.trim(), task, notes: notes.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; logs: RunLog[]; summary?: string };
      if (!res.ok || !json.ok) {
        const errorLogs = json.logs?.length ? json.logs : [{ ts: new Date().toISOString(), level: "error" as const, msg: "Run failed." }];
        setLogs(errorLogs);
        saveHistoryEntry({ type: "developer", ts: new Date().toISOString(), repoUrl: repoUrl.trim(), branch: branch.trim(), task, status: "error", logCount: errorLogs.length, firstLog: errorLogs[0]?.msg });
        return;
      }
      setLogs(json.logs);
      saveHistoryEntry({ type: "developer", ts: new Date().toISOString(), repoUrl: repoUrl.trim(), branch: branch.trim(), task, status: "success", logCount: json.logs.length, firstLog: json.logs[0]?.msg });
    } catch (e) {
      const msg = (e as Error).message;
      setLogs([{ ts: new Date().toISOString(), level: "error", msg }]);
      saveHistoryEntry({ type: "developer", ts: new Date().toISOString(), repoUrl: repoUrl.trim(), branch: branch.trim(), task, status: "error", logCount: 1, firstLog: msg });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Developer</h1>
        <p className="text-slate-400 text-sm mt-2">Connect a repo and run agent-assisted workflows (review, lint/build, security checks).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="glass-card rounded-lg p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Connect Repository</h2>
            <div className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-500">GitHub, GitLab, self-hosted</div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Repo URL</label>
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary/40"
              />
              {!canRun && repoUrl.trim() ? <div className="text-xs text-amber-200">Enter a valid URL (https://...) or git@... address.</div> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Branch</label>
                <input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Scope</label>
                <input
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="app/**"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-lg p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Run Agent Tools</h2>
            <div className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-500">preview</div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Task</label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value as DevTask)}
                className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="code_review">Code review (PR-style findings)</option>
                <option value="security_scan">Security scan (contracts + app)</option>
                <option value="run_lint">Run lint</option>
                <option value="run_build">Run build</option>
                <option value="suggest_refactor">Suggest refactor plan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: focus on auth flow, remove dead code, check for secrets..."
                rows={4}
                className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none resize-none"
              />
            </div>

            <button
              onClick={run}
              disabled={!canRun || running}
              className="w-full bg-primary text-white rounded-md px-5 py-3 text-[10px] uppercase tracking-widest font-bold font-display disabled:opacity-60"
            >
              {running ? "Running..." : "Run"}
            </button>

            <div className="text-xs text-slate-500">
              This is UI + stubbed API output for now. Next step is wiring the request to your real agent runtime.
            </div>
          </div>
        </section>
      </div>

      <section className="glass-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Run Output</h2>
          <div className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-500">console</div>
        </div>

        <div className="mt-4 bg-black/30 border border-white/10 rounded-md p-4 font-mono text-xs leading-relaxed min-h-40">
          {logs.length === 0 ? (
            <div className="text-slate-500">No output yet.</div>
          ) : (
            <div className="space-y-2">
              {logs.map((l, idx) => (
                <div key={idx} className={l.level === "error" ? "text-red-200" : l.level === "warn" ? "text-amber-200" : "text-slate-200"}>
                  <span className="text-slate-500">[{l.ts}]</span> {l.msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
