import React, { useContext } from 'react';
import { Button } from 'antd';
import { OpenSelectWallet, WalletContext } from '../contexts';
import './WalletHeader.scss'

interface Props {
  visible?: boolean
}

function WalletHeader ({visible}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);
  const wallet = walletContext.wallet

  if (!visible) {
    return (<></>);
  }

  return (<header className={'wallet-header-wrapper'}>
    <div className={'boxed-container'}>
      <div className={'wallet-header-content'}>
        <div>
          <img className={'wallet-logo'} src={wallet?.logo?.src} alt={wallet?.logo?.alt}/>
        </div>
        <div className={'wallet-title'}>
          {wallet?.title}
        </div>
        <div className="spacer"/>
        <Button className={'select-wallet'} type={'primary'} onClick={selectWallet.open}>Select Wallet</Button>
      </div>
    </div>
  </header>);
}

export default WalletHeader