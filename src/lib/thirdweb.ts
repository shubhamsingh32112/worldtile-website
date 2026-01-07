import { createThirdwebClient } from 'thirdweb';
import { inAppWallet, createWallet } from 'thirdweb/wallets';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID as string | undefined;

export const thirdwebClient = createThirdwebClient({
	clientId: clientId || 'YOUR_THIRDWEB_CLIENT_ID',
});

export const supportedWallets = [
	inAppWallet({
		auth: {
			options: ['google', 'email', 'x', 'apple'],
		},
	}),
	createWallet('io.metamask'),
	createWallet('com.coinbase.wallet'),
	createWallet('me.rainbow'),
	createWallet('io.rabby'),
	createWallet('io.zerion.wallet'),
];


