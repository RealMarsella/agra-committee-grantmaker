// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DecisionRegistry {
    event DecisionRecorded(
        bytes32 indexed applicationId,
        string verdict,
        bytes32 evidenceHash,
        bytes32 traceHash,
        address indexed applicant,
        uint256 amount,
        address token
    );

    mapping(bytes32 => bytes32) public traces;

    function recordDecision(
        bytes32 applicationId,
        string calldata verdict,
        bytes32 evidenceHash,
        bytes32 traceHash,
        address applicant,
        uint256 amount,
        address token
    ) external {
        require(traces[applicationId] == bytes32(0), "decision already recorded");
        require(applicant != address(0), "applicant required");
        require(evidenceHash != bytes32(0), "evidence required");
        require(traceHash != bytes32(0), "trace required");

        traces[applicationId] = traceHash;
        emit DecisionRecorded(applicationId, verdict, evidenceHash, traceHash, applicant, amount, token);
    }
}
