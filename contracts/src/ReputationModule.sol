// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ReputationModule {
    struct Job {
        bytes32 id;
        address caller;
        uint256 fee;
        uint8 rating; // 1-5
        uint256 timestamp;
        bool disputed;
    }

    event JobCompleted(bytes32 indexed agentId, address indexed caller, uint256 fee, uint8 rating);
    event DisputeRaised(bytes32 indexed agentId, address indexed caller, bytes32 jobId);

    mapping(bytes32 => Job[]) private jobs;
    mapping(bytes32 => mapping(bytes32 => uint256)) private jobIndexPlusOne; // jobId => index+1

    mapping(bytes32 => uint256) public totalJobs;
    mapping(bytes32 => uint256) public disputes;
    mapping(bytes32 => uint256) private ratingSum;

    function recordJob(bytes32 agentId, bytes32 jobId, uint256 fee, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "BAD_RATING");
        require(jobIndexPlusOne[agentId][jobId] == 0, "JOB_EXISTS");

        Job memory j = Job({
            id: jobId,
            caller: msg.sender,
            fee: fee,
            rating: rating,
            timestamp: block.timestamp,
            disputed: false
        });

        jobs[agentId].push(j);
        jobIndexPlusOne[agentId][jobId] = jobs[agentId].length; // index+1

        totalJobs[agentId] += 1;
        ratingSum[agentId] += rating;

        emit JobCompleted(agentId, msg.sender, fee, rating);
    }

    function raiseDispute(bytes32 agentId, bytes32 jobId) external {
        uint256 idxPlus = jobIndexPlusOne[agentId][jobId];
        require(idxPlus != 0, "JOB_NOT_FOUND");

        Job storage j = jobs[agentId][idxPlus - 1];
        require(!j.disputed, "ALREADY_DISPUTED");

        j.disputed = true;
        disputes[agentId] += 1;
        emit DisputeRaised(agentId, msg.sender, jobId);
    }

    function getReputation(bytes32 agentId) external view returns (uint256 avgRating, uint256 jobsCount, uint256 disputesCount) {
        jobsCount = totalJobs[agentId];
        disputesCount = disputes[agentId];
        if (jobsCount == 0) {
            avgRating = 0;
        } else {
            // avgRating is returned scaled by 1e18 for UI convenience
            avgRating = (ratingSum[agentId] * 1e18) / jobsCount;
        }
    }

    function getJobHistory(bytes32 agentId, uint256 offset, uint256 limit) external view returns (Job[] memory out) {
        Job[] storage arr = jobs[agentId];
        if (offset >= arr.length) return new Job[](0);

        uint256 end = offset + limit;
        if (end > arr.length) end = arr.length;
        uint256 n = end - offset;

        out = new Job[](n);
        for (uint256 i = 0; i < n; i++) {
            out[i] = arr[offset + i];
        }
    }
}
