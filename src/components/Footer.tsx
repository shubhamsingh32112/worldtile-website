import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { subscriptionService } from '../services/subscriptionService'
import { useToast } from '../context/ToastContext'

interface SubscriptionFormData {
  email: string
}

export default function Footer() {
  const navigate = useNavigate()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriptionFormData>()

  const footerLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms and Condition', path: '/terms-and-condition' },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'Become an Agent', path: '/become-an-agent' },
    { label: 'Support', path: '/support' },
    { label: 'Contact Us', path: '/contact-us' },
  ]

  const handleLinkClick = (path: string) => {
    // Scroll to top before navigating
    const scrollContainer = document.getElementById('app-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Navigate to the link path
    navigate(path)
  }

  const onSubmitSubscription = async (data: SubscriptionFormData) => {
    setIsSubmitting(true)
    try {
      const result = await subscriptionService.subscribe({ email: data.email })
      if (result.success) {
        showSuccessToast(result.message || 'Successfully subscribed to our newsletter!')
        reset()
      } else {
        showErrorToast(result.message || 'Failed to subscribe. Please try again.')
      }
    } catch (err: any) {
      showErrorToast('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="relative w-full bg-black border-t border-gray-800/30 mt-auto mt-[20px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo Section - Centered */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            {/* Logo Icon - Rounded square with purple blur effect */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 rounded-xl bg-purple-500/40 blur-2xl opacity-60"></div>
              <div className="relative text-purple-300 font-bold text-xl tracking-tight">W</div>
            </div>
            <span className="text-2xl font-semibold text-white tracking-tight">WorldTile</span>
          </div>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
          {footerLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-700/40 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left - Email Subscription Form */}
          <div className="flex-1 w-full sm:w-auto">
            <form onSubmit={handleSubmit(onSubmitSubscription)} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors text-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Right - Copyright */}
          <div className="text-sm text-gray-400 font-normal whitespace-nowrap">
            © 2025 WorldTile. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

