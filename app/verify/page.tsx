'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()

  useEffect(() => {
    const member = sessionStorage.getItem('vip_member')
    if (!member) {
      router.replace('/')
      return
    }
    const t = setTimeout(() => router.replace('/dashboard'), 1800)
    return () => clearTimeout(t)
  }, [router])

  return (
    <main style={{
      minHeight:'100vh', background:'#0E080C',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      fontFamily:'Inter, sans-serif', position:'relative', overflow:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Inter:wght@300;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{
          position:'absolute', width:'600px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #C85C78 0%, transparent 70%)',
          top:'-10%', left:'-10%', filter:'blur(90px)', opacity:0.12,
        }}/>
      </div>

      <div style={{
        width:'80px', height:'80px', marginBottom:'32px', position:'relative',
        animation:'fadeIn 0.5s ease both',
      }}>
        <svg
          viewBox="0 0 80 80" width="80" height="80"
          style={{ animation:'spin 2s linear infinite', transformOrigin:'center' }}
        >
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8829A" stopOpacity="0"/>
              <stop offset="60%" stopColor="#E8829A"/>
              <stop offset="100%" stopColor="#D4A843"/>
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(232,130,154,0.08)" strokeWidth="3"/>
          <circle cx="40" cy="40" r="32" fill="none"
            stroke="url(#sg)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="200" strokeDashoffset="150"
            transform="rotate(-90 40 40)"
          />
        </svg>
      </div>

      <div style={{
        fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
        fontSize:'24px', fontWeight:300, color:'#F5EAF0', marginBottom:'8px',
        animation:'fadeIn 0.6s ease 0.2s both', position:'relative', zIndex:1,
      }}>Vérification en cours…</div>

      <div style={{
        fontSize:'10px', fontWeight:500, letterSpacing:'0.2em',
        textTransform:'uppercase', color:'#9A7A87',
        animation:'fadeIn 0.6s ease 0.4s both', position:'relative', zIndex:1,
      }}>Authentification du membre</div>
    </main>
  )
}
