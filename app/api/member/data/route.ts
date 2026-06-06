import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const memberId = req.nextUrl.searchParams.get('id')

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('id', memberId)
      .eq('is_active', true)
      .single()

    if (memberError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const { data: advantages } = await supabase
      .from('advantages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const { data: updates } = await supabase
      .from('updates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      member,
      advantages: advantages || [],
      updates:    updates    || [],
    })

  } catch (err) {
    console.error('Data fetch error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
