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
    bytes public constant chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    mapping(uint256 => uint256) private _twitterUserIds;

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
        _twitterUserIds[tokenId] = twitterUserId;
        super._safeMint(to, tokenId);
        return twitterUserId;
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
                "Twitter User ID: ",
                _twitterUserIds[tokenId].toString(),
                "</text>",
                "</svg>"
            )
        );

        string memory base64Svg = _encode(svg);

        return
            string(abi.encodePacked("data:image/svg+xml;base64,", base64Svg));
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

    // Helper function to encode SVG to base64
    function _encode(
        string memory _data
    ) internal pure returns (string memory) {
        bytes memory _dataBytes = bytes(_data);
        return string(abi.encodePacked(_base64encode(_dataBytes)));
    }

    function _base64encode(
        bytes memory _data
    ) internal pure returns (string memory) {
        bytes memory encoded = new bytes(((_data.length + 2) / 3) * 4);

        uint256 i = 0;
        uint256 j = 0;
        while (i < _data.length) {
            uint256 a = i < _data.length ? uint256(uint8(_data[i])) : 0;
            uint256 b = i + 1 < _data.length ? uint256(uint8(_data[i + 1])) : 0;
            uint256 c = i + 2 < _data.length ? uint256(uint8(_data[i + 2])) : 0;

            uint256 triplet = (a << 0x10) + (b << 0x08) + c;

            encoded[j++] = bytes1(uint8(chars[(triplet >> (3 * 6)) & 0x3F]));
            encoded[j++] = bytes1(uint8(chars[(triplet >> (2 * 6)) & 0x3F]));
            encoded[j++] = bytes1(uint8(chars[(triplet >> (1 * 6)) & 0x3F]));
            encoded[j++] = bytes1(uint8(chars[(triplet >> (0 * 6)) & 0x3F]));

            i += 3;
        }

        // Add padding
        if (_data.length % 3 == 1) {
            encoded[j - 1] = "=";
            encoded[j - 2] = "=";
        } else if (_data.length % 3 == 2) {
            encoded[j - 1] = "=";
        }

        return string(encoded);
    }
}
