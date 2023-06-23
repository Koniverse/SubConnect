import { WalletConnectChainContext } from "@subwallet/sub-connect/providers/WalletConnectChainProvider";
import { ChainData } from "@subwallet/wallet-connect/wallet-connect/types";
import CN from 'classnames';
import React, { useCallback, useContext } from "react";

require('./ChainConnect.scss');

interface Props {
  data: ChainData;
  onSelect: (data: string) => void;
  active: boolean;
}

const ChainConnect = (props: Props) => {
  const { onSelect, data, active } = props;
  const { chainMetaMap } = useContext(WalletConnectChainContext);

  const chainMeta = chainMetaMap[data.id];

  const onClick = useCallback(() => {
    onSelect(data.id)
  }, [onSelect, data.id]);

  return (
    <div className={CN('chain-connect-container', { active })} onClick={onClick}>
      <img
        alt={chainMeta.name}
        className='chain-logo'
        src={chainMeta.logo}
      />
      <div>{data.name}</div>
    </div>
  )
}

export default ChainConnect;
