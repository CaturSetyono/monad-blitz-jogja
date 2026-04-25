// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AgentRegistry} from "./AgentRegistry.sol";
import {ReputationModule} from "./ReputationModule.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract PaymentSettlement {
    event PaymentSettled(bytes32 indexed agentId, address indexed payer, uint256 amount, bytes32 jobId);
    event EarningsWithdrawn(address indexed operator, uint256 amount);

    AgentRegistry public immutable registry;
    ReputationModule public immutable reputation;
    IERC20 public immutable usdc;

    mapping(address => uint256) public pendingEarnings;
    uint256 public totalVolume;

    constructor(address registry_, address reputation_, address usdc_) {
        registry = AgentRegistry(registry_);
        reputation = ReputationModule(reputation_);
        usdc = IERC20(usdc_);
    }

    // Minimal v1 settlement:
    // - pulls price from AgentRegistry
    // - transfers USDC from payer to this contract
    // - credits agent owner as pending earnings
    // - records call and a reputation job
    function settle(bytes32 agentId, bytes32 jobId, uint8 rating) external {
        AgentRegistry.AgentInfo memory a = registry.getAgent(agentId);
        require(a.owner != address(0), "AGENT_NOT_FOUND");
        require(a.active, "AGENT_INACTIVE");

        uint256 amount = a.pricePerCall;
        require(amount > 0, "ZERO_PRICE");

        require(usdc.transferFrom(msg.sender, address(this), amount), "TRANSFER_FROM_FAILED");

        pendingEarnings[a.owner] += amount;
        totalVolume += amount;

        registry.recordCall(agentId, amount);
        reputation.recordJob(agentId, jobId, amount, rating);

        emit PaymentSettled(agentId, msg.sender, amount, jobId);
    }

    function withdrawEarnings() external {
        uint256 amt = pendingEarnings[msg.sender];
        require(amt > 0, "NO_EARNINGS");
        pendingEarnings[msg.sender] = 0;
        require(usdc.transfer(msg.sender, amt), "TRANSFER_FAILED");
        emit EarningsWithdrawn(msg.sender, amt);
    }
}
