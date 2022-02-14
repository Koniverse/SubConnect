import { BaseDotsamaWallet } from '../base-dotsama-wallet';
import logo from './SubWalletLogo.svg';

export class SubWallet extends BaseDotsamaWallet {
  extensionName = 'subwallet-js';
  title = 'SubWallet';
  installUrl = 'https://docs.subwallet.app/user-guide/how-to-install-subwallet/alpha-version';
  noExtensionMessage =
    'You can use any Polkadot compatible wallet but we recommend using Subwallet';
  logo = {
    src: logo,
    alt: 'Subwallet Logo',
  };
}
