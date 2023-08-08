import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("SA", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attester, user] = await ethers.getSigners();

    const SARegistry = await ethers.getContractFactory("SARegistry");
    const saRegistry = await upgrades.deployProxy(SARegistry, []);
    await saRegistry.registerAttester(attester.address);

    const SATwitter = await ethers.getContractFactory("SATwitter");
    const saTwitter = await SATwitter.deploy("SA-Twitter", "SAT");

    const SARegistryAddress = await saRegistry.getAddress();

    await saTwitter.grantRole(ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE")), SARegistryAddress);

    const saTwitterAddress = await saTwitter.getAddress()
    await saRegistry.registerSA(saTwitterAddress);

    return { saRegistry, saTwitter, owner, attester, user };
  }

  describe("SA Twitter", function () {

    it("should mint a token to the specified address if called by attester", async function () {
      const { saTwitter, owner, user } = await loadFixture(deployFixture);
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const data = abiCoder.encode(["string", "string", "string"], ["twitterId", "twitterHandle", "twitterName"])

      await expect(
        saTwitter.connect(owner).issue(user.address, data)
      )
        .to.emit(saTwitter, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, 1);

      expect(await saTwitter.ownerOf(1)).to.equal(user.address);
    });


    it("should revert if called by non-attester", async function () {
      const { saTwitter, user } = await loadFixture(deployFixture);

      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const data = abiCoder.encode(["string", "string", "string"], ["twitterId", "twitterHandle", "twitterName"])

      await expect(saTwitter.connect(user).issue(user.address, data)).to.be.reverted;
    });

    it("tokenURI should return valid URI for the minted token", async function () {
      const { saTwitter, user } = await loadFixture(deployFixture);
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const data = abiCoder.encode(["string", "string", "string"], ["twitterId", "twitterHandle", "twitterName"])
      await saTwitter.issue(user.address, data);
      const uri = await saTwitter.tokenURI(1);

      expect(uri).to.contain("data:image/svg+xml;utf8,");
      expect(uri).to.contain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(uri).to.contain("Twitter Handle: twitterHandle");
    });
  });

  describe("SA Registry", function () {
    it("should allow registering and unregistering of SAs", async function () {
      const { saRegistry, saTwitter } = await loadFixture(deployFixture);

      const saTwitterAddress = await saTwitter.getAddress()
      const SA_REGISTRY = {
        SA_ROLE: ethers.keccak256(ethers.toUtf8Bytes("SA_ROLE")),
        ATTESTER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE"))
      };

      // Registering an SA
      await saRegistry.registerSA(saTwitterAddress);
      expect(await saRegistry.hasRole(SA_REGISTRY.SA_ROLE, saTwitterAddress)).to.be.true;

      // Unregistering an SA
      await saRegistry.unregisterSA(saTwitterAddress);
      expect(await saRegistry.hasRole(SA_REGISTRY.SA_ROLE, saTwitterAddress)).to.be.false;
    });

    it("should allow registering and unregistering of Attesters", async function () {
      const { saRegistry, attester } = await loadFixture(deployFixture);

      const SA_REGISTRY = {
        SA_ROLE: ethers.keccak256(ethers.toUtf8Bytes("SA_ROLE")),
        ATTESTER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE"))
      };

      // Registering an Attester
      await saRegistry.registerAttester(attester.address);
      expect(await saRegistry.hasRole(SA_REGISTRY.ATTESTER_ROLE, attester.address)).to.be.true;

      // Unregistering an Attester
      await saRegistry.unregisterAttester(attester.address);
      expect(await saRegistry.hasRole(SA_REGISTRY.ATTESTER_ROLE, attester.address)).to.be.false;
    });

    it("should allow a valid attester to attest", async function () {
      const { saRegistry, saTwitter, attester, user } = await loadFixture(deployFixture);

      const saTwitterAddress = await saTwitter.getAddress()

      const timestamp = BigInt(await time.latest());// Get current block timestamp

      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const saPayload = abiCoder.encode(["string", "string", "string"], ["twitterId", "twitterHandle", "twitterName"])

      // Construct the data to be signed
      const dataToSign = ethers.keccak256(
        ethers.solidityPacked(
          ["address", "address", "uint256", "address", "bytes"],
          [attester.address, user.address, timestamp, saTwitterAddress, saPayload]
        )
      );

      const messageBytes = ethers.getBytes(dataToSign)

      // Attester and user sign the data
      const attesterSig = await attester.signMessage(messageBytes);
      const userSig = await user.signMessage(messageBytes);

      // Execute the attest function
      await saRegistry.attest(attester.address, attesterSig, user.address, userSig, timestamp, saTwitterAddress, saPayload);

      // Confirm the user received the token
      expect(await saTwitter.ownerOf(1)).to.equal(user.address);
    });
  });
});
