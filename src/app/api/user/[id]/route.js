import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient';

export async function GET(request, { params }) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  const { id } = params

  try {

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const person = await prisma.person.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        enrollments: {
          include: {
            program: true
          }
        },
        prospectEntries: {
          include: {
            program: true 
          }    
        }
      }
    })
    
    if (person) {
      return NextResponse.json(person, { status: 200 })
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error in GET function:', error)
    return NextResponse.json({ error: 'Failed to fetch user', details: error }, { status: 400 })
  } finally {
    await prisma.$disconnect();
  }
}