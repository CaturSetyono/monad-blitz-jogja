export const CONTRACT_ADDRESSES = {
  counter: (process.env.NEXT_PUBLIC_COUNTER_ADDRESS || "") as `0x${string}` | "",
  agentRegistry: (process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS || "") as `0x${string}` | "",
  reputationModule: (process.env.NEXT_PUBLIC_REPUTATION_MODULE_ADDRESS || "") as `0x${string}` | "",
  paymentSettlement: (process.env.NEXT_PUBLIC_PAYMENT_SETTLEMENT_ADDRESS || "") as `0x${string}` | "",
} as const;
