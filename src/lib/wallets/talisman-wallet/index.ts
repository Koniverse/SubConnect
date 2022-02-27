import { BaseDotsamaWallet } from '../base-dotsama-wallet';
import logo from './TalismanLogo.svg';

export class TalismanWallet extends BaseDotsamaWallet {
  extensionName = 'talisman';
  title = 'Talisman';
  installUrl = 'https://app.talisman.xyz/spiritkeys';
  noExtensionMessage =
    'You can use any Polkadot compatible wallet but we recommend using SubWallet';
  logo = {
    src: logo,
    alt: 'Talisman Logo',
  };
}
