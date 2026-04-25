import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { x402Client } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { toClientEvmSigner } from "@x402/evm";
import { wrapFetchWithPayment } from "@x402/fetch";
import { monadTestnet, MONAD_NETWORK } from "./monad";

export function createPaidFetch(privateKey: `0x${string}`) {
  const account = privateKeyToAccount(privateKey);
  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
  const signer = toClientEvmSigner(account, publicClient);
  const scheme = new ExactEvmScheme(signer);
  const client = new x402Client().register(MONAD_NETWORK, scheme);
  return wrapFetchWithPayment(fetch, client);
}

export function getAgentWallet(privateKey: `0x${string}`) {
  return privateKeyToAccount(privateKey);
}

export function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
}
