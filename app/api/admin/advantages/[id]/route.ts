import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

async function guard() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guard(); if (g) return g
  const body = await req.json()
  const { title, description, icon, required_tier, sort_order, is_active } = body

  const { data, error } = await supabaseAdmin
    .from('advantages')
    .update({ title, description, icon, required_tier, sort_order, is_active })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ advantage: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guard(); if (g) return g
  const { error } = await supabaseAdmin.from('advantages').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
