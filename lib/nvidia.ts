const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

type Message = { role: "system" | "user" | "assistant"; content: string };

export async function nvidiaChat(
  model: string,
  messages: Message[],
  options?: { temperature?: number; max_tokens?: number }
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY not set");

  const resp = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.max_tokens ?? 2048,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`NVIDIA API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export const MODELS = {
  reasoning: "meta/llama-4-maverick-17b-128e-instruct",
  coding: "meta/llama-4-maverick-17b-128e-instruct",
  general: "meta/llama-4-maverick-17b-128e-instruct",
  fast: "microsoft/phi-4-mini-instruct",
} as const;
