import {ethers} from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(`owner = ${owner.address}\n  on chain id: ${(await ethers.provider.getNetwork()).chainId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
