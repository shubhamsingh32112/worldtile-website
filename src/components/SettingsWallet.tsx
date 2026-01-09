import { useRef } from 'react'
import { ConnectButton } from 'thirdweb/react'
import { thirdwebClient, supportedWallets } from '../lib/thirdweb'
import { appChains } from "../lib/chains"
import GlassCard from './GlassCard'
import { Wallet } from 'lucide-react'

export default function SettingsWallet() {
  const buttonContainerRef = useRef<HTMLDivElement>(null)

  const handleCardClick = () => {
    // Find and click the ConnectButton inside the hidden container
    if (buttonContainerRef.current) {
      const button = buttonContainerRef.current.querySelector('button')
      if (button) {
        button.click()
      }
    }
  }

  return (
    <GlassCard padding="p-4" onClick={handleCardClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Wallet</h3>
          </div>
        </div>
      </div>
      {/* Hidden ConnectButton */}
      <div ref={buttonContainerRef} className="hidden">
        <ConnectButton
          client={thirdwebClient}
          wallets={supportedWallets}
          chains={appChains}
          connectModal={{ size: 'wide' }}
        />
      </div>
    </GlassCard>
  )
}

