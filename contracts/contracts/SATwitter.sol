// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ISA.sol";

contract SATwitter is ISocialAttestationInterface, ERC721, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ATTESTER_ROLE, msg.sender);
    }

    // fixme: need handle re-issue token case!
    function issue(
        address to,
        uint256 tokenId,
        string memory data
    ) public onlyRole(ATTESTER_ROLE) returns (uint256) {
        return _issueSA(to, tokenId, data);
    }

    // fixme: need handle re-issue token case!
    function _issueSA(
        address to,
        uint256 twitterUserId,
        string memory twitterHandle
    ) public onlyRole(ATTESTER_ROLE) returns (uint256) {
        super._safeMint(to, twitterUserId);
        return twitterUserId;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
