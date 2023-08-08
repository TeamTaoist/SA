import hre from "hardhat";
import fs from "fs";
import path from "path";

// read json file
function readSync() {
  try {
    const content = fs.readFileSync(manifest, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
  }
}

// write json file
function saveSync() {
  const content = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(manifest, content);
  } catch (err) {
    console.error(err);
  }
}

const network = hre.network.name;
console.log('current network: ', network);

const manifest = path.join(__dirname, network, "contracts.json");
const data = readSync();

const deployd = {
  contracts: data,
  setSARegistryContract: function (addr: string) {
    this.contracts["saRegistry"] = addr;
    saveSync();
  },
  getSARegistryContract: function (): string {
    return this.contracts["saRegistry"];
  },
  setSATwitterContract: function (addr: string) {
    this.contracts["saTwitter"] = addr;
    saveSync();
  },
  getSATwitterContract: function (): string {
    return this.contracts["saTwitter"];
  },
};

console.log('deployed contracts: ', deployd.contracts);
export default deployd;