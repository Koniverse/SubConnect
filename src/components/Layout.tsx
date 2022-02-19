import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SelectWalletModal from './SelectWalletModal';
import WalletHeader from './WalletHeader';
import { WalletContext } from '../contexts';
import {Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

function Layout (): React.ReactElement<null> {
  const walletContext = useContext(WalletContext);
  const [theme, setTheme] = useState<string>(window.localStorage.getItem('sub-wallet-theme') as string);
  const navigate = useNavigate()
  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome')
    }
  }, [walletContext.wallet])

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
          className='sub-wallet-switch-theme'
          checkedChildren='Light'
          unCheckedChildren='Dark'
          onChange={_onChangeTheme}
      />
      <WalletHeader visible={!!walletContext.wallet}/>
      <Outlet/>
      <SelectWalletModal theme={theme}/>
    </div>
  </div>);
}

export default Layout