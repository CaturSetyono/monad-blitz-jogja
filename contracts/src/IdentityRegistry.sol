// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract IdentityRegistry is ERC721 {
    uint256 private _nextTokenId;

    struct Agent {
        string name;
        string description;
        string capability;
        string endpoint;
        address walletAddress;
        bool x402Support;
        bool active;
    }

    mapping(uint256 => Agent) public agents;
    mapping(string => uint256[]) public agentsByCapability;
    mapping(address => uint256) public agentByWallet;

    event AgentRegistered(uint256 indexed agentId, address indexed wallet, string capability);

    constructor() ERC721("AgentBazaar Identity", "ABID") {
        _nextTokenId = 1;
    }

    function registerAgent(
        string memory name,
        string memory description,
        string memory capability,
        string memory endpoint,
        address walletAddress,
        bool x402Support
    ) external returns (uint256) {
        uint256 agentId = _nextTokenId++;

        agents[agentId] = Agent({
            name: name,
            description: description,
            capability: capability,
            endpoint: endpoint,
            walletAddress: walletAddress,
            x402Support: x402Support,
            active: true
        });

        agentsByCapability[capability].push(agentId);
        agentByWallet[walletAddress] = agentId;

        _safeMint(msg.sender, agentId);

        emit AgentRegistered(agentId, walletAddress, capability);
        return agentId;
    }

    function getAgent(uint256 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }

    function getAgentsByCapability(string memory capability) external view returns (uint256[] memory) {
        return agentsByCapability[capability];
    }

    function getAgentByWallet(address wallet) external view returns (uint256) {
        return agentByWallet[wallet];
    }

    function deactivateAgent(uint256 agentId) external {
        require(ownerOf(agentId) == msg.sender, "Not owner");
        agents[agentId].active = false;
    }

    function activateAgent(uint256 agentId) external {
        require(ownerOf(agentId) == msg.sender, "Not owner");
        agents[agentId].active = true;
    }

    function totalAgents() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
