import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SelectWalletModal from './SelectWalletModal';
import WalletHeader from './WalletHeader';
import { WalletContext } from '../contexts';

function Layout (): React.ReactElement<null> {
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate()
  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome')
    }
  }, [walletContext.wallet])

  return (<div className={'main-layout '}>
    <div className={'main-content'}>
      <WalletHeader visible={!!walletContext.wallet}/>
      <Outlet/>
      <SelectWalletModal/>
    </div>
  </div>);
}

export default Layout