# AGENTS.md

## Repo Shape (Verified)

- Next.js App Router frontend lives in `app/` (entrypoints: `app/layout.tsx`, `app/page.tsx`).
- Styling is Tailwind CSS v4 with tokens defined in `app/globals.css` via `@theme` (no `tailwind.config.*` in this repo).
- Smart contracts are a separate Foundry project in `contracts/`.
- TypeScript (`tsconfig.json`) explicitly excludes `contracts/` and `docs/`.

## Commands (Root, pnpm)

- Install: `pnpm install`
- Dev: `pnpm dev`
- Lint: `pnpm lint` (this repo uses `eslint.config.mjs`; Next CLI in this version does not provide `next lint`).
- Build/serve: `pnpm build`, then `pnpm start`

## Contracts (Foundry, run inside `contracts/`)

- Build: `forge build`
- Test: `forge test`
- Single test file / test: `forge test --match-path test/Counter.t.sol --match-test test_Increment`
- Formatter: `forge fmt`
- Default chain config is in `contracts/foundry.toml`: `eth-rpc-url = https://testnet-rpc.monad.xyz`, `chain_id = 10143`, `solc_version = 0.8.28`.

## Non-Standard Git Helper (Easy To Misuse)

- `./push.sh "<message>"` creates 1 commit per changed file and then pushes to `origin/<current-branch>`.
- It auto-selects a conventional-commit-like type based on filename heuristics; avoid this script if you want one logical commit spanning multiple files.

## Known Stale / Mismatched Bits

- `package.json` includes `agent:*` / `agents:dev` scripts pointing at `agents/...`, but there is no `agents/` directory in the repo right now (those scripts will fail until added).
- `CLAUDE.md` still claims the repo is "template-only" and references `docs/design-reference/image.png` (not present); treat it as stale except for its `push.sh` warning.
