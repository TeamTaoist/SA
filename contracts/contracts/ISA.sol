// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ISocialAttestationInterface is IERC721 {
    function issue(
        address to,
        uint256 tokenId,
        string memory data
    ) external returns (uint256);
}
