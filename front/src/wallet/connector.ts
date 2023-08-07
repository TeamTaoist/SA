import { MetaMask } from "@web3-react/metamask";
import { initializeConnector } from "@web3-react/core";
import { Wallet } from "./wallet";

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

export const [injected, injectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError }),
);

export const connectors = [[injected, injectedHooks]];

export const getConnectorForWallet = (wallet: Wallet) => {
  switch (wallet) {
    case Wallet.METAMASK:
      return injected;
    default:
      return;
  }
};

export const SELECTABLE_WALLETS = [Wallet.METAMASK];

export const useConnectors = () => {
  return [[injected, injectedHooks]];
};
