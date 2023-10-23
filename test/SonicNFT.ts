import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {TOKEN_CONTRACT_NAME} from "../constants/contracts";

describe("SonicNFT", function () {
  async function deployContractsFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    const uri = "ipfs://CID/${id}.json";
    const sonicNFT = await ethers.deployContract(TOKEN_CONTRACT_NAME, [uri]);
    return {sonicNFT, owner, alice, bob, uri};
  }

  it("Mint", async function () {
    const {sonicNFT, owner} = await loadFixture(deployContractsFixture);

    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 0)).to.eq(0);
    expect(await sonicNFT.balanceOf(owner, 1)).to.eq(1);
    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 1)).to.eq(2);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day
    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 2)).to.eq(1);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day
    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 3)).to.eq(1);
    await ethers.provider.send("evm_increaseTime", [86400 * 4]); // Increase by 4 days (6 in total)
    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 7)).to.eq(1);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day. Last one until we hit the generic
    await sonicNFT.mint();
    expect(await sonicNFT.balanceOf(owner, 999999)).to.eq(1);
  });

  it("uri", async function () {
    const {sonicNFT} = await loadFixture(deployContractsFixture);
    expect(await sonicNFT.uri(3)).to.eq("ipfs://CID/${id}.json");
    expect(await sonicNFT.uri(99)).to.eq("ipfs://CID/${id}.json");
  });

  it("setURI only callable by owner", async function () {
    const {sonicNFT, alice} = await loadFixture(deployContractsFixture);
    const newURI = "ipfs://newCID/${id}.json";
    await expect(sonicNFT.connect(alice).setURI(newURI)).to.be.revertedWithCustomError(
      sonicNFT,
      "OwnableUnauthorizedAccount"
    );
    await sonicNFT.setURI(newURI);
    expect(await sonicNFT.uri(2)).to.eq(newURI);
  });

  it("supportsInterface", async function () {
    const {sonicNFT} = await loadFixture(deployContractsFixture);
    expect(await sonicNFT.supportsInterface("0xd9b67a26")).to.be.true; // IERC1155
    expect(await sonicNFT.supportsInterface("0x0e89341c")).to.be.true; // IERC1155Metadata
  });
});
