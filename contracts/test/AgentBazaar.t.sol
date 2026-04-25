// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {ReputationModule} from "../src/ReputationModule.sol";
import {PaymentSettlement} from "../src/PaymentSettlement.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract AgentBazaarTest is Test {
    AgentRegistry registry;
    ReputationModule reputation;
    PaymentSettlement settlement;
    MockUSDC usdc;

    address agentOwner = address(0xA11CE);
    address payer = address(0xB0B);

    function setUp() public {
        usdc = new MockUSDC();
        registry = new AgentRegistry();
        reputation = new ReputationModule();
        settlement = new PaymentSettlement(address(registry), address(reputation), address(usdc));

        registry.setSettlement(address(settlement));
    }

    function test_RegisterAndSettleAndWithdraw() public {
        vm.startPrank(agentOwner);
        bytes32 agentId = registry.registerAgent("DataAnalyst-v2", "https://api.example", 1_000_000, "ipfs://meta");
        vm.stopPrank();

        usdc.mint(payer, 5_000_000);
        vm.startPrank(payer);
        usdc.approve(address(settlement), type(uint256).max);
        bytes32 jobId = keccak256("job-1");
        settlement.settle(agentId, jobId, 5);
        vm.stopPrank();

        assertEq(settlement.pendingEarnings(agentOwner), 1_000_000);
        assertEq(settlement.totalVolume(), 1_000_000);

        AgentRegistry.AgentInfo memory a = registry.getAgent(agentId);
        assertEq(a.totalCalls, 1);
        assertEq(a.totalEarned, 1_000_000);

        (uint256 avgRating, uint256 jobsCount, uint256 disputesCount) = reputation.getReputation(agentId);
        assertEq(jobsCount, 1);
        assertEq(disputesCount, 0);
        assertEq(avgRating, 5e18);

        uint256 beforeBal = usdc.balanceOf(agentOwner);
        vm.prank(agentOwner);
        settlement.withdrawEarnings();
        uint256 afterBal = usdc.balanceOf(agentOwner);

        assertEq(afterBal - beforeBal, 1_000_000);
        assertEq(settlement.pendingEarnings(agentOwner), 0);
    }
}
