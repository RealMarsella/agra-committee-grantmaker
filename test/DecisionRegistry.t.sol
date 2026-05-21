// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "../contracts/DecisionRegistry.sol";

contract DecisionRegistryTest {
    function assertEqBytes32(bytes32 actual, bytes32 expected) internal pure {
        require(actual == expected, "bytes32 mismatch");
    }

    function testRecordsDecisionTrace() public {
        DecisionRegistry registry = new DecisionRegistry();
        bytes32 applicationId = keccak256("agra-001");
        bytes32 evidenceHash = keccak256("evidence");
        bytes32 traceHash = keccak256("trace");
        address applicant = address(0xA11CE);
        address token = address(0x3600000000000000000000000000000000000000);

        registry.recordDecision(applicationId, "accepted", evidenceHash, traceHash, applicant, 18e6, token);

        assertEqBytes32(registry.traces(applicationId), traceHash);
    }

    function testRejectsDuplicateDecision() public {
        DecisionRegistry registry = new DecisionRegistry();
        bytes32 applicationId = keccak256("agra-001");
        bytes32 evidenceHash = keccak256("evidence");
        bytes32 traceHash = keccak256("trace");
        address applicant = address(0xA11CE);
        address token = address(0x3600000000000000000000000000000000000000);

        registry.recordDecision(applicationId, "accepted", evidenceHash, traceHash, applicant, 18e6, token);

        try registry.recordDecision(applicationId, "accepted", evidenceHash, traceHash, applicant, 18e6, token) {
            revert("duplicate accepted");
        } catch Error(string memory reason) {
            require(keccak256(bytes(reason)) == keccak256(bytes("decision already recorded")), "wrong revert reason");
        }
    }
}
