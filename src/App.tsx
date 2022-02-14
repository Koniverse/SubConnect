import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { Dropdown, Menu } from 'antd';
import { useLocalStorage } from './hooks/useLocalStorage/useLocalStorage';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getWalletBySource } from './lib/wallets';
import { WalletAccount } from './lib/types';
import { Injected, Unsubcall } from '@polkadot/extension-inject/types';

const WALLETS: Record<string, string> = {
  'polkadot-js': 'Polkadot Wallet',
  'subwallet-js': 'Subwallet'
}

function App () {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);

  const selectWallet = async (extensionKey: string, ignoreNotFound = false) => {
    const wallet = getWalletBySource(extensionKey);
    if (wallet?.installed) {
      await wallet.enable();
      setWalletKey(extensionKey);

      wallet.subscribeAccounts((infos) => {
        infos && setAccounts(infos)
      }).then((unsub) => {
        unsub && unsub();
      }).catch(console.error)

    } else if (!ignoreNotFound) {
      const install = window.confirm(`Extension ${WALLETS[extensionKey]} is not installed. Do you want install now?`)
      if (install && wallet?.installUrl) {
        window.open(wallet.installUrl);
      }
    }
  }

  useEffect(
    () => {
      const wallet = getWalletBySource(walletKey);
      if (wallet) {
        const fetchInfo = async () => {
          await wallet.enable();

          wallet.subscribeAccounts((infos) => {
            infos && setAccounts(infos)
          }).then((unsub) => {
            unsub && unsub();
          }).catch(console.error)
        }

        setTimeout(fetchInfo, 100);
      }
    },
    [walletKey],
  );

  const menu = (
    <Menu onClick={(info: MenuInfo) => {
      selectWallet(info.key)
    }}>
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
