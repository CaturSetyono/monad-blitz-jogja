import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Chain,
} from "viem";

export const monadTestnet: Chain = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "MonadVision", url: "https://testnet.monadvision.com" },
  },
};

function getInjectedProvider() {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: unknown }).ethereum ?? null;
}

export function getPublicClient() {
  return createPublicClient({ chain: monadTestnet, transport: http() });
}

export function getWalletClient() {
  const eth = getInjectedProvider();
  if (!eth) throw new Error("No injected wallet found (window.ethereum).");
  // viem expects an EIP-1193 provider; injected wallets conform but TS doesn't know that.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createWalletClient({ chain: monadTestnet, transport: custom(eth as any) });
}

export async function getChainId() {
  const eth = getInjectedProvider();
  if (!eth) throw new Error("No injected wallet found (window.ethereum).");
  const client = getWalletClient();
  return client.getChainId();
}

export async function getConnectedAddress(): Promise<`0x${string}` | null> {
  try {
    const client = getWalletClient();
    const addrs = await client.getAddresses();
    return addrs[0] ?? null;
  } catch {
    return null;
  }
}

export async function connectWallet(): Promise<{ address: `0x${string}`; chainId: number }> {
  const client = getWalletClient();
  // triggers the wallet prompt
  const [address] = await client.requestAddresses();
  const chainId = await client.getChainId();
  return { address, chainId };
}

export async function switchToMonadTestnet() {
  const eth = getInjectedProvider();
  if (!eth) throw new Error("No injected wallet found (window.ethereum).");

  const hexChainId = "0x" + monadTestnet.id.toString(16);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = eth as any;
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexChainId }] });
  } catch (e) {
    // 4902: unknown chain
    const err = e as { code?: number };
    if (err?.code !== 4902) throw e;

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: hexChainId,
          chainName: monadTestnet.name,
          nativeCurrency: monadTestnet.nativeCurrency,
          rpcUrls: monadTestnet.rpcUrls.default.http,
          blockExplorerUrls: [monadTestnet.blockExplorers?.default.url ?? "https://testnet.monadvision.com"],
        },
      ],
    });
  }
}
