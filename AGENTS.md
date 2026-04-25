# AGENTS.md - Monad Blitz Yogyakarta Hackathon Template

This is an empty forkable template for hackathon project submissions.

## How to Start

1. Fork `monad-developers/monad-blitz-jogja` on GitHub
2. Rename the fork to your project name
3. Add your project code

## Development

**RPC**: `https://testnet-rpc.monad.xyz` (Chain ID: 10143)
**Faucet**: https://faucet.monad.xyz

**Recommended toolchain**:
```bash
curl -L https://foundry.category.xyz | bash
foundryup --network monad
```

**Example `foundry.toml`**:
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
eth-rpc-url = "https://testnet-rpc.monad.xyz"
chain_id = 10143
```

**Deploy**:
```bash
forge create src/YourContract.sol:YourContract --broadcast --private-key $PRIVATE_KEY
```

## Submission

Submit via [Blitz Portal](https://blitz.devnads.com)

## Hackathon Starter Templates

Ready-made templates from [awesome-monad-hackathon-templates](https://github.com/Kali-Decoder/awesome-monad-hackathon-templates):

| Template | Stack | Use Case |
|----------|-------|----------|
| `monad-portfolio-viewer-using-moralis-api` | Next.js, Reown AppKit, Moralis API | Token portfolio viewer with wallet search |
| `monad-add swaps to your app using Kuru-template` | Next.js, Kuru Flow API | Token swap interface, native MON support |
| `monad-x402-template` | Next.js, Thirdweb, x402 Protocol | Pay-per-use API endpoints (HTTP 402) |
| `monad-oracles-hardhat-template` | Hardhat, Solidity, Ethers.js | Chronicle, Pyth, Redstone, Stork, Switchboard oracles |
| `Monad-Envio-token-tracker-template` | Envio, GraphQL | ERC20 token & pool indexer |
| `farcaster-push-notification-template` | Next.js, Farcaster SDK, Upstash | Farcaster Mini App with push notifications |
| `Monad Embeded Wallet Template` | Next.js, Privy, Wagmi | Embedded wallet auth + counter contract |
| `Smart-Wallet-Privy-Template` | Next.js, Privy | Smart wallet with batch tx, server-side auth |
| `Thirdweb Wallet-Template` | Next.js, Thirdweb React v4 | Simple wallet connect UI |
| `Monad-Staking-Template` | Hardhat, Next.js | Staking + reward token contracts + frontend |
| `pyth-vrf-template` | Hardhat, Pyth Entropy | On-chain randomness (VRF) |

Each template has its own README with setup steps and env vars.

## Useful Links

- Monad Docs: https://docs.monad.xyz
- Testnet Block Explorer: https://testnet.monadvision.com
- Mainnet Block Explorer: https://monadvision.com
- Token Lists: https://github.com/monad-crypto/token-list