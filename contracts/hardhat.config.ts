import 'dotenv/config'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-abi-exporter";


const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY || "";
const MAIN_PRIVATE_KEY = process.env.MAIN_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/50676f4e9b9d4780a34fc8a503ff7f4f",
      chainId: 1,
      accounts: [`${TEST_PRIVATE_KEY}`],
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [`${TEST_PRIVATE_KEY}`],
    },
  },
  abiExporter: {
    runOnCompile: true,
    pretty: false,
    path: "./abi"
  }
};

export default config;
