import WalletConnectAccountAction from "@subwallet/sub-connect/components/WalletConnectAccountAction";
import { Button, Input, message, Select } from 'antd';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { WalletContext } from '../contexts';
import ChainConnect from "../components/ChainConnect";
import { WalletConnectChainContext, } from "../providers/WalletConnectChainProvider";

require('./WalletConnectWalletInfo.scss');

const WalletConnectWalletInfo = () => {
  const [modal, setModal] = useState("");
  const { walletConnectWallet } = useContext(WalletContext);

  const { chains } = useContext(WalletConnectChainContext);
  const [selectedChains, setSelectedChains] = useState<string[]>([])

  const [isInitializing, setIsInitializing] = useState(true)
  const [, setUpdate] = useState({})

  const isConnected = !!walletConnectWallet?.isConnected;
  const wallet = walletConnectWallet!;

  const closeModal = useCallback(() => setModal(""), []);
  const openPairingModal = useCallback(() => setModal("pairing"), []);
  const openPingModal = useCallback(() => setModal("ping"), []);
  const openRequestModal = useCallback(() => setModal("request"), []);

  const onSelectChain = useCallback((chain: string) => {
    setSelectedChains((chains) => {
      if (chains.includes(chain)) {
        return chains.filter((value) => value !== chain);
      } else {
        return [...chains, chain];
      }
    })
  }, [])

  const onConnect = useCallback(() => {
    wallet.setChains(selectedChains);
    wallet.connect().finally(() => {
      setUpdate({});
    });
  }, [wallet, selectedChains]);

  const onDisconnect = useCallback(() => {
    wallet.disconnect().finally(() => {
      setUpdate({});
    });
  }, [wallet]);

  const onPing = useCallback(() => {
    wallet.ping().finally(() => {
      setUpdate({});
    });
  }, [wallet]);

  useEffect(() => {
    walletConnectWallet?.enable().finally(() => {
      setIsInitializing(false);
    });
  }, [walletConnectWallet])

  return (
    <div className='boxed-container'>
      <div className='header-title'>Wallet Connect</div>
      {
        !isInitializing
          ? (
            <>
              {
                !isConnected &&
                (
                  <div className="chains-container">
                    {
                      chains.map((data) => {
                        return (
                          <ChainConnect key={data.id} data={data} active={selectedChains.includes(data.id)}
                                        onSelect={onSelectChain}/>
                        )
                      })
                    }
                    <Button type='primary' disabled={!selectedChains.length} onClick={onConnect}>Connect</Button>
                  </div>
                )
              }
              {
                isConnected && (
                  <div>
                    <div>
                      <Button type='primary' onClick={onDisconnect}>Disconnect</Button>
                      <Button type='primary' onClick={onPing}>Ping</Button>
                    </div>
                    <div className="accounts-container">
                      {wallet.accounts.map((account) => <WalletConnectAccountAction key={account} account={account}/>)}
                    </div>
                  </div>
                )
              }
            </>
          )
          : (
            <div>
              Loading
            </div>
          )
      }
    </div>
  )
}

export default WalletConnectWalletInfo;
