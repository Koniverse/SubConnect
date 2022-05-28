// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Switch } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { WalletContext } from '../contexts';
import SelectWalletModal from './SelectWalletModal';
import WalletHeader from './WalletHeader';

require('./Layout.scss');

function Layout (): React.ReactElement<null> {
  const walletContext = useContext(WalletContext);
  const [theme, setTheme] = useState<string>(window.localStorage.getItem('sub-wallet-theme') as string);
  const navigate = useNavigate();

  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome');
    }
  }, [navigate, walletContext.wallet]);

  const _onChangeTheme = useCallback(() => {
    if (theme === 'dark') {
      setTheme('light');
      window.localStorage.setItem('sub-wallet-theme', 'light');
    } else if (theme === 'light') {
      setTheme('dark');
      window.localStorage.setItem('sub-wallet-theme', 'dark');
    }
  }, [theme]);

  return (<div className={'main-layout '}>
    <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
      <Switch
        checkedChildren='Light'
        className='sub-wallet-switch-theme'
        defaultChecked={theme === 'light'}
        onChange={_onChangeTheme}
        unCheckedChildren='Dark'
      />
      <WalletHeader visible={!!walletContext.wallet} />
      <Outlet />
      <SelectWalletModal theme={theme} />
    </div>
  </div>);
}

export default Layout;
