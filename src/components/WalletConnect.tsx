import { ConnectButton } from 'thirdweb/react';
import { thirdwebClient, supportedWallets } from '../lib/thirdweb';

export default function WalletConnect() {
	return (
		<div className="flex justify-center">
			<ConnectButton client={thirdwebClient} connectModal={{ size: 'compact' }} wallets={supportedWallets} />
		</div>
	);
}


