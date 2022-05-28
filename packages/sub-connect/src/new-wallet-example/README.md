# Add more wallet
You can add more wallet and not required to modify this `wallet-connect` package.

You can add new wallet like folder code by follow these step: 
  - Add svg logo should not exceed 10KB
  - Create some code like `newWalletExample.ts`:
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