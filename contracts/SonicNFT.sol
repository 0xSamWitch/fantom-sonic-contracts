// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SonicNFT is ERC1155, Ownable {
  uint immutable contractLaunchIndex;
  uint constant MAX_UNIQUE_NFTS = 8;

  // URI must be in baseuri/{id}.json format
  constructor(string memory _uri) ERC1155(_uri) Ownable(msg.sender) {
    contractLaunchIndex = block.timestamp / 1 days;
  }

  function mint() external {
    uint tokenId = block.timestamp / 1 days - contractLaunchIndex + 1;
    if (tokenId >= MAX_UNIQUE_NFTS) {
      tokenId = MAX_UNIQUE_NFTS;
    }
    _mint(_msgSender(), tokenId, 1, "");
  }

  function setURI(string memory _uri) external onlyOwner {
    _setURI(_uri);
  }

  // Returns the number of NFTs owned by `_account` for each of the 8 types of NFTs
  // tokenIds 1 through 7 and the generic NFT with tokenId 999999
  function getAllNFTs(address _account) external view returns (uint[8] memory counts) {
    for (uint i = 0; i < 8; ++i) {
      counts[i] = balanceOf(_account, i + 1);
    }
  }

  function name() public pure returns (string memory) {
    return "Sonic NFT";
  }
}
