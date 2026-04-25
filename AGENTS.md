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

## Useful Links

- Monad Docs: https://docs.monad.xyz
- Testnet Block Explorer: https://testnet.monadvision.com