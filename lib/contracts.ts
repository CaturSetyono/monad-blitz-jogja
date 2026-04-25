export const IDENTITY_REGISTRY_ABI = [
  {
    type: "function",
    name: "registerAgent",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "capability", type: "string" },
      { name: "endpoint", type: "string" },
      { name: "walletAddress", type: "address" },
      { name: "x402Support", type: "bool" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAgent",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "capability", type: "string" },
          { name: "endpoint", type: "string" },
          { name: "walletAddress", type: "address" },
          { name: "x402Support", type: "bool" },
          { name: "active", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAgentsByCapability",
    inputs: [{ name: "capability", type: "string" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAgentByWallet",
    inputs: [{ name: "wallet", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deactivateAgent",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "activateAgent",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalAgents",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "AgentRegistered",
    inputs: [
      { name: "agentId", type: "uint256", indexed: true },
      { name: "wallet", type: "address", indexed: true },
      { name: "capability", type: "string", indexed: false },
    ],
  },
] as const;

export const REPUTATION_REGISTRY_ABI = [
  {
    type: "function",
    name: "submitFeedback",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "score", type: "uint8" },
      { name: "proofOfPayment", type: "bytes32" },
      { name: "tags", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAverageScore",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeedbackCount",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeedback",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "agentId", type: "uint256" },
          { name: "client", type: "address" },
          { name: "score", type: "uint8" },
          { name: "proofOfPayment", type: "bytes32" },
          { name: "tags", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "FeedbackSubmitted",
    inputs: [
      { name: "agentId", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "score", type: "uint8", indexed: false },
      { name: "proofOfPayment", type: "bytes32", indexed: false },
    ],
  },
] as const;

export type AgentInfo = {
  name: string;
  description: string;
  capability: string;
  endpoint: string;
  walletAddress: `0x${string}`;
  x402Support: boolean;
  active: boolean;
};

export const FRAUD_REPORT_REGISTRY_ABI = [
  {
    type: "function",
    name: "submitReport",
    inputs: [
      { name: "token", type: "address" },
      { name: "riskScore", type: "uint8" },
      { name: "flags", type: "string" },
      { name: "proofOfPayment", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getReportCount",
    inputs: [{ name: "token", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestReport",
    inputs: [{ name: "token", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "token", type: "address" },
          { name: "riskScore", type: "uint8" },
          { name: "flags", type: "string" },
          { name: "analyzer", type: "address" },
          { name: "proofOfPayment", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReport",
    inputs: [
      { name: "token", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "token", type: "address" },
          { name: "riskScore", type: "uint8" },
          { name: "flags", type: "string" },
          { name: "analyzer", type: "address" },
          { name: "proofOfPayment", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "FraudReportSubmitted",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "analyzer", type: "address", indexed: true },
      { name: "riskScore", type: "uint8", indexed: false },
      { name: "proofOfPayment", type: "bytes32", indexed: false },
    ],
  },
] as const;

export function getContractAddresses() {
  const identity = process.env.IDENTITY_REGISTRY_ADDRESS;
  const reputation = process.env.REPUTATION_REGISTRY_ADDRESS;
  const fraudReport = process.env.FRAUD_REPORT_REGISTRY_ADDRESS;
  if (!identity || !reputation || !fraudReport) {
    throw new Error("IDENTITY_REGISTRY_ADDRESS, REPUTATION_REGISTRY_ADDRESS, and FRAUD_REPORT_REGISTRY_ADDRESS must be set");
  }
  return {
    identity: identity as `0x${string}`,
    reputation: reputation as `0x${string}`,
    fraudReport: fraudReport as `0x${string}`,
  };
}
