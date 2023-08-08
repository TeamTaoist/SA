import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("SARegistry", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SARegistry = await ethers.getContractFactory("SARegistry");
    const saRegistry = await upgrades.deployProxy(SARegistry, []);
    await saRegistry.registerAttester(otherAccount.address);

    const SATwitter = await ethers.getContractFactory("SATwitter");
    const saTwitter = await SATwitter.deploy("SA-Twitter", "SAT");

    const SARegistryAddress = await saRegistry.getAddress();
    await saTwitter.grantRole(ethers.keccak256(ethers.encodeBytes32String("ATTESTER_ROLE")), SARegistryAddress);



    return { saRegistry, saTwitter, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Issue SATwitter", async function () {
      const { saRegistry, saTwitter, owner, otherAccount } = await loadFixture(deployFixture);

      const attester = otherAccount;
      const receiver = owner;;
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();

      const saTwitterAddress = await saTwitter.getAddress();
      await saRegistry.registerSA(saTwitterAddress);




      // const hh = ethers.hashMessage("helloworld");
      // const ss = await receiver.signMessage("helloworld");
      // const recoverSigner = ethers.verifyMessage("helloworld", ss);
      // let rr = await saRegistry.verifySignature(receiver.address, hh, ss);
      // console.log(rr);
      // console.log(`recoverSigner: ${recoverSigner}, signer: ${receiver.address}`);

      // const h = ethers.solidityPackedKeccak256(["string"], ["HelloWorld"]);
      // const s = await receiver.signMessage(h);
      // let r = await saRegistry.verifySignature(receiver.address, ethers.hashMessage(h), s);
      // console.log(r);

      // const testData = abiCoder.encode(["string"], ["HelloWorld"]);
      // const testHash = ethers.keccak256(testData);
      // const testSig = await receiver.signMessage(testHash);
      // let testRet = await saRegistry.verifySignature(receiver.address, ethers.hashMessage(testHash), testSig);
      // console.log(testRet);


      const data1 = abiCoder.encode(["address"], [saTwitterAddress]);
      const hashValue1 = ethers.keccak256(data1);
      const sig1 = await receiver.signMessage(hashValue1);


      let ret1 = await saRegistry.verifySignature(receiver.address, ethers.hashMessage(hashValue1), sig1);
      console.log(ret1);

      const timestamp = ethers.toBigInt("1610875341337432067");
      const twitterUserId = ethers.toBigInt("1610875341337432067");
      const extraInfo = abiCoder.encode(["bytes", "uint256", "uint256"], [sig1, twitterUserId, timestamp]);

      const data2 = abiCoder.encode(["address", "address", "bytes"], [saTwitterAddress, receiver.address, extraInfo]);
      const hashValue2 = ethers.keccak256(data2);
      const sig2 = await attester.signMessage(hashValue2);


      let ret2 = await saRegistry.verifySignature(attester.address, ethers.hashMessage(hashValue2), sig2);
      console.log(ret2);

      // console.log("extraInfo", extraInfo);
      console.log("data2\n", data2);
      console.log("hashValue2\n", hashValue2);
      console.log("hashed Message2\n", ethers.hashMessage(hashValue2));
      console.log("sig2\n", sig2);

      await saRegistry.attest(attester.address, sig2, saTwitterAddress, receiver.address, extraInfo);



    });
  });
});
