import { getPublicClient, getWalletClient } from "@/lib/evm";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses";

const counterAbi = [
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

function getCounterAddress() {
  const addr = CONTRACT_ADDRESSES.counter;
  if (!addr) {
    throw new Error("Missing NEXT_PUBLIC_COUNTER_ADDRESS.");
  }
  return addr;
}

export async function readCounterNumber() {
  const client = getPublicClient();
  return client.readContract({ address: getCounterAddress(), abi: counterAbi, functionName: "number" });
}

export async function writeCounterIncrement() {
  const client = getWalletClient();
  const [account] = await client.getAddresses();
  if (!account) throw new Error("No connected account.");
  return client.writeContract({ account, address: getCounterAddress(), abi: counterAbi, functionName: "increment" });
}

export async function writeCounterSetNumber(n: bigint) {
  const client = getWalletClient();
  const [account] = await client.getAddresses();
  if (!account) throw new Error("No connected account.");
  return client.writeContract({ account, address: getCounterAddress(), abi: counterAbi, functionName: "setNumber", args: [n] });
}
