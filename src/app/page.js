'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUser } from '../lib/auth'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const user = await getUser()
  //     setUser(user)
  //     setLoading(false)
  //   }

  //   checkUser()
  // }, []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {user ? (
            <Link href="/users" className="text-blue-500 hover:underline">
              View Users
            </Link>
          ) : (
            <p className="text-red-500">Please sign in to view users.</p>
          )}
        </>
      )} */}
      <div className="mt-4">
        <Link href="/signin" className="text-blue-500 hover:underline">
          Sign In
        </Link>
        <br />
        {/* <Link href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link> */}
        {/* <br /> */}
        <Link href="/password-change" className="text-blue-500 hover:underline">
          Change Password
        </Link>
        <br />
        <Link href="/password-reset-request" className="text-blue-500 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  )
}
