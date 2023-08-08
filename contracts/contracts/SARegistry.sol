// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/SignatureCheckerUpgradeable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "./ISA.sol";
import "hardhat/console.sol";

contract SARegistry is ReentrancyGuardUpgradeable, AccessControl {
    bytes32 public constant SA_ROLE = keccak256("SA_ROLE");
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    event SARegistered(address indexed registrar, address indexed sa);
    event SAUnregistered(address indexed registrar, address indexed sa);
    event AttesterRegistered(
        address indexed registrar,
        address indexed attester
    );
    event AttesterUnregistered(
        address indexed registrar,
        address indexed attester
    );

    function initialize() public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerSA(address sa) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SA_ROLE, sa);
        emit SARegistered(msg.sender, sa);
    }

    function unregisterSA(address sa) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SA_ROLE, sa);
        emit SAUnregistered(msg.sender, sa);
    }

    function registerAttester(
        address attester
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ATTESTER_ROLE, attester);
        emit AttesterRegistered(msg.sender, attester);
    }

    function unregisterAttester(
        address attester
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ATTESTER_ROLE, attester);
        emit AttesterUnregistered(msg.sender, attester);
    }

    function bytes32ToUintArray(
        bytes32 _bytes32
    ) public pure returns (uint8[] memory) {
        uint8[] memory numberArray = new uint8[](32);
        for (uint i = 0; i < 32; i++) {
            numberArray[i] = uint8(_bytes32[i]);
        }
        return numberArray;
    }

    function attest(
        address attester,
        bytes memory attesterSig,
        address user,
        bytes memory userSig,
        string memory timestamp,
        address sa,
        bytes memory saPayload
    ) public returns (uint256) {
        require(
            hasRole(ATTESTER_ROLE, attester),
            "SARegistry: Attester is not registered"
        );
        require(hasRole(SA_ROLE, sa), "SARegistry: SA is not registered");

        // Construct the data
        bytes32 dataToSign = keccak256(
            abi.encodePacked(attester, user, timestamp, sa, saPayload)
        );

        uint8[] memory byteArray = bytes32ToUintArray(dataToSign);
        for (uint i = 0; i < 32; i++) {
            console.log("Byte %d: %d", i, byteArray[i]);
        }

        (
            address recovered,
            ECDSAUpgradeable.RecoverError error
        ) = ECDSAUpgradeable.tryRecover(dataToSign, attesterSig);

        console.log(attester);
        console.log(recovered);

        // Check the signatures
        require(
            SignatureCheckerUpgradeable.isValidSignatureNow(
                attester,
                dataToSign,
                attesterSig
            ),
            "Invalid attester signature"
        );

        require(
            SignatureCheckerUpgradeable.isValidSignatureNow(
                user,
                dataToSign,
                userSig
            ),
            "Invalid user signature"
        );

        // Call the issue function on the SA
        ISocialAttestationInterface saContract = ISocialAttestationInterface(
            sa
        );
        return saContract.issue(user, saPayload);
    }
}
