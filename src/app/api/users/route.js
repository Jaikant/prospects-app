import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.person.findMany({
      take: 10
    })
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error in GET function:', error)
    return NextResponse.json({ error: 'Failed to fetch users', details: error }, { status: 400 })
  }
}
