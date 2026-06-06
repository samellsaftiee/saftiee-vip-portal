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
    .from('updates')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json({ updates: data || [] })
}

export async function POST(req: NextRequest) {
  const g = await guard(); if (g) return g
  const body = await req.json()
  const { title, body: msgBody, type, commission_days } = body

  if (!title || !msgBody || !type) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('updates')
    .insert({
      title,
      body: msgBody,
      type,
      commission_days: type === 'commission' ? commission_days || null : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ update: data })
}
