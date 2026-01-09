import { ConnectButton } from 'thirdweb/react';
import { thirdwebClient, supportedWallets } from '../lib/thirdweb';
import { appChains } from "../lib/chains";
  
export default function WalletConnect() {
	return (
		<div className="flex justify-center">
			<ConnectButton
  client={thirdwebClient}
  wallets={supportedWallets}
  chains={appChains}
  connectModal={{ size: "wide" }}
/>

		</div>
	);
}


