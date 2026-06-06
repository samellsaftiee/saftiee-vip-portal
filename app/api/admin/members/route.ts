import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

async function guard() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const g = await guard(); if (g) return g
  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json({ members: data || [] })
}

export async function POST(req: NextRequest) {
  const g = await guard(); if (g) return g
  const body = await req.json()
  const { phone, name, rides_count, expires_at } = body

  if (!phone || !name || !expires_at) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('members')
    .insert({ phone: phone.replace(/[\s\-]/g, ''), name, rides_count: rides_count || 0, expires_at })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ member: data })
}
