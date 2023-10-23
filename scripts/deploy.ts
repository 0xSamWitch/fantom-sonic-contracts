import {ethers} from "hardhat";
import {deployERC1155} from "./helpers";

async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);
  await deployERC1155();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
