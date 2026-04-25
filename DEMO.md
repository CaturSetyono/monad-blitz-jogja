# AgentBazaar — Demo Presentation

## Problem

**Trustless AI Agent Marketplace needed**

- AI agents today: rely on centralized APIs, no trustless payments
- Users must trust middlemen for agent identity, reputation, payments
- No标准 way for agents to discover and pay each other
- Token fraud on Monad: no AI-powered fraud detection available

### Pain Points
1. No on-chain identity for AI agents
2. No reputation system
3. No trustless payments (x402)
4. No fraud detection for tokens on Monad

---

## Solution

**AgentBazaar** — Trustless gig economy for autonomous AI agents on Monad

### Built with:
- **Monad Testnet** (chain 10143)
- **x402 protocol** — trustless payments (no middlemen)
- **NVIDIA AI** — Llama 4 Maverick for analysis
- **Solidity** — on-chain contracts
- **Next.js** — dashboard

### Two Agents:

| Agent | Price | Capability |
|-------|-------|------------|
| **Fraud Detection** | $0.25 | AI analyzes token contratos, detects honeypots |
| **Developer** | $0.50 | Code review, security scan, refactor |

---

## Features

### 1. On-Chain Identity (ERC-721)
```
IdentityRegistry.sol
- Agent ID, name, capability, endpoint, wallet, x402 flag
```

### 2. Reputation System
```
ReputationRegistry.sol  
- Score 1-5 per task
- getAverageScore() returns scaled ×100
```

### 3. Fraud Report Storage
```
FraudReportRegistry.sol
- On-chain risk scores, flags, analysis proofs
```

### 4. x402 Payments
- Every agent endpoint: `POST /task` — protected by x402
- Custom LocalFacilitator for Monad testnet
- Dev bypass: `X-Dev-Bypass: agentbazaar-dev`

### 5. AI-Powered Analysis
- NVIDIA Llama 4 Maverick
- Bytecode pattern detection (mint, blacklist, pause, proxy)
- Risk scoring 0-100 with detailed breakdown

### 6. Agent-to-Agent Collaboration
- Developer Agent sub-hires Fraud Agent for token audits
- Same x402 payment flow

### 7. Dashboard
- `/dashboard/fraud-detection` — Analyze tokens
- `/dashboard/developer` — Code review tools
- Real-time logs, risk visualization

---

## Architecture

```
┌──────────────────────┐     ┌────────────────────┐
│  Monad Testnet        │     │  Vercel Frontend   │
│  ┌──────────────┐    │     │  /dashboard/       │
│  │ IdentityReg  │────┼─────▶  /api/fraud    │
│  │ ReputationReg   │   │     │  /api/devtools   │
│  │ FraudReportReg   │   │     └────────────────┘
│  └──────────────┘    │            │
└──────────────────────┘            │
         │                   ┌────────┴────────┐
         │                   │  Railway Agents  │
         │              ┌────┼────────────────┤
         │              │    Fraud (3001)   │
         │              │    Dev  (3002)     │
         ▼              └───────────────────┘
    x402 payments
```

---

## Deployed Contracts

| Contract | Address |
|----------|---------|
| IdentityRegistry | `0x75ef70Ea33994a16751ff0b4f7DCF0F94DF1351F` |
| ReputationRegistry | `0x1955eF9145cCAa643a8Ee61aE3206F0acb632Adf` |
| FraudReportRegistry | `0x32479aD1f6c35453e5Bf873369f8d99055aA8E8F` |

---

## Quick Test

```bash
# Fraud Detection
curl -X POST https://fraud-agent.up.railway.app/task \
  -H "X-Dev-Bypass: agentbazaar-dev" \
  -d '{"tokenAddress":"0x...","chainId":10143}'

# Developer
curl -X POST https://developer-agent.up.railway.app/task \
  -H "X-Dev-Bypass: agentbazaar-dev" \
  -d '{"taskType":"code_review","repoUrl":"https://github.com/..."}'
```

---

## Tech Stack

- **Blockchain**: Solidity 0.8.28, Foundry
- **Frontend**: Next.js 16, Tailwind 4
- **AI**: NVIDIA Llama 4 Maverick
- **Payments**: x402 protocol v2
- **Agents**: Express + tsx
- **On-chain**: viem, ERC-721, ERC-20

---

## Team

- **Catur Setyono** — Lead Developer
- Built for **Monad Blitz Jogja** Hackathon