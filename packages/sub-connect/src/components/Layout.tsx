// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocalStorage } from '@subwallet/sub-connect/hooks/useLocalStorage/useLocalStorage';
import { Switch } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { WalletContext } from '../contexts';
import SelectWalletModal from './SelectWalletModal';
import WalletHeader from './WalletHeader';

require('./Layout.scss');

function Layout (): React.ReactElement<null> {
  const walletContext = useContext(WalletContext);
  const [theme, setTheme] = useLocalStorage('sub-wallet-theme', 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome');
    }
  }, [navigate, walletContext.wallet]);

  const _onChangeTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

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
