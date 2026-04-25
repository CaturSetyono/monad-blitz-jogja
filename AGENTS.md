# AGENTS.md — AgentBazaar

**Project:** Trustless gig economy for autonomous AI agents on Monad.
**Stack:** Next.js 16 · Solidity (Foundry) · x402 payments · viem/ethers · Tailwind 4

---

## Commands

```bash
# Install (pnpm only — lockfile is pnpm)
pnpm install

# Next.js dev server
pnpm dev

# Start all agent services concurrently (express servers via tsx)
pnpm agents:dev

# Individual agents
pnpm agent:analyst    # tsx agents/analyst/index.ts
pnpm agent:codewriter # tsx agents/codewriter/index.ts
pnpm agent:router     # tsx agents/router/index.ts

# Contracts (run from contracts/)
cd contracts
forge build
forge test -vv
forge script script/Deploy.s.sol:Deploy --broadcast --private-key $DEPLOYER_PRIVATE_KEY
forge script script/RegisterAgent.s.sol:RegisterAgent --broadcast --private-key $DEPLOYER_PRIVATE_KEY
```

## Architecture

Two separate systems in one repo:

### `contracts/` — Solidity (Foundry)
- `src/IdentityRegistry.sol` — ERC-721. Each agent = NFT with metadata (name, capability, endpoint, wallet, x402 flag). Agent IDs start at 1.
- `src/ReputationRegistry.sol` — Stores per-agent feedback (score 1-5, proofOfPayment). `getAverageScore()` returns scaled by 100 (e.g. 400 = 4.00).
- OpenZeppelin remapping: `@openzeppelin/contracts/` → `lib/openzeppelin-contracts/contracts/`
- Solidity 0.8.28, Monad testnet (chain 10143)

### Root — TypeScript/Next.js
- `app/` — Next.js App Router (frontend skeleton, no page.tsx yet)
- `agents/` — Independent Express HTTP servers, each run as a separate process via `tsx`
  - `agents/analyst/` — Agent A: data-analysis capability
  - `agents/codewriter/` — Agent B: code-generation, can sub-hire analyst via x402
  - `agents/router/` — Task Router: queries on-chain registry, delegates to workers
- `lib/` — Shared utilities (empty, intended for contract ABIs/addresses)
- `app/api/task/` — Next.js API route placeholder for web→router bridge

### Payment: x402 protocol
All agent `/task` endpoints use x402 middleware (`@x402/next` or express wrapper). Agents call each other with `@x402/fetch` (`withPayment`). Denominated in USDC on Monad testnet.

## Key Conventions

- **Package manager:** pnpm (do not use npm or yarn)
- **Path alias:** `@/*` maps to repo root (see `tsconfig.json` paths)
- **tsconfig excludes `contracts/`** — Solidity is a separate build system
- **No comments in code** unless explicitly requested
- **Env files:** `.env` / `.env.*` are gitignored; `.env.example` is tracked
- **Foundry artifacts** (`contracts/cache/`, `contracts/out/`, `contracts/broadcast/`) are gitignored
- **`contracts/lib/`** (forge dependencies like openzeppelin-contracts) is NOT gitignored — it gets committed

## Environment Variables

Contracts need `DEPLOYER_PRIVATE_KEY`. RegisterAgent script additionally needs `IDENTITY_REGISTRY_ADDRESS`, `AGENT_NAME`, `AGENT_DESCRIPTION`, `AGENT_CAPABILITY`, `AGENT_ENDPOINT`, `AGENT_WALLET`. All loaded via `vm.env*()` in Forge scripts.

Agent services need `MONAD_TESTNET_RPC`, `IDENTITY_REGISTRY_ADDRESS`, `REPUTATION_REGISTRY_ADDRESS`, plus per-agent wallet keys.

## Monad Testnet

- RPC: `https://testnet-rpc.monad.xyz`
- Chain ID: 10143
- Faucet: https://faucet.monad.xyz
- Block Explorer: https://testnet.monadvision.com
