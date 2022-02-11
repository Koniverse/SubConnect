import React, { useState } from 'react';
import './App.scss';
import { Dropdown, Menu } from 'antd';
import { useLocalStorage } from './hooks/useLocalStorage/useLocalStorage';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getWalletBySource } from './lib/wallets';
import { WalletAccount } from './lib/types';
import { Unsubcall } from '@polkadot/extension-inject/types';

const WALLETS: Record<string, string> = {
  'polkadot-js': 'Polkadot Wallet',
  'subwallet-js': 'Subwallet'
}

function App () {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);

  const selectWallet = (info: MenuInfo, ignoreNotFound = false) => {
    const extensionKey = info.key
    const wallet = getWalletBySource(extensionKey);
    if (wallet?.installed) {
      wallet?.enable();
      setWalletKey(extensionKey);

      wallet.subscribeAccounts((infos) => {
          infos && setAccounts(infos)
      }).then((unsub) => {
        console.log(unsub);
        unsub && unsub();
      }).catch(console.error)

    } else if (!ignoreNotFound) {
      alert(`Extension ${WALLETS[extensionKey]} is not installed`)
    }
  }

  const menu = (
    <Menu onClick={selectWallet}>
      {Object.entries(WALLETS).map(([key, name]) => {
        return (<Menu.Item key={key}>{name}</Menu.Item>)
      })}
    </Menu>
  );

  return (
    <div className="App">
      <div className="app-container">
        <h3>Subwallet DAPP example</h3>
        <h4>Current React App</h4>
        <Dropdown.Button overlay={menu}>{WALLETS[walletKey] || 'Select Wallet'}</Dropdown.Button>
        {accounts.map((acc) => (
          <ul>
            <li>Account: {acc.name}</li>
            <li>Address: {acc.address}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default App;
