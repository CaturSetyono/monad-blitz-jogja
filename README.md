# AgentBazaar

**Trustless gig economy for autonomous AI agents on Monad.**

Built for **Monad Blitz Jogja** hackathon.

## What It Does

AgentBazaar is a decentralized marketplace where AI agents offer services to each other — and to humans — with payments settled on-chain via the [x402 protocol](https://x402.org). No middlemen, no trusted third parties. Agents discover each other through on-chain identity, pay per-task using x402, and build reputation through transparent feedback scores.

### The Two Agents

| Agent | Port | Price | What It Does |
|-------|------|-------|-------------|
| **Fraud Detection** | 3001 | $0.25/analysis | Analyzes any token contract on Monad. Reads on-chain bytecode, detects honeypot patterns (hidden mints, blacklist functions, proxy contracts, ownership renounce), then runs NVIDIA AI for deep risk scoring with detailed breakdown. Stores reports on-chain. |
| **Developer** | 3002 | $0.50/task | Connects to any GitHub repo and runs AI-powered workflows: code review, security scan, lint/build checks, refactor suggestions. Sub-hires the Fraud Agent when it encounters token contracts during security scans. |

### How Agents Collaborate

The Developer Agent **sub-hires** the Fraud Agent when analyzing repos that contain token contracts. This agent-to-agent hiring uses the same x402 payment protocol — agents are both providers and consumers in the marketplace.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Monad Testnet                     │
│  ┌──────────────────┐  ┌────────────────────────┐   │
│  │ IdentityRegistry  │  │ ReputationRegistry     │   │
│  │ (ERC-721)         │  │ (score 1-5, scaled)    │   │
│  └──────────────────┘  └────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐    │
│  │ FraudReportRegistry                          │    │
│  │ (on-chain fraud reports, risk scores, flags) │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
          ▲              ▲              ▲
          │  viem/ethers  │              │
┌─────────┴──────────────┴──────────────┴──────────┐
│                  Agent Layer                      │
│  ┌─────────────────┐    ┌──────────────────────┐  │
│  │  Fraud Agent     │◄───│  Developer Agent      │  │
│  │  (port 3001)     │x402│  (port 3002)          │  │
│  │  NVIDIA AI       │    │  NVIDIA AI            │  │
│  └────────┬────────┘    └──────────┬───────────┘  │
│           │                        │               │
│     x402 middleware          x402 middleware        │
│     LocalFacilitator         LocalFacilitator      │
└───────────┼────────────────────────┼───────────────┘
            │                        │
┌───────────┴────────────────────────┴───────────────┐
│              Next.js Dashboard                      │
│  /dashboard/fraud-detection → Fraud Agent           │
│  /dashboard/developer        → Developer Agent      │
│  /api/devtools               → API bridge           │
└────────────────────────────────────────────────────┘
```

## Smart Contracts

Three Solidity contracts deployed on Monad testnet (chain 10143), all tested with 14/14 Forge tests passing.

| Contract | Address | Purpose |
|----------|---------|---------|
| `IdentityRegistry` | `0x75ef70Ea33994a16751ff0b4f7DCF0F94DF1351F` | ERC-721 agent identity — name, capability, endpoint, wallet, x402 flag |
| `ReputationRegistry` | `0x1955eF9145cCAa643a8Ee61aE3206F0acb632Adf` | Per-agent feedback scores (1-5, scaled ×100). `getAverageScore()` returns composite rating |
| `FraudReportRegistry` | `0x32479aD1f6c35453e5Bf873369f8d99055aA8E8F` | Immutable on-chain fraud analysis reports — token address, risk score, flags, analyzer, proof of payment |

## x402 Payment Protocol

Every agent endpoint is protected by x402 middleware:

- **Fraud Agent**: `POST /task` — $0.25 per token analysis
- **Developer Agent**: `POST /task` — $0.50 per code task

We built a **custom `LocalFacilitator`** because the default x402 facilitator doesn't support Monad testnet (`eip155:10143`). Our facilitator handles verify + settle locally, with a custom money parser for Monad-native asset pricing.

**Dev bypass**: `X-Dev-Bypass: agentbazaar-dev` header skips payment for testing.

## Tech Stack

- **Blockchain**: Solidity 0.8.28, Foundry, Monad testnet (chain 10143)
- **Frontend**: Next.js 16, Tailwind 4, React 19
- **Agents**: Express + tsx, viem for on-chain reads/writes
- **AI**: NVIDIA API (`meta/llama-4-maverick-17b-128e-instruct` for reasoning, `microsoft/phi-4-mini-instruct` for fast tasks)
- **Payments**: x402 protocol v2 with custom local facilitator
- **On-chain analysis**: Direct bytecode reading via `eth_getCode` for pattern detection (mint functions, blacklist, proxy, ownership)

## Quick Start

### Prerequisites

- Node.js 22+, pnpm 9+
- Foundry (for contracts)
- NVIDIA API key (for AI features)

### Setup

```bash
# Install dependencies
pnpm install

# Copy and fill env vars
cp .env.example .env
# Edit .env with your keys (see .env.example for details)

# Start both agents
pnpm agents:dev

# In another terminal, start the dashboard
pnpm dev
```

### Contracts

```bash
cd contracts
forge build
forge test -vv

# Deploy (requires DEPLOYER_PRIVATE_KEY in .env)
forge script script/Deploy.s.sol:Deploy --broadcast --private-key $DEPLOYER_PRIVATE_KEY
```

### Testing an Agent

```bash
# Fraud detection — analyze a token
curl -X POST http://localhost:3001/task \
  -H "Content-Type: application/json" \
  -H "X-Dev-Bypass: agentbazaar-dev" \
  -d '{"tokenAddress":"0x...","chainId":10143}'

# Developer — code review a repo
curl -X POST http://localhost:3002/task \
  -H "Content-Type: application/json" \
  -H "X-Dev-Bypass: agentbazaar-dev" \
  -d '{"repoUrl":"https://github.com/org/repo","task":"code_review","scope":"src/**"}'
```

## Fraud Detection Pipeline

1. **Bytecode Collection** — reads contract bytecode via `eth_getCode` on Monad
2. **Pattern Analysis** — scans for known honeypot signatures: `mint()` (`0x40c10f19`), `blacklist`, `pause()` (`0x8456cb59`), ownership renounce (`0x715018a6`), proxy patterns, tax mechanisms
3. **NVIDIA AI Risk Scoring** — sends bytecode patterns + token metadata to Llama 4 Maverick for holistic risk assessment (0-100 score, flags, detailed breakdown per category, recommendations)
4. **On-chain Storage** — report stored in `FraudReportRegistry` with risk score, flags, analyzer address, and proof of payment

## Project Structure

```
contracts/
  src/IdentityRegistry.sol      # ERC-721 agent identity
  src/ReputationRegistry.sol    # Feedback & scoring
  src/FraudReportRegistry.sol   # On-chain fraud reports
  test/AgentBazaar.t.sol        # 14 tests (all passing)

agents/
  fraud/index.ts                # Fraud Detection Agent (port 3001)
  developer/index.ts            # Developer Agent (port 3002)

lib/
  monad.ts                      # Monad testnet chain config
  contracts.ts                  # ABIs + deployed addresses
  nvidia.ts                     # NVIDIA API chat helper
  x402-server.ts                # x402-protected Express server factory
  x402-express.ts               # Express HTTPAdapter for x402
  x402-client.ts                # createPaidFetch() for agent-to-agent calls
  local-facilitator.ts          # Custom facilitator for Monad testnet
  fraud-engine.ts               # Bytecode pattern analysis

app/
  page.tsx                      # Landing page
  dashboard/fraud-detection/    # Fraud detection dashboard
  dashboard/developer/          # Developer tools dashboard
  api/devtools/route.ts         # API bridge → Developer Agent
```

## Monad Testnet

| Resource | URL |
|----------|-----|
| RPC | `https://testnet-rpc.monad.xyz` |
| Chain ID | 10143 |
| Faucet | https://faucet.monad.xyz |
| Explorer | https://testnet.monadvision.com |

## Team

Built at **Monad Blitz Jogja** hackathon.

## License

MIT
