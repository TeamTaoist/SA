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
    const [owner, registryAttester, user] = await ethers.getSigners();

    const SARegistry = await ethers.getContractFactory("SARegistry");
    const saRegistry = await upgrades.deployProxy(SARegistry, []);
    await saRegistry.registerAttester(registryAttester.address);

    const SATwitter = await ethers.getContractFactory("SATwitter");
    const saTwitter = await SATwitter.deploy("SA-Twitter", "SAT");

    const SARegistryAddress = await saRegistry.getAddress();
    
    await saTwitter.grantRole(ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE")), SARegistryAddress);
    
    const saTwitterAddress = await saTwitter.getAddress()
    await saRegistry.registerSA(saTwitterAddress);

    return { saRegistry, saTwitter, owner, registryAttester, user };
  }

  describe.skip("SA Twitter", function () {

    it("should mint a token to the specified address if called by attester", async function () {
      const { saTwitter, owner, user } = await loadFixture(deployFixture);
      const twitterUserId = 123456789;
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const data = abiCoder.encode(["uint256"], [twitterUserId])

      await expect(
        saTwitter.connect(owner).issue(user.address, data)
      )
        .to.emit(saTwitter, "Transfer")
        .withArgs(ethers.ZeroAddress, user.address, 1);

      expect(await saTwitter.ownerOf(1)).to.equal(user.address);
    });


    it("should revert if called by non-attester", async function () {
      const { saTwitter, user } = await loadFixture(deployFixture);

      const twitterUserId = 123456789;
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const data = abiCoder.encode(["uint256"], [twitterUserId])

      await expect(saTwitter.connect(user).issue(user.address, data)).to.be.reverted;
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
        const { saRegistry, registryAttester } = await loadFixture(deployFixture);

        const SA_REGISTRY = {
          SA_ROLE: ethers.keccak256(ethers.toUtf8Bytes("SA_ROLE")),
          ATTESTER_ROLE: ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE"))
        };

        // Registering an Attester
        await saRegistry.registerAttester(registryAttester.address);
        expect(await saRegistry.hasRole(SA_REGISTRY.ATTESTER_ROLE, registryAttester.address)).to.be.true;

        // Unregistering an Attester
        await saRegistry.unregisterAttester(registryAttester.address);
        expect(await saRegistry.hasRole(SA_REGISTRY.ATTESTER_ROLE, registryAttester.address)).to.be.false;
    });

    it("should allow a valid attester to attest", async function () {
        const { saRegistry, saTwitter, registryAttester, user } = await loadFixture(deployFixture);

        const saTwitterAddress = await saTwitter.getAddress()

        const abiCoder = ethers.AbiCoder.defaultAbiCoder();

        const timestamp = time.latest().toString(); // Get current block timestamp
        const saPayload = abiCoder.encode(["uint256"], [123456789]);
        
        // Construct the data to be signed
        const dataToSign = ethers.keccak256(
            abiCoder.encode(
                ["address", "address", "string", "address", "bytes"],
                [registryAttester.address, user.address, timestamp, saTwitterAddress, saPayload]
            )
        );
        
        // Attester and user sign the data
        const attesterSig = await registryAttester.signMessage(ethers.toUtf8Bytes(dataToSign));
        const userSig = await user.signMessage(ethers.toUtf8Bytes(dataToSign));

        // Execute the attest function
        await saRegistry.attest(registryAttester.address, attesterSig, user.address, userSig, timestamp, saTwitterAddress, saPayload);

        // Confirm the user received the token
        expect(await saTwitter.ownerOf(1)).to.equal(user.address);
    });
  });
});
