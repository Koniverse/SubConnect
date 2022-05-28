// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getWallets } from '@subwallet/wallet-connect/dotsama/wallets';
import { Wallet } from '@subwallet/wallet-connect/types';
import React, { useCallback } from 'react';

require('./SelectWallet.scss');

interface Props {
  onSelectWallet: (walletKey: string) => void
}

function SelectWallet ({ onSelectWallet }: Props): React.ReactElement<Props> {
  const wallets = getWallets();
  const onClickWallet = useCallback(
    (wallet: Wallet) => {
      return () => {
        if (wallet.installed) {
          onSelectWallet(wallet.extensionName);
        }
      };
    },
    [onSelectWallet]
  );

  return <div className={'select-wallet-wrapper'}>
    <div className={'select-wallet-content'}>
      {wallets.map((wallet) =>
        <div
          className={'wallet-item'}
          key={wallet.extensionName}
          onClick={onClickWallet(wallet)}
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
      )}
    </div>
  </div>;
}

export default SelectWallet;
