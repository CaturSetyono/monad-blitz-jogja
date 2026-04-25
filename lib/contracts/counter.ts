import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses";
import { getAccount, readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/lib/wallet";

export const counterAbi = [
  {
    type: "function",
    name: "number",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "increment",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "setNumber",
    stateMutability: "nonpayable",
    inputs: [{ name: "newNumber", type: "uint256" }],
    outputs: [],
  },
] as const;

export function getCounterAddress() {
  const addr = CONTRACT_ADDRESSES.counter;
  if (!addr) {
    throw new Error("Missing NEXT_PUBLIC_COUNTER_ADDRESS.");
  }
  return addr;
}

export async function readCounterNumber() {
  return readContract(wagmiConfig, { address: getCounterAddress(), abi: counterAbi, functionName: "number" });
}

export async function writeCounterIncrement() {
  const { address: account } = getAccount(wagmiConfig);
  if (!account) throw new Error("No connected account.");
  const hash = await writeContract(wagmiConfig, { account, address: getCounterAddress(), abi: counterAbi, functionName: "increment" });
  return waitForTransactionReceipt(wagmiConfig, { hash });
}

export async function writeCounterSetNumber(n: bigint) {
  const { address: account } = getAccount(wagmiConfig);
  if (!account) throw new Error("No connected account.");
  const hash = await writeContract(wagmiConfig, {
    account,
    address: getCounterAddress(),
    abi: counterAbi,
    functionName: "setNumber",
    args: [n],
  });
  return waitForTransactionReceipt(wagmiConfig, { hash });
}
