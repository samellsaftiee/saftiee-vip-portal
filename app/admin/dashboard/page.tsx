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
          top:'-15%', left:'-10%', filter:'blur(90px)', opacity:0.14 }}/>
        <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #E8829A 0%, transparent 70%)',
          bottom:'10%', right:'-5%', filter:'blur(90px)', opacity:0.09 }}/>
      </div>

      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:'rgba(14,8,12,0.8)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(232,130,154,0.08)',
        padding:'0 20px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
          fontSize:'20px', fontWeight:300, color:'#F5EAF0' }}>Saftiee</div>
        <button onClick={handleLogout} style={{ background:'none', border:'none', color:'#5C3F4A',
          fontSize:'11px', fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase',
          cursor:'pointer', fontFamily:'Inter, sans-serif' }}>Déconnexion</button>
      </div>

      <div style={{ position:'relative', zIndex:1, paddingTop:'72px', paddingBottom:'60px' }}>
        <div style={{ maxWidth:'460px', margin:'0 auto', padding:'0 20px',
          display:'flex', flexDirection:'column', animation:'fadeUp 0.7s ease both' }}>

          {/* Greeting */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' }}>
            <div>
              <div style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.2em',
                textTransform:'uppercase', color:'#9A7A87', marginBottom:'2px' }}>Bonsoir</div>
              <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                fontSize:'32px', fontWeight:300, lineHeight:1.1 }}>
                <span style={{ color:'#E8829A' }}>{member.name}</span>
              </div>
            </div>
            <div style={{ width:'46px', height:'46px', borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg, #2A141E, #1C0D17)',
              border:'1.5px solid rgba(232,130,154,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
              fontSize:'17px', color:'#E8829A' }}>
              {member.name.slice(0,2).toUpperCase()}
            </div>
          </div>

          {/* VIP Card */}
          <div style={{ perspective:'1200px', marginBottom:'28px' }}>
            <div ref={cardRef} style={{ width:'100%', aspectRatio:'1.586/1', borderRadius:'18px',
              position:'relative', overflow:'hidden', cursor:'pointer',
              transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
              boxShadow:'0 24px 70px rgba(0,0,0,0.55)' }}>
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(135deg, #1E0E17 0%, #2A1220 25%, #160B13 50%, #221018 75%, #1A0C15 100%)' }}/>
              <div style={{ position:'absolute', inset:0,
                background:'repeating-linear-gradient(105deg, transparent 0px, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)' }}/>
              <div style={{ position:'absolute', width:'300px', height:'300px', borderRadius:'50%',
                background:'radial-gradient(ellipse, rgba(200,92,120,0.18) 0%, transparent 70%)',
                top:'-100px', right:'-80px' }}/>
              <div style={{ position:'absolute', inset:0, borderRadius:'18px',
                border:'1px solid rgba(212,168,67,0.35)' }}/>
              <div style={{ position:'relative', zIndex:10, padding:'22px 24px',
                height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:'20px', fontWeight:300, color:'#F5EAF0' }}>Saftiee</div>
                    <div style={{ fontSize:'7px', fontWeight:500, letterSpacing:'0.26em',
                      textTransform:'uppercase', color:'#D4A843' }}>Membre VIP</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'3px' }}>
                    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                      <path d="M13 3 L23 13 L13 23 L3 13 Z" stroke="#D4A843" strokeWidth="1.2" fill="rgba(212,168,67,0.12)"/>
                    </svg>
                    <div style={{ fontSize:'7.5px', fontWeight:500, letterSpacing:'0.2em',
                      textTransform:'uppercase', color:'#D4A843' }}>{TIER_LABELS[member.tier]}</div>
                  </div>
                </div>
                <div style={{ width:'34px', height:'24px', borderRadius:'4px',
                  background:'linear-gradient(135deg, #D4A843, #B8922E, #E8C96A, #C49A30)',
                  position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:'3px', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'2px' }}/>
                  <div style={{ position:'absolute', left:0, right:0, top:'50%', height:'1px', background:'rgba(255,255,255,0.2)' }}/>
                </div>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'18px', fontWeight:300,
                    letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5EAF0', marginBottom:'2px' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize:'8.5px', letterSpacing:'0.14em', color:'#9A7A87', textTransform:'uppercase' }}>
                    Expire le {formatDate(member.expires_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Ring */}
          <div style={{ marginBottom:'24px' }}>
            <div style={{ fontSize:'9px', fontWeight:500, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'#9A7A87', marginBottom:'14px' }}>Score de fidélité</div>
            <div style={{ background:'rgba(232,130,154,0.06)', border:'1px solid rgba(232,130,154,0.12)',
              borderRadius:'18px', padding:'24px 20px', display:'flex', alignItems:'center', gap:'24px' }}>
              <div style={{ position:'relative', flexShrink:0, width:'100px', height:'100px' }}>
                <svg viewBox="0 0 110 110" width="100" height="100" style={{ transform:'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C85C78"/>
                      <stop offset="50%" stopColor="#E8829A"/>
                      <stop offset="100%" stopColor="#D4A843"/>
                    </linearGradient>
                  </defs>
                  <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
                  <circle cx="55" cy="55" r="45" fill="none" stroke="url(#rg)" strokeWidth="7"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={ringOffset}/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'26px',
                    fontWeight:300, color:'#F5EAF0', lineHeight:1 }}>{member.rides_count}</div>
                  <div style={{ fontSize:'9px', color:'#9A7A87' }}>courses</div>
                </div>
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'10px' }}>
                <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:'20px', fontWeight:300, color:'#D4A843' }}>{TIER_LABELS[member.tier]}</div>
                <div style={{ fontSize:'11px', color:'#9A7A87', lineHeight:1.7 }}>
                  {nextTierInfo
                    ? <>{nextTierInfo.count} courses avant <strong style={{ color:'#F5EAF0' }}>{TIER_LABELS[nextTierInfo.nextTier]}</strong></>
                    : 'Rang maximum atteint !'}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  {TIER_ORDER.map((t, i) => (
                    <div key={t} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                      <div style={{ height:'3px', width:'100%', borderRadius:'2px',
                        background: i < tierIndex ? 'rgba(212,168,67,0.4)' : i === tierIndex ? '#D4A843' : 'rgba(255,255,255,0.07)' }}/>
                      <div style={{ fontSize:'8px', letterSpacing:'0.1em', textTransform:'uppercase',
                        color: i <= tierIndex ? '#D4A843' : '#3D2A34' }}>{TIER_LABELS[t]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privileges */}
          <div style={{ marginBottom:'24px' }}>
            <div style={{ fontSize:'9px', fontWeight:500, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'#9A7A87', marginBottom:'14px' }}>Vos Privilèges</div>
            <div style={{ background:'rgba(232,130,154,0.06)', border:'1px solid rgba(232,130,154,0.12)',
              borderRadius:'18px', overflow:'hidden' }}>
              {unlocked.map((a, i) => (
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 20px',
                  borderBottom: i < unlocked.length-1 || locked.length > 0 ? '1px solid rgba(232,130,154,0.06)' : 'none' }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'10px',
                    background:'rgba(212,168,67,0.08)', border:'1px solid rgba(212,168,67,0.14)',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <PrivIcon name={a.icon}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:400, color:'#F5EAF0', marginBottom:'2px' }}>{a.title}</div>
                    <div style={{ fontSize:'11px', color:'#9A7A87', lineHeight:1.5 }}>{a.description}</div>
                  </div>
                  <div style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'8.5px', fontWeight:500,
                    letterSpacing:'0.1em', textTransform:'uppercase', flexShrink:0,
                    background:'rgba(212,168,67,0.1)', color:'#D4A843', border:'1px solid rgba(212,168,67,0.18)' }}>Actif</div>
                </div>
              ))}
              {locked.map((a, i) => (
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 20px',
                  borderBottom: i < locked.length-1 ? '1px solid rgba(232,130,154,0.06)' : 'none', opacity:0.5 }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'10px',
                    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <PrivIcon name={a.icon}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', color:'#9A7A87', marginBottom:'2px' }}>{a.title}</div>
                    <div style={{ fontSize:'11px', color:'#5C3F4A', lineHeight:1.5 }}>{a.description}</div>
                  </div>
                  <div style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'8.5px', fontWeight:500,
                    letterSpacing:'0.1em', textTransform:'uppercase', flexShrink:0,
                    background:'rgba(232,130,154,0.06)', color:'#9A7A87', border:'1px solid rgba(232,130,154,0.1)' }}>
                    {TIER_LABELS[a.required_tier]}
                  </div>
                </div>
              ))}
              {advantages.length === 0 && (
                <div style={{ padding:'24px', textAlign:'center', color:'#5C3F4A', fontSize:'12px' }}>
                  Aucun privilège configuré
                </div>
              )}
            </div>
          </div>

          {/* Updates */}
          {updates.length > 0 && (
            <div>
              <div style={{ fontSize:'9px', fontWeight:500, letterSpacing:'0.22em',
                textTransform:'uppercase', color:'#9A7A87', marginBottom:'14px' }}>Actualités</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {updates.map(u => (
                  <div key={u.id} style={{ background:'rgba(232,130,154,0.06)',
                    border:'1px solid rgba(232,130,154,0.12)', borderRadius:'14px', padding:'16px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0,
                        background: u.type === 'commission' || u.type === 'reward' ? '#D4A843' : '#E8829A' }}/>
                      <span style={{ fontSize:'9px', fontWeight:500, letterSpacing:'0.18em',
                        textTransform:'uppercase', color:'#9A7A87' }}>
                        {{ reward:'Récompense', collection:'Collection', commission:'Commission', general:'Info' }[u.type]}
                      </span>
                      {u.type === 'commission' && u.commission_days && (
                        <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'8px', fontWeight:500,
                          background:'rgba(212,168,67,0.1)', color:'#D4A843', border:'1px solid rgba(212,168,67,0.18)' }}>
                          {u.commission_days} jours offerts
                        </span>
                      )}
                      <span style={{ marginLeft:'auto', fontSize:'9px', color:'#3D2A34' }}>{timeAgo(u.created_at)}</span>
                    </div>
                    <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'16px',
                      fontWeight:300, color:'#F5EAF0', lineHeight:1.3, marginBottom:'6px' }}>{u.title}</div>
                    <div style={{ fontSize:'11.5px', color:'#9A7A87', lineHeight:1.6 }}>{u.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
