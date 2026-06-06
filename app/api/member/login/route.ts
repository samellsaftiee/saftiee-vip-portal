import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    const normalized = phone.replace(/[\s\-]/g, '')

    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('phone', normalized)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      return NextResponse.json({ error: 'Numéro non reconnu' }, { status: 404 })
    }

    const today = new Date()
    const expiry = new Date(member.expires_at)
    if (expiry < today) {
      return NextResponse.json({ error: 'Accès expiré' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      member: {
        id:          member.id,
        name:        member.name,
        phone:       member.phone,
        rides_count: member.rides_count,
        tier:        member.tier,
        expires_at:  member.expires_at,
      }
    })

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
