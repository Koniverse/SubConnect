import React from 'react';
import './SelectWallet.scss'
import { getWallets } from '../lib/wallets';

interface Props {
  onSelectWallet: (walletKey: string) => void
}

function SelectWallet ({onSelectWallet}: Props): React.ReactElement<Props> {
  const wallets = getWallets();

  return <div className={'select-wallet-wrapper'}>
    <div className={'select-wallet-content'}>
      {wallets.map((wallet) =>
        <div className={'wallet-item'}
             key={wallet.extensionName}
             onClick={event => {if(wallet.installed) {onSelectWallet(wallet.extensionName)}}}>
          <div>
            <img className={'wallet-logo'} src={wallet.logo?.src} alt={wallet.logo?.alt}/>
          </div>
          <div className={'wallet-title'}>
            {wallet.title}
          </div>
          <div className={'wallet-install'}>
            {wallet.installed? '': (<a href={wallet.installUrl} target="_blank">Install</a>)}
          </div>
        </div>
      )}
    </div>
  </div>;
}

export default SelectWallet