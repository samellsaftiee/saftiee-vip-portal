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
  const { phone, name, rides_count, expires_at, is_active } = body

  const { data, error } = await supabaseAdmin
    .from('members')
    .update({ phone: phone?.replace(/[\s\-]/g, ''), name, rides_count, expires_at, is_active })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ member: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guard(); if (g) return g
  const { error } = await supabaseAdmin.from('members').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
