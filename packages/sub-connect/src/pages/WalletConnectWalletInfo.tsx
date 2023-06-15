import { Button, Input, message, Select } from 'antd';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import Web3 from 'web3';

import { WalletContext } from '../contexts';

import './WalletConnectWalletInfo.scss';



const WalletConnectWalletInfo = () => {
  const [modal, setModal] = useState("");

  const closeModal = useCallback(() => setModal(""), []);
  const openPairingModal = useCallback(() => setModal("pairing"), []);
  const openPingModal = useCallback(() => setModal("ping"), []);
  const openRequestModal = useCallback(() => setModal("request"), []);


  return (
    <div>

    </div>
  )
}

export default WalletConnectWalletInfo;
