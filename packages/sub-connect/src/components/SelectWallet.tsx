// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getWallets } from '@subwallet/wallet-connect/dotsama/wallets';
import { getEvmWallets } from '@subwallet/wallet-connect/evm/evmWallets';
import { EvmWallet, Wallet } from '@subwallet/wallet-connect/types';
import React, { useCallback } from 'react';
import {useMobileDetect} from "@subwallet/sub-connect/hooks/useMobileDetect";

require('./SelectWallet.scss');

interface Props {
  onSelectWallet: (walletKey: string, walletType?: 'substrate' | 'evm') => void
}

function SelectWallet ({ onSelectWallet }: Props): React.ReactElement<Props> {
  const dotsamaWallets = getWallets();
  const evmWallets = getEvmWallets();
  const isMobile = useMobileDetect()

  const onClickDotsamaWallet = useCallback(
    (wallet: Wallet | EvmWallet) => {
      return () => {
        if (wallet.installed) {
          onSelectWallet(wallet.extensionName);
        }
      };
    },
    [onSelectWallet]
  );

  const onClickEvmWallet = useCallback(
    (wallet: Wallet | EvmWallet) => {
      return () => {
        if (wallet.installed) {
          onSelectWallet(wallet.extensionName, 'evm');
        }
      };
    },
    [onSelectWallet]
  );

  const walletItem: (wallet: Wallet|EvmWallet, onSelect: (wallet: Wallet|EvmWallet) => () => void) => React.ReactElement = (wallet, onSelect) => (
    <div
      className={'wallet-item'}
      key={wallet.extensionName}
      onClick={onSelect(wallet)}
    >
      <div>
        <img
          alt={wallet.logo?.alt}
          className={'wallet-logo'}
          src={wallet.logo?.src}
        />
      </div>
      <div className={'wallet-title'}>
        {wallet.title}
      </div>
      <div className={'wallet-install'}>
        {wallet.installed
          ? ''
          : (<a
            href={wallet.installUrl}
            rel='noreferrer'
            target='_blank'
          >
            Install
          </a>)}
      </div>
    </div>
  );

  return <div className={'select-wallet-wrapper'}>
    <div className={'select-wallet-content'}>
      {!isMobile && <div className='dotsama-wallet-list'>
        <div className='wallet-cat-title'>
          Dotsama Wallets
        </div>
        {dotsamaWallets.map((wallet) => (walletItem(wallet, onClickDotsamaWallet)))}
      </div>}
      {!isMobile && <div className='evm-wallet-list'>
        <div className='wallet-cat-title'>
          EVM Wallets
        </div>
        {evmWallets.map((wallet) => (walletItem(wallet, onClickEvmWallet)))}
      </div>}
      {isMobile && <div className='evm-wallet-list'>
        <div className='wallet-cat-title'>
          Mobile Wallets
        </div>
        <div>
          MetaMask
        </div>
        <div>
          SubWallet
        </div>
      </div>}
    </div>
  </div>;
}

export default SelectWallet;
