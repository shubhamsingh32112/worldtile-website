import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { thirdwebClient } from "@/lib/thirdwebClient";

/**
 * WalletConnectButton with support for:
 * - Google / In-App Wallet (Flow A) - explicitly configured
 * - MetaMask (Flow B - EOA) - auto-injected by ConnectButton in v5
 * - WalletConnect (Flow B - EOA) - auto-injected by ConnectButton in v5
 * 
 * In thirdweb v5, MetaMask and WalletConnect are automatically available
 * via ConnectButton - no need to import them.
 */
export default function WalletConnectButton() {
  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={[
        // ONLY add what is NOT default (In-App Wallet with Google)
        inAppWallet({
          auth: {
            options: ["google"], // Google login + in-app wallet
          },
        }),
        // MetaMask and WalletConnect are auto-injected by ConnectButton in v5
      ]}
      theme="dark"
      connectModal={{
        size: "compact",
        title: "Sign in to WorldTile",
      }}
    />
  );
}

