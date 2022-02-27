import React, { useEffect, useState } from 'react';
import './App.scss';
import { useLocalStorage } from './hooks/useLocalStorage/useLocalStorage';
import { getWalletBySource } from './lib/wallets/wallets';
import { Wallet, WalletAccount } from './lib/wallets/types';
import Welcome from './components/Welcome';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { OpenSelectWallet, WalletContext } from './contexts';
import WalletInfo from './pages/WalletInfo';

function App () {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [currentWallet, setCurrentWallet] = useState(getWalletBySource(walletKey));
  const [isSelectWallet, setIsSelectWallet] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  let subWalletTheme = window.localStorage.getItem('sub-wallet-theme');

  if (!subWalletTheme) {
    window.localStorage.setItem('sub-wallet-theme', 'dark');
    subWalletTheme = 'dark'
  }

  document.body.style.backgroundColor = subWalletTheme === 'dark' ? '#020412' : '#FFF';

  const selectWallet = async (wallet: Wallet) => {
    setCurrentWallet(currentWallet);
    if (wallet?.installed) {
      await wallet.enable();
      setWalletKey(wallet.extensionName);

      const infos = await wallet.getAccounts();
      infos && setAccounts(infos)
    }
  }

  const walletContext = {
    wallet: getWalletBySource(walletKey),
    accounts: accounts,
    setWallet: (wallet: Wallet | undefined) => {
      wallet && selectWallet(wallet)
    }
  }

  const selectWalletContext = {
    isOpen: isSelectWallet,
    open: () => {
      setIsSelectWallet(true)
    },
    close: () => {
      setIsSelectWallet(false)
    }
  }

  useEffect(
    () => {
      const wallet = getWalletBySource(walletKey);
      if (wallet) {
        const fetchInfo = async () => {
          const infos = await wallet.getAccounts();
          infos && setAccounts(infos)
        }

        setTimeout(fetchInfo, 150);
      }
    },
    [walletKey],
  );

  return (
    <WalletContext.Provider value={walletContext}>
      <OpenSelectWallet.Provider value={selectWalletContext}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Welcome/>}/>
              <Route path="/welcome" element={<Welcome/>}/>
              <Route path="/wallet-info" element={<WalletInfo/>}/>
            </Route>
          </Routes>
        </HashRouter>
      </OpenSelectWallet.Provider>
    </WalletContext.Provider>
  );
}

export default App;
