// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";

contract RegisterAgent is Script {
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address identityAddr = vm.envAddress("IDENTITY_REGISTRY_ADDRESS");
        string memory name = vm.envString("AGENT_NAME");
        string memory description = vm.envString("AGENT_DESCRIPTION");
        string memory capability = vm.envString("AGENT_CAPABILITY");
        string memory endpoint = vm.envString("AGENT_ENDPOINT");
        address wallet = vm.envAddress("AGENT_WALLET");

        vm.startBroadcast(pk);

        IdentityRegistry identity = IdentityRegistry(identityAddr);
        uint256 agentId = identity.registerAgent(name, description, capability, endpoint, wallet, true);

        console.log("Agent registered with ID:", agentId);

        vm.stopBroadcast();
    }
}
