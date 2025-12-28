import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supportService } from '../services/supportService'
import { useToast } from '../context/ToastContext'
import GlassCard from '../components/GlassCard'
import { ArrowLeft, HelpCircle, MessageCircle } from 'lucide-react'

export default function SettingsSupportPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [supportMessage, setSupportMessage] = useState('')

  const supportMutation = useMutation({
    mutationFn: async (message: string) => {
      return await supportService.submitUserQuery({
        message,
      })
    },
    onSuccess: () => {
      toast.success('📝 Support request sent to admin')
      setShowSupportModal(false)
      setSupportMessage('')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit support request')
    },
  })

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supportMessage.trim()) {
      toast.error('Please describe your issue')
      return
    }

    supportMutation.mutate(supportMessage)
  }

  const openWhatsAppSupport = () => {
    const phoneNumber = '+918296945508'
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6 py-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6 px-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="px-4">
        <GlassCard padding="p-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Support</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Need help? Contact our support team. You can submit a support request or chat with us on WhatsApp.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </button>
            
            <button
              onClick={openWhatsAppSupport}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Contact Support</h3>
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Describe your issue *
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Please describe your issue in detail..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* WhatsApp Option */}
              <div className="flex items-center gap-2 pt-2 pb-2">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="text-sm text-white/50">or</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>
              
              <button
                type="button"
                onClick={openWhatsAppSupport}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </button>
              
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={supportMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {supportMutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSupportModal(false)
                    setSupportMessage('')
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

