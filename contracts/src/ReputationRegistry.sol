// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ReputationRegistry {
    struct Feedback {
        uint256 agentId;
        address client;
        uint8 score;
        bytes32 proofOfPayment;
        string tags;
        uint256 timestamp;
    }

    mapping(uint256 => Feedback[]) public agentFeedback;
    mapping(uint256 => uint256) public agentTotalScore;
    mapping(uint256 => uint256) public agentFeedbackCount;

    address public owner;

    event FeedbackSubmitted(uint256 indexed agentId, address indexed client, uint8 score, bytes32 proofOfPayment);

    constructor() {
        owner = msg.sender;
    }

    function submitFeedback(
        uint256 agentId,
        uint8 score,
        bytes32 proofOfPayment,
        string calldata tags
    ) external {
        require(score >= 1 && score <= 5, "Score must be 1-5");

        Feedback memory fb = Feedback({
            agentId: agentId,
            client: msg.sender,
            score: score,
            proofOfPayment: proofOfPayment,
            tags: tags,
            timestamp: block.timestamp
        });

        agentFeedback[agentId].push(fb);
        agentTotalScore[agentId] += score;
        agentFeedbackCount[agentId]++;

        emit FeedbackSubmitted(agentId, msg.sender, score, proofOfPayment);
    }

    function getAverageScore(uint256 agentId) external view returns (uint256) {
        if (agentFeedbackCount[agentId] == 0) return 0;
        return (agentTotalScore[agentId] * 100) / agentFeedbackCount[agentId];
    }

    function getFeedbackCount(uint256 agentId) external view returns (uint256) {
        return agentFeedbackCount[agentId];
    }

    function getFeedback(uint256 agentId, uint256 index) external view returns (Feedback memory) {
        return agentFeedback[agentId][index];
    }

    function getAgentScoreScaled(uint256 agentId) external view returns (uint256) {
        uint256 avg = this.getAverageScore(agentId);
        return avg;
    }
}
