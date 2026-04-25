// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/ReputationRegistry.sol";
import "../src/FraudReportRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IdentityRegistry identity = new IdentityRegistry();
        ReputationRegistry reputation = new ReputationRegistry();
        FraudReportRegistry fraudReport = new FraudReportRegistry();

        console.log("IdentityRegistry deployed at:", address(identity));
        console.log("ReputationRegistry deployed at:", address(reputation));
        console.log("FraudReportRegistry deployed at:", address(fraudReport));

        vm.stopBroadcast();
    }
}
