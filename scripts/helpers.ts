import {ethers, run} from "hardhat";
import {TOKEN_CONTRACT_NAME} from "../constants/contracts";
import {SonicNFT} from "../typechain-types";

// If there's an error with build-info not matching then delete cache/artifacts folder and try again
export const verifyContracts = async (addresses: string[], args: any[][] = []) => {
  for (const address of addresses) {
    const constructorArguments = args.length == addresses.length ? args[addresses.indexOf(address)] : [];
    await run("verify:verify", {
      address,
      constructorArguments,
    });
  }
  console.log("Verified all contracts");
};

export const deployERC1155 = async (): Promise<SonicNFT> => {
  const sonicNFT = await ethers.deployContract(TOKEN_CONTRACT_NAME, [
    "ipfs://QmWdNxB4twbVfsDhbJvi2BwVUJXxn6uEkyAXvNucs4UiJ1/${id}.json",
  ]);
  await sonicNFT.waitForDeployment();
  console.log(`SonicNFT deployed to: ${await sonicNFT.getAddress()}`);
  return sonicNFT;
};
