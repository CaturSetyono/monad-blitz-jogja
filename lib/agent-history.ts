export type DevHistoryEntry = {
  id: string;
  type: "developer";
  ts: string;
  repoUrl: string;
  branch: string;
  task: string;
  status: "success" | "error";
  logCount: number;
  firstLog?: string;
};

export type FraudHistoryEntry = {
  id: string;
  type: "fraud";
  ts: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  riskScore: number;
  recommendation: string;
  safeToInteract: boolean;
  flagCount: number;
  status: "success" | "error" | "payment_required";
};

export type HistoryEntry = DevHistoryEntry | FraudHistoryEntry;

const STORAGE_KEY = "madgent_agent_history";
const MAX_ENTRIES = 100;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveHistoryEntry(
  entry: Omit<DevHistoryEntry, "id"> | Omit<FraudHistoryEntry, "id">
): HistoryEntry {
  const full = { ...entry, id: uid() } as HistoryEntry;
  const list = loadHistory();
  list.unshift(full);
  if (list.length > MAX_ENTRIES) list.splice(MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return full;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
