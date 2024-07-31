'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage('')


    try {
      // Get the current user
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
  
      if (getUserError) {
        throw getUserError
      }
  
      if (!user) {
        throw new Error('No user is currently signed in')
      }
  
            // Re-authenticate the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        throw signInError
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        throw updateError
      }
  
      setMessage('Password changed successfully!')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
