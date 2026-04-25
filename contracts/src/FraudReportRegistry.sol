// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FraudReportRegistry {
    struct Report {
        address token;
        uint8 riskScore;
        string flags;
        address analyzer;
        bytes32 proofOfPayment;
        uint256 timestamp;
    }

    mapping(address => Report[]) public tokenReports;
    mapping(address => uint256) public analyzerReportCount;

    address public owner;

    event FraudReportSubmitted(
        address indexed token,
        address indexed analyzer,
        uint8 riskScore,
        bytes32 proofOfPayment
    );

    constructor() {
        owner = msg.sender;
    }

    function submitReport(
        address token,
        uint8 riskScore,
        string calldata flags,
        bytes32 proofOfPayment
    ) external {
        require(riskScore <= 100, "Risk score must be 0-100");
        require(token != address(0), "Invalid token address");

        Report memory r = Report({
            token: token,
            riskScore: riskScore,
            flags: flags,
            analyzer: msg.sender,
            proofOfPayment: proofOfPayment,
            timestamp: block.timestamp
        });

        tokenReports[token].push(r);
        analyzerReportCount[msg.sender]++;

        emit FraudReportSubmitted(token, msg.sender, riskScore, proofOfPayment);
    }

    function getReportCount(address token) external view returns (uint256) {
        return tokenReports[token].length;
    }

    function getLatestReport(address token) external view returns (Report memory) {
        require(tokenReports[token].length > 0, "No reports");
        return tokenReports[token][tokenReports[token].length - 1];
    }

    function getReport(address token, uint256 index) external view returns (Report memory) {
        return tokenReports[token][index];
    }
}
