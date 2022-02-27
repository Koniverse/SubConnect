import { BaseDotsamaWallet } from '../base-dotsama-wallet';
import logo from './SubWalletLogo.svg';

export class SubWallet extends BaseDotsamaWallet {
  extensionName = 'subwallet-js';
  title = 'SubWallet';
  installUrl = 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn?hl=en&authuser=0';
  noExtensionMessage =
    'You can use any Polkadot compatible wallet but we recommend using Subwallet';
  logo = {
    src: logo,
    alt: 'Subwallet Logo',
  };
}
