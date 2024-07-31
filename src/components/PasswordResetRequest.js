'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset email sent! Please check your email.')
    }
    setLoading(false)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <button
          type="submit"
          className={`px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-green-500'} text-white rounded hover:bg-green-600`}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Password Reset Email'}
        </button>
      </form>
    </div>
  )
}
