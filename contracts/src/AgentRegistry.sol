// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AgentRegistry {
    struct AgentInfo {
        bytes32 id;
        address owner;
        string name;
        string endpointURL;
        uint256 pricePerCall; // intended for USDC (6 decimals)
        uint256 totalCalls;
        uint256 totalEarned;
        bool active;
        uint256 registeredAt;
        string metadataURI;
    }

    event AgentRegistered(address indexed agentAddress, bytes32 indexed agentId, string metadataURI);
    event AgentUpdated(bytes32 indexed agentId, string newMetadataURI);
    event AgentDeactivated(bytes32 indexed agentId);
    event SettlementUpdated(address indexed settlement);

    address public owner;
    address public settlement;

    mapping(bytes32 => AgentInfo) private agents;
    mapping(address => bytes32[]) private agentsByOwner;
    mapping(address => uint256) private nonces;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlySettlement() {
        require(msg.sender == settlement, "NOT_SETTLEMENT");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setSettlement(address newSettlement) external onlyOwner {
        settlement = newSettlement;
        emit SettlementUpdated(newSettlement);
    }

    function registerAgent(
        string calldata name,
        string calldata endpointURL,
        uint256 pricePerCall,
        string calldata metadataURI
    ) external returns (bytes32 agentId) {
        uint256 nonce = nonces[msg.sender]++;
        agentId = keccak256(abi.encodePacked(msg.sender, nonce, block.chainid));

        AgentInfo storage a = agents[agentId];
        require(a.owner == address(0), "ALREADY_EXISTS");

        a.id = agentId;
        a.owner = msg.sender;
        a.name = name;
        a.endpointURL = endpointURL;
        a.pricePerCall = pricePerCall;
        a.totalCalls = 0;
        a.totalEarned = 0;
        a.active = true;
        a.registeredAt = block.timestamp;
        a.metadataURI = metadataURI;

        agentsByOwner[msg.sender].push(agentId);

        emit AgentRegistered(msg.sender, agentId, metadataURI);
    }

    function updateAgent(bytes32 agentId, string calldata metadataURI) external {
        AgentInfo storage a = agents[agentId];
        require(a.owner == msg.sender, "NOT_AGENT_OWNER");
        require(a.owner != address(0), "NOT_FOUND");

        a.metadataURI = metadataURI;
        emit AgentUpdated(agentId, metadataURI);
    }

    function deactivateAgent(bytes32 agentId) external {
        AgentInfo storage a = agents[agentId];
        require(a.owner == msg.sender, "NOT_AGENT_OWNER");
        require(a.owner != address(0), "NOT_FOUND");

        a.active = false;
        emit AgentDeactivated(agentId);
    }

    function recordCall(bytes32 agentId, uint256 earned) external onlySettlement {
        AgentInfo storage a = agents[agentId];
        require(a.owner != address(0), "NOT_FOUND");
        a.totalCalls += 1;
        a.totalEarned += earned;
    }

    function getAgent(bytes32 agentId) external view returns (AgentInfo memory) {
        return agents[agentId];
    }

    function getAgentsByOwner(address agentOwner) external view returns (bytes32[] memory) {
        return agentsByOwner[agentOwner];
    }

    function isActive(bytes32 agentId) external view returns (bool) {
        return agents[agentId].active;
    }
}
