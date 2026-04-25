import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      tokenAddress?: string;
      chainId?: number;
    };

    if (!body.tokenAddress) {
      return NextResponse.json(
        { ok: false, error: "tokenAddress is required" },
        { status: 400 }
      );
    }

    const fraudAgentUrl = process.env.FRAUD_AGENT_URL ?? "http://localhost:3001";

    const agentResp = await fetch(`${fraudAgentUrl}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Dev-Bypass": "agentbazaar-dev",
      },
      body: JSON.stringify({
        tokenAddress: body.tokenAddress.trim(),
        chainId: body.chainId ?? 10143,
      }),
    });

    if (agentResp.status === 402) {
      const paymentHeader = agentResp.headers.get("payment-required");
      return NextResponse.json(
        {
          ok: false,
          needsPayment: true,
          paymentRequired: paymentHeader
            ? JSON.parse(atob(paymentHeader))
            : null,
          error:
            "Payment required (x402). Connect wallet and retry.",
        },
        { status: 402 }
      );
    }

    if (!agentResp.ok) {
      const errText = await agentResp.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Agent returned ${agentResp.status}: ${errText.slice(0, 300)}`,
        },
        { status: 502 }
      );
    }

    const data = await agentResp.json();
    return NextResponse.json({ ok: true, result: data.result });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `Failed to reach Fraud Agent: ${(e as Error).message}`,
      },
      { status: 500 }
    );
  }
}
