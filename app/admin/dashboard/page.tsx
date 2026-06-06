'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Member, Advantage, Update, Tier } from '@/lib/types'
import { getRidesUntilNext } from '@/lib/types'

const TIER_ORDER: Tier[] = ['silver', 'gold', 'diamond']
const TIER_LABELS: Record<Tier, string> = { silver: 'Silver', gold: 'Gold', diamond: 'Diamond' }

function getTierProgress(rides: number): number {
  if (rides >= 150) return 100
  if (rides >= 60)  return Math.round(((rides - 60) / 90) * 100)
  return Math.round((rides / 60) * 100)
}

function getRingOffset(progress: number): number {
  const circumference = 2 * Math.PI * 45
  return circumference - (progress / 100) * circumference
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7)  return `Il y a ${days} jours`
  return formatDate(iso)
}

function PrivIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    gift:    <path d="M8 2a2 2 0 0 0-3.464-2A2 2 0 0 0 2 2h3m3 0H5m3 0v2M5 2v2M2 4h12v2H2zm1 2v8h10V6"/>,
    star:    <path d="M8 1l1.9 3.8 4.1.6-3 2.9.7 4.1L8 10.4 4.3 12.4l.7-4.1-3-2.9 4.1-.6z"/>,
    support: <path d="M8 1a5 5 0 0 0-5 5v1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1a5 5 0 0 0 5 5 5 5 0 0 0 5-5h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V6a5 5 0 0 0-5-5z"/>,
    diamond: <path d="M8 14 1 6l2-4h10l2 4zM1 6h14M5 2l-2 4 5 8 5-8-2-4"/>,
    crown:   <><path d="M2 13h12M2 13l2-7 4 3 4-7 2 7"/><circle cx="2" cy="6" r="1"/><circle cx="14" cy="6" r="1"/><circle cx="8" cy="9" r="1"/></>,
    tag:     <><path d="M1 1h6l7 7a2 2 0 0 1 0 2.8l-3.2 3.2a2 2 0 0 1-2.8 0L1 7V1z"/><circle cx="4" cy="4" r="1"/></>,
    shield:  <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1z"/>,
    zap:     <path d="M9 1L4 9h5l-2 6 7-8H9L11 1z"/>,
  }
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none"
      stroke="#D4A843" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || icons.star}
    </svg>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('vip_member')
    if (!raw) { router.replace('/'); return }
    const cached = JSON.parse(raw) as Member

    fetch(`/api/member/data?id=${cached.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.replace('/'); return }
        setMember(data.member)
        setAdvantages(data.advantages)
        setUpdates(data.updates)
        setLoading(false)
      })
      .catch(() => router.replace('/'))
  }, [router])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `rotateY(${x*12}deg) rotateX(${-y*8}deg) translateY(-4px)`
    }
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [loading])

  function handleLogout() {
    sessionStorage.removeItem('vip_member')
    router.replace('/')
  }

  if (loading) {
    return (
      <main style={{ minHeight:'100vh', background:'#0E080C', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg viewBox="0 0 40 40" width="40" height="40" style={{ animation:'spin 1.5s linear infinite' }}>
          <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(232,130,154,0.15)" strokeWidth="2.5"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E8829A" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="100" strokeDashoffset="75" transform="rotate(-90 20 20)"/>
        </svg>
      </main>
    )
  }

  if (!member) return null

  const tierIndex = TIER_ORDER.indexOf(member.tier)
  const progress = getTierProgress(member.rides_count)
  const ringOffset = getRingOffset(progress)
  const nextTierInfo = getRidesUntilNext(member.rides_count)
  const circumference = 2 * Math.PI * 45
  const unlocked = advantages.filter(a => TIER_ORDER.indexOf(a.required_tier) <= tierIndex)
  const locked    = advantages.filter(a => TIER_ORDER.indexOf(a.required_tier) > tierIndex)

  return (
    <main style={{
      minHeight:'100vh', background:'#0E080C', fontFamily:'Inter, sans-serif',
      fontWeight:300, color:'#F5EAF0', position:'relative', overflowX:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(232,130,154,0.15);border-radius:2px}
      `}</style>

      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
        <div style={{ position:'absolute', width:'600px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #C85C78 0%, transparent 70%)',
          top:'-15%', l
