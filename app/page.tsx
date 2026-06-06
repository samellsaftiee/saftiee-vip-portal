'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!phone.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion')
        setLoading(false)
        return
      }

      sessionStorage.setItem('vip_member', JSON.stringify(data.member))
      router.push('/verify')

    } catch {
      setError('Erreur réseau. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0E080C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{
          position:'absolute', width:'700px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #C85C78 0%, transparent 70%)',
          top:'-20%', left:'-15%', filter:'blur(90px)', opacity:0.18,
          animation:'drift 14s ease-in-out infinite alternate',
        }}/>
        <div style={{
          position:'absolute', width:'500px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #E8829A 0%, transparent 70%)',
          top:'30%', right:'-10%', filter:'blur(90px)', opacity:0.12,
          animation:'drift 14s ease-in-out infinite alternate', animationDelay:'-5s',
        }}/>
        <div style={{
          position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(ellipse, #D4A843 0%, transparent 70%)',
          bottom:'-10%', left:'30%', filter:'blur(90px)', opacity:0.07,
          animation:'drift 14s ease-in-out infinite alternate', animationDelay:'-9s',
        }}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,40px) scale(1.08); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        input::placeholder { color: #3D2A34; }
        input:focus { outline: none; }
      `}</style>

      <div style={{
        position:'relative', zIndex:10, width:'100%', maxWidth:'400px',
        padding:'0 24px', display:'flex', flexDirection:'column', alignItems:'center',
        animation:'fadeUp 0.9s ease both',
      }}>
        <svg width="60" height="60" viewBox="0 0 68 68" fill="none" style={{ marginBottom:'18px' }}>
          <circle cx="34" cy="34" r="32" stroke="#C85C78" strokeWidth="0.8" opacity="0.4"/>
          <circle cx="34" cy="34" r="28" stroke="#D4A843" strokeWidth="0.5" opacity="0.25"/>
          <path d="M34 12 L52 34 L34 56 L16 34 Z" stroke="#E8829A" strokeWidth="1" fill="rgba(200,92,120,0.06)"/>
          <path d="M34 20 L34 48 M22 34 L46 34" stroke="#D4A843" strokeWidth="0.6" opacity="0.5"/>
          <circle cx="34" cy="34" r="3" fill="#E8829A" opacity="0.8"/>
          <circle cx="34" cy="12" r="1.5" fill="#D4A843" opacity="0.6"/>
          <circle cx="52" cy="34" r="1.5" fill="#D4A843" opacity="0.6"/>
          <circle cx="34" cy="56" r="1.5" fill="#D4A843" opacity="0.6"/>
          <circle cx="16" cy="34" r="1.5" fill="#D4A843" opacity="0.6"/>
        </svg>

        <div style={{
          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontWeight:300,
          fontSize:'36px', letterSpacing:'0.12em', color:'#F5EAF0', marginBottom:'4px',
        }}>Saftiee</div>
        <div style={{
          fontSize:'9px', fontWeight:500, letterSpacing:'0.28em', textTransform:'uppercase',
          color:'#9A7A87', marginBottom:'48px',
        }}>Portail VIP Privé</div>

        <div style={{
          width:'100%', background:'rgba(232,130,154,0.06)',
          border:'1px solid rgba(232,130,154,0.12)', backdropFilter:'blur(24px)',
          borderRadius:'20px', padding:'36px 32px',
        }}>
          <div style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:'21px', fontWeight:300, color:'#F5EAF0', marginBottom:'6px',
          }}>Accès Membres</div>
          <div style={{
            fontSize:'12px', color:'#9A7A87', marginBottom:'26px', lineHeight:'1.6',
          }}>Saisissez votre numéro pour accéder à votre espace privé.</div>

          <div style={{
            display:'flex', alignItems:'center',
            background:'rgba(245,234,240,0.04)',
            border: error ? '1px solid rgba(200,92,120,0.5)' : '1px solid rgba(232,130,154,0.2)',
            borderRadius:'12px', overflow:'hidden', marginBottom:'8px',
          }}>
            <div style={{
              padding:'0 14px', color:'#9A7A87', fontSize:'13px',
              borderRight:'1px solid rgba(232,130,154,0.12)',
              height:'52px', display:'flex', alignItems:'center',
            }}>+213</div>
            <input
              type="tel"
              placeholder="06 XX XX XX XX"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                flex:1, background:'transparent', border:'none',
                color:'#F5EAF0', fontFamily:'Inter, sans-serif', fontWeight:300,
                fontSize:'16px', padding:'0 16px', height:'52px',
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize:'12px', color:'#E8829A', marginBottom:'12px', paddingLeft:'4px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !phone.trim()}
            style={{
              width:'100%', height:'52px', marginTop:'12px',
              background: loading ? 'rgba(200,92,120,0.4)' : 'linear-gradient(135deg, #C85C78 0%, #E8829A 100%)',
              border:'none', borderRadius:'12px', color:'white',
              fontFamily:'Inter, sans-serif', fontSize:'12px', fontWeight:500,
              letterSpacing:'0.14em', textTransform:'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(200,92,120,0.3)',
            }}
          >
            {loading ? 'Vérification…' : 'Accéder au Portail'}
          </button>

          <div style={{
            marginTop:'22px', textAlign:'center', fontSize:'11px',
            color:'#3D2A34', lineHeight:'1.7',
          }}>
            Réservé aux membres enregistrés.<br/>
            Accès strictement confidentiel.
          </div>
        </div>
      </div>
    </main>
  )
}
