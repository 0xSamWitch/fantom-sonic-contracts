import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {TOKEN_CONTRACT_NAME} from "../constants/contracts";

describe("NFT", function () {
  async function deployContractsFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    const uri = "ipfs://CID/${id}.json";
    const nft = await ethers.deployContract(TOKEN_CONTRACT_NAME, [uri]);
    return {nft, owner, alice, bob, uri};
  }

  it("Mint", async function () {
    const {nft, owner} = await loadFixture(deployContractsFixture);

    await nft.mint();
    expect(await nft.balanceOf(owner, 0)).to.eq(0);
    expect(await nft.balanceOf(owner, 1)).to.eq(1);
    await nft.mint();
    expect(await nft.balanceOf(owner, 1)).to.eq(2);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day
    await nft.mint();
    expect(await nft.balanceOf(owner, 2)).to.eq(1);
    expect(await nft.getAllNFTs(owner.address)).to.deep.eq([2, 1, 0, 0, 0, 0, 0, 0]);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day
    await nft.mint();
    expect(await nft.balanceOf(owner, 3)).to.eq(1);
    expect(await nft.getAllNFTs(owner.address)).to.deep.eq([2, 1, 1, 0, 0, 0, 0, 0]);
    await ethers.provider.send("evm_increaseTime", [86400 * 4]); // Increase by 4 days (6 in total). Last one before generic
    await nft.mint();
    expect(await nft.balanceOf(owner, 7)).to.eq(1);
    expect(await nft.getAllNFTs(owner.address)).to.deep.eq([2, 1, 1, 0, 0, 0, 1, 0]);
    await ethers.provider.send("evm_increaseTime", [86400]); // Increase by 1 day. Hit generic
    await nft.mint();
    expect(await nft.balanceOf(owner, 8)).to.eq(1);
    expect(await nft.getAllNFTs(owner.address)).to.deep.eq([2, 1, 1, 0, 0, 0, 1, 1]);
  });

  it("uri", async function () {
    const {nft} = await loadFixture(deployContractsFixture);
    expect(await nft.uri(3)).to.eq("ipfs://CID/${id}.json");
    expect(await nft.uri(99)).to.eq("ipfs://CID/${id}.json");
  });

  it("setURI only callable by owner", async function () {
    const {nft, alice} = await loadFixture(deployContractsFixture);
    const newURI = "ipfs://newCID/${id}.json";
    await expect(nft.connect(alice).setURI(newURI)).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    await nft.setURI(newURI);
    expect(await nft.uri(2)).to.eq(newURI);
  });

  it("supportsInterface", async function () {
    const {nft} = await loadFixture(deployContractsFixture);
    expect(await nft.supportsInterface("0xd9b67a26")).to.be.true; // IERC1155
    expect(await nft.supportsInterface("0x0e89341c")).to.be.true; // IERC1155Metadata
  });
});
