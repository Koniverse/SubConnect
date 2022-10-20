import React from 'react';
interface Props {
    onSelectWallet: (walletKey: string, walletType?: 'substrate' | 'evm') => void;
}
declare function SelectWallet({ onSelectWallet }: Props): React.ReactElement<Props>;
export default SelectWallet;
