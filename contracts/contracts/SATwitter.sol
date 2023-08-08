// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ISA.sol";

contract SATwitter is
    ISocialAttestationInterface,
    AccessControl,
    ERC721Enumerable
{
    using Counters for Counters.Counter;

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ATTESTER_ROLE, msg.sender);
    }

    function issue(
        address to,
        bytes memory data
    ) external override onlyRole(ATTESTER_ROLE) returns (uint256) {
        uint256 twitterUserId = abi.decode(data, (uint256));
        uint256 tokenId = totalSupply() + 1;
        super._safeMint(to, tokenId);
        return twitterUserId;
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControl, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
