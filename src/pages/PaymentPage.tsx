import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { orderService } from '../services/orderService'
import { useToast } from '../context/ToastContext'
import GlassCard from '../components/GlassCard'
import ErrorState from '../components/ErrorState'
import { Copy, CheckCircle, Download, ArrowLeft } from 'lucide-react'

type PaymentState = 'waiting' | 'checking' | 'confirmed'

interface PaymentPageLocationState {
  amount?: string
  address?: string
  network?: string
  state?: string
  place?: string
  landSlotIds?: string[]
  quantity?: number
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const state = location.state as PaymentPageLocationState | null

  const [paymentState, setPaymentState] = useState<PaymentState>('waiting')
  const [isVerifying, setIsVerifying] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const amount = state?.amount || '0'
  const address = state?.address || ''
  const network = state?.network || 'TRC20'
  const stateName = state?.state || ''
  const place = state?.place || ''
  const quantity = state?.quantity || 1
  const landSlotIds = state?.landSlotIds || []

  const generateQRPayload = (): string => {
    return `tron:${address}?amount=${amount}`
  }

  const copyToClipboard = async (text: string, type: 'address' | 'amount') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'address') {
        setCopiedAddress(true)
        setTimeout(() => setCopiedAddress(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadQRCode = () => {
    // Create a canvas element to render QR code
    const canvas = document.createElement('canvas')
    const size = 200
    canvas.width = size
    canvas.height = size

    // For web, we'll just copy the QR data as text
    // Full implementation would require canvas rendering
    toast.info('QR code download functionality available. Right-click the QR code and save image.')
  }

  const verifyPayment = async () => {
    if (!orderId || isVerifying) return

    setIsVerifying(true)
    setPaymentState('checking')

    try {
      const result = await orderService.autoVerifyPayment(orderId)
      const status = result.status

      if (result.success && status === 'PAID') {
        setPaymentState('confirmed')
        setIsVerifying(false)

        // Auto-redirect to deed page after delay
        setTimeout(() => {
          navigate('/deeds')
        }, 3000)
      } else if (status === 'EXPIRED') {
        setPaymentState('waiting')
        setIsVerifying(false)
        toast.error('Payment window expired. Slots have been released. Please place a new order.')
        setTimeout(() => {
          navigate('/buy-land')
        }, 2000)
      } else if (status === 'LATE_PAYMENT') {
        setPaymentState('waiting')
        setIsVerifying(false)
        toast.warning('Payment received after order expiry. Please contact support for manual processing.')
      } else {
        setPaymentState('waiting')
        setIsVerifying(false)
        toast.info(result.message || 'Payment not detected yet. Please wait a few minutes and try again.')
      }
    } catch (error: any) {
      setPaymentState('waiting')
      setIsVerifying(false)
      toast.error(`Error: ${error.message || 'Unknown error'}`)
    }
  }

  if (!orderId) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message="Order ID not provided" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-4 px-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="space-y-4 px-4">
        {/* Order Info Card */}
        <GlassCard padding="p-4">
          <h3 className="text-lg font-bold text-white mb-3">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">State:</span>
              <span className="text-white">{stateName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Area:</span>
              <span className="text-white">{place}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">{quantity} tile(s)</span>
            </div>
            {quantity === 1 && landSlotIds.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Land Slot:</span>
                <span className="text-white font-mono text-xs">{landSlotIds[0]}</span>
              </div>
            )}
            {quantity > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Land Slots:</span>
                <span className="text-white">{landSlotIds.length} slots</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-mono text-xs">{orderId}</span>
            </div>
          </div>
        </GlassCard>

        {/* Payment Details Card */}
        <GlassCard padding="p-4">
          <h3 className="text-lg font-bold text-white mb-3">Payment Details</h3>
          <div className="space-y-3">
            {/* Amount */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Amount</label>
              <div className="bg-gray-800/50 rounded-lg px-3 py-2 text-white">
                {amount} USDT ({quantity} tile{quantity > 1 ? 's' : ''})
              </div>
            </div>

            {/* Network */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Network</label>
              <div className="bg-gray-800/50 rounded-lg px-3 py-2 text-white">{network}</div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">USDT Address</label>
              <div className="flex items-center gap-2">
                <div className="bg-gray-800/50 rounded-lg px-3 py-2 text-white font-mono text-xs flex-1">
                  {address}
                </div>
                <button
                  onClick={() => copyToClipboard(address, 'address')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* QR Code Card */}
        <GlassCard padding="p-4">
          <h3 className="text-lg font-bold text-white mb-3 text-center">Scan to Pay</h3>
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg mb-2">
              <QRCodeSVG value={generateQRPayload()} size={180} />
            </div>
            <p className="text-xs text-gray-400 text-center mb-1">
              Send only USDT on TRC20 network
            </p>
            <p className="text-xs text-orange-400 text-center mb-3">
              Do not use any other network
            </p>
            <button
              onClick={downloadQRCode}
              className="w-full py-2 border border-blue-500/50 text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
          </div>
        </GlassCard>

        {/* Payment Verification */}
        {paymentState !== 'confirmed' && (
          <GlassCard padding="p-4">
            <h3 className="text-lg font-bold text-white mb-2">
              {paymentState === 'waiting' ? 'Waiting for Payment' : 'Checking Payment'}
            </h3>
            {paymentState === 'waiting' ? (
              <p className="text-sm text-gray-400 mb-3">
                After completing the payment in your wallet, click the button below to verify.
              </p>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-400">Checking for payment...</span>
              </div>
            )}
            <button
              onClick={verifyPayment}
              disabled={isVerifying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
            >
              {isVerifying ? 'Checking...' : "I'VE PAID"}
            </button>
          </GlassCard>
        )}

        {/* Payment Confirmed */}
        {paymentState === 'confirmed' && (
          <GlassCard padding="p-4" backgroundColor="bg-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div className="flex-1">
                <p className="text-lg font-bold text-green-400 mb-1">Payment Confirmed</p>
                <p className="text-sm text-gray-300">
                  Your payment has been verified successfully. Redirecting...
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Land Slots List (if multiple) */}
        {quantity > 1 && landSlotIds.length > 0 && (
          <GlassCard padding="p-4">
            <h3 className="text-lg font-bold text-white mb-3">
              Land Slots ({landSlotIds.length})
            </h3>
            <div className="space-y-2">
              {landSlotIds.map((slotId, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 font-bold">{index + 1}.</span>
                  <span className="text-white font-mono text-xs">{slotId}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
