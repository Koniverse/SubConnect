import { WalletContext } from "@subwallet/sub-connect/contexts";
import { WalletConnectChainContext } from "@subwallet/sub-connect/providers/WalletConnectChainProvider";
import { toShort } from "@subwallet/sub-connect/utils/address";
import { DEFAULT_EIP155_METHODS, DEFAULT_POLKADOT_METHODS } from "@subwallet/wallet-connect/wallet-connect/constants";
import * as encoding from "@walletconnect/encoding";
import { Button } from "antd";
import CN from 'classnames';
import React, { useContext, useMemo } from "react";

require('./WalletConnectAccountAction.scss');

interface Props {
  account: string;
}

interface AccountAction {
  method: string;
  callback: (chainId: string, address: string) => Promise<unknown>;
}

const WalletConnectAccountAction = (props: Props) => {
  const { account } = props;
  const [namespace, chainId , address] = account.split(':');
  const { chainMetaMap } = useContext(WalletConnectChainContext);
  const wallet = useContext(WalletContext).walletConnectWallet!;

  const chainKey = [namespace, chainId].join(':');
  const chainMeta = chainMetaMap[chainKey];

  const actions = useMemo((): AccountAction[] => {
    switch (namespace) {
      case 'eip155':
        return [
          {
            method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
            callback: wallet.createRequestHandler<string>(async (chain, address)  => {
              const message = `My email is john@doe.com - ${Date.now()}`;
              const hexMsg = encoding.utf8ToHex(message, true);
              const params = [hexMsg, address];

              return await wallet.sendRequest<string>({
                chainId: chain,
                request: {
                  method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
                  params,
                },
              });
            })
          }
        ]
      case 'polkadot':
        return [
          {
            method: DEFAULT_POLKADOT_METHODS.POLKADOT_SIGN_MESSAGE,
            callback: wallet.createRequestHandler<{ signature: string }>(async (chain, address)  => {
              const message = `This is an example message to be signed - ${Date.now()}`;

              return await wallet.sendRequest<{ signature: string }>({
                chainId: chain,
                request: {
                  method: DEFAULT_POLKADOT_METHODS.POLKADOT_SIGN_MESSAGE,
                  params: {
                    address,
                    message
                  },
                },
              });
            })
          }
        ]

      default:
        return []
    }
  }, [chainKey, wallet, namespace])

  return (
    <div className={CN('account-action-container')}>
      <div className={CN('chain-info')} >
        <img
          alt={chainMeta.name}
          className='chain-logo'
          src={chainMeta.logo}
        />
        <div className='chain-name'>{chainMeta.name}</div>
      </div>
      <div className='account-address'>{toShort(address)}</div>
      {actions.map((action) => {
        return (
          <Button key={action.method} onClick={() => action.callback(chainKey, address).then(console.log)}>{action.method}</Button>
        )
      })}
    </div>
  )
}

export default WalletConnectAccountAction;
