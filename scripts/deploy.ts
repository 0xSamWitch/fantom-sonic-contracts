import hre, {ethers, upgrades} from "hardhat";
import {networkConstants} from "../constants/network_constants";
import {deployERC1155Upgrade, deployToken, verifyContracts} from "./helpers";

// Deploy everything
async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);

  const {shouldVerify} = await networkConstants(hre);

  const oft = await deployToken();
  const erc1155 = await deployERC1155Upgrade();

  if (shouldVerify) {
    try {
      const addresses = [await oft.getAddress(), await erc1155.getAddress()];
      console.log("Verifying contracts...");
      await verifyContracts(addresses);
    } catch (e) {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
