import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { deedService, type Deed } from '../services/deedService'
import GlassCard from '../components/GlassCard'
import ErrorState from '../components/ErrorState'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowLeft } from 'lucide-react'

export default function DeedDetailPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const [deed, setDeed] = useState<Deed | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sealImageError, setSealImageError] = useState(false)

  useEffect(() => {
    if (propertyId) {
      fetchDeed()
    }
  }, [propertyId])

  const fetchDeed = async () => {
    if (!propertyId) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await deedService.getDeedByPropertyId(propertyId)
      if (result.success && result.deed) {
        setDeed(result.deed)
      } else {
        setErrorMessage(result.message || 'Failed to load deed')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error loading deed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  const truncateAddress = (address: string): string => {
    if (address.length <= 12) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
  }

  if (isLoading) {
    return (
      <div className="py-8 px-4 md:px-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (errorMessage || !deed) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message={errorMessage || 'Deed not found'} onRetry={fetchDeed} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6 px-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="space-y-8 px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">WORLD TILE</h1>
          <p className="text-sm text-gray-400 tracking-widest">
            Digital Land Registry • Blockchain Secured
          </p>
        </div>

        {/* Deed Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            DIGITAL LAND OWNERSHIP DEED
          </h2>
        </div>

        {/* Owner Statement */}
        <div className="text-center space-y-2">
          <p className="text-gray-300">This deed certifies that</p>
          <p className="text-2xl font-semibold text-white">{deed.ownerName}</p>
          <p className="text-gray-300">
            is the verified digital owner of the following WorldTile land parcel,
            <br />
            permanently recorded on the blockchain.
          </p>
        </div>

        {/* Details Table */}
        <GlassCard padding="p-6" backgroundColor="bg-white/10">
          <div className="space-y-4">
            {/* Owner Name */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Owner Name</span>
              <span className="text-white font-medium">{deed.ownerName}</span>
            </div>

            {/* Plot ID */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Plot ID</span>
              <span className="text-white font-medium">{deed.plotId}</span>
            </div>

            {/* City / Region */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">City / Region</span>
              <span className="text-white font-medium">{deed.city}</span>
            </div>

            {/* NFT Token ID */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">NFT Token ID</span>
              <span className="text-white font-medium">{deed.nft.tokenId}</span>
            </div>

            {/* NFT Contract */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">NFT Contract</span>
              <span className="text-white font-medium font-mono text-xs">
                {truncateAddress(deed.nft.contractAddress)}
              </span>
            </div>

            {/* Blockchain */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Blockchain</span>
              <span className="text-white font-medium">{deed.nft.blockchain}</span>
            </div>

            {/* Latitude */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Latitude</span>
              <span className="text-white font-medium">{deed.latitude.toFixed(6)}</span>
            </div>

            {/* Longitude */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Longitude</span>
              <span className="text-white font-medium">{deed.longitude.toFixed(6)}</span>
            </div>

            {/* Payment Transaction ID */}
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-gray-400 text-sm">Payment Transaction ID</span>
              <span className="text-white font-medium font-mono text-xs">
                {truncateAddress(deed.payment.transactionId)}
              </span>
            </div>

            {/* Payment Receiver */}
            <div className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Payment Receiver</span>
              <span className="text-white font-medium font-mono text-xs">
                {truncateAddress(deed.payment.receiver)}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Issued Info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">Issued: {formatDate(deed.issuedAt)}</p>
          <p className="text-xs text-gray-500">Issued by<br />WorldTile Registry</p>
          <p className="text-xs text-gray-500">
            Digitally Generated • No Physical Signature Required
          </p>
        </div>

        {/* Verified Seal */}
        <div className="flex justify-center py-8">
          <div
            className="relative w-[220px] h-[220px]"
            style={{
              transform: 'rotate(-3deg)',
              filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))',
            }}
          >
            {!sealImageError ? (
              <img
                src="/images/seal.jpeg"
                alt="Verified Seal"
                className="w-full h-full rounded-full object-cover"
                onError={() => setSealImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center p-5">
                <p className="text-xs font-bold text-white tracking-wider mb-1">WORLD TILE</p>
                <p className="text-xs font-semibold text-blue-400 mb-1">VERIFIED</p>
                <p className="text-[10px] text-gray-400 text-center px-4 mb-2">
                  DIGITAL LAND REGISTRY
                </p>
                <div className="w-full h-px bg-white/20 my-2" />
                <p className="text-[10px] text-gray-500 mb-1">SEAL NO</p>
                <p className="text-xs font-bold text-white">{deed.sealNo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

