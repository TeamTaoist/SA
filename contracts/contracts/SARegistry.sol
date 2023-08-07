// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/SignatureCheckerUpgradeable.sol";

import "./ISA.sol";

// upgradeable contract
contract SARegistry is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    mapping(address => bool) public registeredSAs;
    mapping(address => bool) public registeredAttesters;

    event SARegistered(address indexed owner, address indexed sa);
    event SAUnregistered(address indexed owner, address indexed sa);
    event AttesterRegistered(address indexed owner, address indexed attester);
    event AttesterUnregistered(address indexed owner, address indexed attester);

    modifier onlyAttester(address attester) {
        _checkAttester(attester);
        _;
    }

    /**
     * @dev Throws if the sender is not a valid attester.
     */
    function _checkAttester(address attester) internal view virtual {
        require(
            registeredAttesters[attester],
            "SARegistry: Attester is not registered"
        );
    }

    modifier onlyValidSA(address sa) {
        _checkValidSA(sa);
        _;
    }

    /**
     * @dev Throws if the sa is not a valid sa.
     */
    function _checkValidSA(address sa) internal view virtual {
        require(registeredSAs[sa], "SARegistry: SA is not registered");
    }

    function initialize() public initializer {
        __Ownable_init();
    }

    function registerSA(address sa) public onlyOwner {
        require(!registeredSAs[sa], "SARegistry: SA already registered");
        registeredSAs[sa] = true;
        emit SARegistered(msg.sender, sa);
    }

    function unregisterSA(address sa) public onlyOwner {
        require(registeredSAs[sa], "SARegistry: SA not registered");
        registeredSAs[sa] = false;
        emit SAUnregistered(msg.sender, sa);
    }

    function registerAttester(address attester) public onlyOwner {
        require(
            !registeredAttesters[attester],
            "SARegistry: Attester already registered"
        );
        registeredAttesters[attester] = true;
        emit AttesterRegistered(msg.sender, attester);
    }

    function unregisterAttester(address attester) public onlyOwner {
        require(
            registeredAttesters[attester],
            "SARegistry: Attester not registered"
        );
        registeredAttesters[attester] = false;
        emit AttesterUnregistered(msg.sender, attester);
    }

    function attest(
        address attester_,
        bytes memory signature_,
        address sa_,
        address to_,
        uint256 tokenId_,
        string memory extra_
    )
        public
        onlyAttester(attester_)
        onlyValidSA(sa_)
        nonReentrant
        returns (uint256)
    {
        ISocialAttestationInterface sa = ISocialAttestationInterface(sa_);

        return sa.issue(to_, tokenId_, extra_);
    }

    function verifySignature(
        address signer,
        bytes32 hashValue,
        bytes memory signature
    ) public view returns (bool) {
        return
            SignatureCheckerUpgradeable.isValidSignatureNow(
                signer,
                keccak256(
                    abi.encodePacked(
                        "\x19Ethereum Signed Message:\n32",
                        keccak256(abi.encodePacked(hashValue))
                    )
                ),
                signature
            );
    }
}
