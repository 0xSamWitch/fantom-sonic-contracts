import {ethers} from "hardhat";
import {deployERC1155} from "./helpers";

async function main() {
  const [owner] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log(`Deploying contracts with the account: ${owner.address} on chain id: ${network.chainId}`);

  // Do 4 beforehand just to keep same address on all chains
  for (let i = 0; i < 4; i++) {
    const tx = await owner.sendTransaction({to: owner.address, value: ethers.parseEther("0")});
    await tx.wait();
  }
  await deployERC1155();

  // Deploy multicall if required
  const multicall3 = await ethers.deployContract("Multicall3");
  await multicall3.waitForDeployment();
  console.log(`Multicall3 deployed to: ${await multicall3.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
