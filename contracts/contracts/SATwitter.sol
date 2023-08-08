// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ISA.sol";

contract SATwitter is
    ISocialAttestationInterface,
    AccessControl,
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    // The struct representing a TwitterUser
    struct TwitterUser {
        string twitterId;
        string twitterHandle;
        string twitterName;
    }

    mapping(uint256 => TwitterUser) private _twitterUsers;

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
        (
            string memory twitterId,
            string memory twitterHandle,
            string memory twitterName
        ) = abi.decode(data, (string, string, string));

        uint256 tokenId = totalSupply() + 1;

        // Store the TwitterUser in the mapping
        _twitterUsers[tokenId] = TwitterUser(
            twitterId,
            twitterHandle,
            twitterName
        );

        super._safeMint(to, tokenId);

        return tokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        // Crafting the SVG with twitterUserId
        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
                "<style>.base { fill: white; font-family: Arial, sans-serif; font-size: 14px; }</style>",
                '<rect width="100%" height="100%" fill="blue" />',
                '<text x="175" y="175" class="base" text-anchor="middle" dominant-baseline="middle">',
                "Twitter Handle: ",
                _twitterUsers[tokenId].twitterHandle,
                "</text>",
                "</svg>"
            )
        );

        return string(abi.encodePacked("data:image/svg+xml;utf8,", svg));
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
