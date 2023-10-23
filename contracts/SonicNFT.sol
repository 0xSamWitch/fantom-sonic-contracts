// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SonicNFT is ERC1155 {
  uint immutable contractLaunchIndex;

  // URI must be in baseuri/{id}.json format
  constructor(string memory _uri) ERC1155(_uri) {
    contractLaunchIndex = block.timestamp / 1 days;
  }

  function mint() external {
    uint tokenId = block.timestamp / 1 days - contractLaunchIndex + 1;
    if (tokenId > 7) {
      tokenId = 999999;
    }
    _mint(_msgSender(), tokenId, 1, "");
  }
}
