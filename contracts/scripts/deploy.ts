import { ethers, upgrades } from "hardhat";
import deployed from "./deployed/";

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  console.log("Deploy SARegistry contract...");
  const saRegistry = await ethers.getContractAt("SARegistry", deployed.getSARegistryContract());
  console.log('deployed SARegistry address: ', await saRegistry.getAddress());


  console.log("Deploy SATwitter contract...");
  const saTwitter = await ethers.getContractAt("SATwitter", deployed.getSATwitterContract());
  console.log('deployed SATwitter address: ', await saTwitter.getAddress());

  // console.log("Init configuration...");

  console.log("Grant to SARegister Contract...");
  const asRegistryAddress = await saRegistry.getAddress();
  await saTwitter.grantRole(ethers.keccak256(ethers.toUtf8Bytes("ATTESTER_ROLE")), asRegistryAddress);

  // console.log("Register Twitter Attestion...");
  // const saTwitterAddress = await saTwitter.getAddress()
  // await saRegistry.registerSA(saTwitterAddress);

  // console.log("Register attester...");
  // await saRegistry.registerAttester(deployer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
