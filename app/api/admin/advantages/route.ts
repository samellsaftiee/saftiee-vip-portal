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
    .from('advantages')
    .select('*')
    .order('sort_order', { ascending: true })
  return NextResponse.json({ advantages: data || [] })
}

export async function POST(req: NextRequest) {
  const g = await guard(); if (g) return g
  const body = await req.json()
  const { title, description, icon, required_tier } = body

  if (!title || !description || !required_tier) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('advantages')
    .insert({ title, description, icon: icon || 'star', required_tier })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ advantage: data })
}
