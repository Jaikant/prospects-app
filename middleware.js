import { NextResponse } from 'next/server'
import { supabase } from './src/lib/supabaseClient'

export async function middleware(req) {
  const { data: { user } } = await supabase.auth.getUser(req.headers.get('authorization'))

  if (!user && req.nextUrl.pathname === '/users') {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/users',
}
