## Overview

This library aim to connect multiple extension wallets of Dotsama ecosystem that use the `@polkadot/extension-dapp`
package with web3Enable. You can use this with any webUI to get features of extension.

We built this base
on [@talisman-connect/wallets](https://github.com/TalismanSociety/talisman-connect/tree/master/libs/wallets) with some
modifications.

---

## Getting start

`wallet.ts` public some useful method will help to start connect with wallets.

You can enable all supported wallets that activated on your browser with this code. Authentication popup of support and
activated extension will be showed after this code first time.

```typescript
// examples/example1.ts
import { getWallets } from '../wallets';
import { Wallet } from '../types';

// Get all supported wallets
const supportedWallets: Wallet[] = getWallets();

// Enable each supported wallet.
supportedWallets.forEach((wallet) => {
  if (wallet.installed) {
    wallet.enable();
  }
});
```

You can use wallet methods after enable extension. Example get account list:

```typescript
// examples/example2.ts
import { getWalletBySource } from '../wallets';
import { BaseDotsamaWallet } from '../base-dotsama-wallet';

const wallet = getWalletBySource('subwallet-js') as BaseDotsamaWallet;
if (wallet) {
  wallet.enable()
    .then(() => {
      wallet.getAccounts()
        .then((accounts) => {
          accounts && accounts.forEach((account) => {
            console.log(account.name, account.address)
          })
        }).catch(console.error)
    }).catch(console.error);
}
```

---

## Add more wallet to this library
You need to define new wallet in this package before use.
To add new wallet you should you create a folder like `polkadotjs-wallet`
  - Add svg logo should not exceed 10KB
  - Add index.ts with content:
    ```typescript
    import { BaseDotsamaWallet } from '../base-dotsama-wallet';
    import logo from './WalletLogo.svg'; // Link to svg logo
    
    export class NewWallet extends BaseDotsamaWallet {
      extensionName = 'new-wallet'; // Same with propperty that extension public in object `window.injectedWeb3`
      title = 'NewWallet';
      noExtensionMessage = '';
      installUrl = 'https://chrome.google.com/webstore/detail/.....'; // link to install extension
      logo = {
        src: logo,
        alt: 'NewWallet Logo',
      };
    }

    ```
  - Define in wallets.ts
    ```typescript
    export const WALLETS: Record<string, string> = {
      'polkadot-js': 'Polkadot{.js}',
      'subwallet-js': 'SubWallet',
      'talisman': 'Talisman',
      'new-wallet': 'NewWallet' // new wallet here
    }
    
    const supportedWallets = [new PolkadotjsWallet(), new SubWallet(), new TalismanWallet(), new NewWallet()]; // new wallet here
    ```
    
---
## Functions
Basic functions from wallet.ts:
- `getWallets(): Wallet[]`: Get all supported wallets
- `getWalletBySource( source: string | unknown )`: Get wallet by extensionName
- `isWalletInstalled(source: string | unknown)` Check installation, activation of a wallet.

Basic functions of wallets (BaseDotsamaWallet):
- `wallet.intalled`: Check extension is installed and activated or not by checking object `window.injectedWeb3`
- `wallet.enable(): Promise<void>`: Enable wallet with your url by authentication popup in the first time and any time before use another wallet functions.
- `wallet.getAccounts(): WalletAccount[]`: Get all account of the wallet.
- `wallet.subscribeAccounts(callback): UnsubscribeFn`: Get and subscribe account changes. This will return self unsubscribe function.
- `wallet.extention`: Return `InjectExtension` object that is provided wallet extension. You can found all extension interface in package `@polkadot/extension-inject`. We also make quick access of extension with these props:
  - `wallet.signer`: Quick access of `wallet.extension.signer`
  - `wallet.metadata`: Quick access of `wallet.extension.metadata`
  - `wallet.provider`: Quick access of `wallet.extension.provider`
