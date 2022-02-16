import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts';
import './AccountList.scss'

interface Props {
  className?: string;
}

function AccountList ({}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext)

  return (<div className="boxed-container">
    <div className={'account-list'}>
      <h3>Account List</h3>
      {walletContext.accounts.map((acc) => (
        <div className={'account-item'}>
          <div><b>Name</b>: {acc.name}</div>
          <div><b>Address</b>: {acc.address}</div>
        </div>
      ))}
    </div>
  </div>);
}

export default AccountList