# @subwallet/wallet-connect

## Overview

This library aim to connect multiple extension wallets of Dotsama ecosystem that use the `@polkadot/extension-dapp`
package with web3Enable. You can use this with any webUI to get features of extension.

We built this packages with idea and some code from [@talisman-connect/wallets](https://github.com/TalismanSociety/talisman-connect/tree/master/libs/wallets).

Here is main concept of this package:

![image](https://user-images.githubusercontent.com/11567273/170807488-fc23c8af-e6fa-4bf5-ba20-3968b9a6b23f.png)

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

You also can use object signer with [smart contract](https://polkadot.js.org/docs/api-contract/start/contract.read/) call

```typescript
const contract = await new ContractPromise(api, abi, address);
const address = '...' // Account address
const wallet = getWalletBySource('subwallet-js') as BaseDotsamaWallet;
if (wallet) {
  await wallet.enable()
  const signer = wallet.signer;
  if (signer && signer.signRaw && signer.signPayload) {
    await contract.tx
      .doSomething({ /* Smart contract method input go here */ })
      .signAndSend(
        address,
        { signer },
        async ({ status, dispatchError }) => {
          // Handle status callback here
        }
      );
    //Run something after fisish
  }
}
```
---

## Add more wallet
You can add more wallet and not required to modify this packages.
To add new wallet you should you can see and example from `packages/sub-connect/src/new-wallet-example`
  - Add svg logo should not exceed 10KB
  - Create some code like `packages/sub-connect/src/new-wallet-example/newWalletExample.ts`:
    ```typescript
    import { addWallet } from '@subwallet/wallet-connect/dotsama/wallets';

    import SubWalletLogo from './ExampleWallet.svg';
    
    export const doAddWallet = () => {
      addWallet({
        extensionName: 'example',
        title: 'New Wallet Example',
        installUrl: 'https://github.com/Koniverse/SubConnect',
        logo: {
          src: SubWalletLogo as string,
          alt: 'New Wallet Example'
        }
      });
    };
    ```
  - Call doAddWallet before any functions in `packages/wallet-connect/src/dotsama/wallets.ts` is called.
    ```typescript
    // Import codes found here
    require('./App.scss');

    // Add new example wallet
    doAddWallet();
    
    export function App () {
      const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
      const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(getWalletBySource(walletKey));
      const [isSelectWallet, setIsSelectWallet] = useState(false);
      const [accounts, setAccounts] = useState<WalletAccount[]>([]);
      
      // Another code found here
    }
    ```
    
---
## Functions
Basic functions from wallet.ts:
- `addWallet(data: WalletInfo): void`: Add your custom wallet to the wallet list. This method need to be call before other method in this file is called.
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
