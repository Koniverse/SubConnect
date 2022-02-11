import { BaseDotsamaWallet } from '../base-dotsama-wallet';
import logo from './PolkadotjsLogo.svg';

export class PolkadotjsWallet extends BaseDotsamaWallet {
  extensionName = 'polkadot-js';
  title = 'Polkadot.js';
  noExtensionMessage =
    'You can use any Polkadot compatible wallet but we recommend using Talisman';
  installUrl =
    'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related';
  logo = {
    src: logo,
    alt: 'Polkadotjs Logo',
  };
}
