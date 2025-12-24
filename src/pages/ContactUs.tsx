import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phoneCountry: string
  phoneNumber: string
  message: string
  agreeToPrivacy: boolean
}

export default function ContactUs() {
  const navigate = useNavigate()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      phoneCountry: 'US',
    },
  })

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement actual API call to send contact form
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      showSuccessToast('Thank you! Your message has been sent successfully.')
      reset()
    } catch (err: any) {
      showErrorToast('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 mb-2">Contact us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in touch
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out this form.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name and Last Name - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                First name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
                placeholder="First name"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Last name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
                placeholder="Last name"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <select
                {...register('phoneCountry')}
                className="px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                disabled={isSubmitting}
              >
                <option value="US">US</option>
                <option value="UK">UK</option>
                <option value="CA">CA</option>
                <option value="IN">IN</option>
                <option value="AU">AU</option>
              </select>
              <input
                type="tel"
                {...register('phoneNumber')}
                placeholder="+1 (000) 000-0000"
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters',
                },
              })}
              placeholder="Leave us a message..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors resize-none"
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register('agreeToPrivacy', {
                required: 'You must agree to the privacy policy',
              })}
              className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900/50 text-purple-600 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-0 focus:ring-offset-transparent"
              disabled={isSubmitting}
            />
            <label className="text-sm text-gray-300">
              You agree to our{' '}
              <button
                type="button"
                onClick={() => navigate('/privacy-policy')}
                className="underline hover:text-white transition-colors"
              >
                friendly privacy policy
              </button>
              . <span className="text-red-400">*</span>
            </label>
          </div>
          {errors.agreeToPrivacy && (
            <p className="text-sm text-red-400 -mt-3">
              {errors.agreeToPrivacy.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}

