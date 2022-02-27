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