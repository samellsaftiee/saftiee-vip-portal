'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { Member, Advantage, Update, Tier } from '@/lib/types'

const TIERS: Tier[] = ['silver', 'gold', 'diamond']
const TIER_LABELS: Record<Tier, string> = { silver: 'Silver', gold: 'Gold', diamond: 'Diamond' }
const ICONS = ['gift', 'star', 'support', 'diamond', 'crown', 'tag', 'shield', 'zap']
const UPDATE_TYPES = ['reward', 'collection', 'commission', 'general']
const UPDATE_TYPE_LABELS: Record<string, string> = {
  reward: 'Récompense', collection: 'Collection',
  commission: '0 Commission', general: 'Info',
}

type Tab = 'members' | 'advantages' | 'updates'

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize:'11px', fontWeight:500, letterSpacing:'0.1em',
    textTransform:'uppercase', color:'#9A7A87', display:'block', marginBottom:'6px' }}>{children}</label>
}

function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ width:'100%', background:'rgba(245,234,240,0.04)',
    border:'1px solid rgba(232,130,154,0.15)', borderRadius:'10px', color:'#F5EAF0',
    fontFamily:'Inter, sans-serif', fontWeight:300, fontSize:'14px',
    padding:'10px 14px', outline:'none', boxSizing:'border-box', ...style }}/>
}

function Select({ style, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ width:'100%', background:'#1C1018',
    border:'1px solid rgba(232,130,154,0.15)', borderRadius:'10px', color:'#F5EAF0',
    fontFamily:'Inter, sans-serif', fontWeight:300, fontSize:'14px',
    padding:'10px 14px', outline:'none', cursor:'pointer', boxSizing:'border-box', ...style }}/>
}

function Textarea({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ width:'100%', background:'rgba(245,234,240,0.04)',
    border:'1px solid rgba(232,130,154,0.15)', borderRadius:'10px', color:'#F5EAF0',
    fontFamily:'Inter, sans-serif', fontWeight:300, fontSize:'14px',
    padding:'10px 14px', outline:'none', resize:'vertical', minHeight:'80px',
    boxSizing:'border-box', ...style }}/>
}

function Btn({ variant='primary', style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'ghost'|'danger' }) {
  const bg = variant === 'primary' ? 'linear-gradient(135deg,#C85C78,#E8829A)'
    : variant === 'danger' ? 'rgba(200,92,120,0.15)' : 'rgba(255,255,255,0.05)'
  const color = variant === 'danger' ? '#E8829A' : '#F5EAF0'
  return <button {...props} style={{ background:bg, border:'none', borderRadius:'10px',
    color, fontFamily:'Inter, sans-serif', fontSize:'12px', fontWeight:500,
    letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 18px',
    cursor:'pointer', ...style }}/>
}

function TierBadge({ tier }: { tier: Tier }) {
  const colors: Record<Tier, string> = { silver:'#9A9A9A', gold:'#D4A843', diamond:'#7EC8E3' }
  return <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'9px', fontWeight:500,
    letterSpacing:'0.1em', textTransform:'uppercase',
    background:`${colors[tier]}18`, color:colors[tier],
    border:`1px solid ${colors[tier]}30` }}>{TIER_LABELS[tier]}</span>
}

export default function AdminDashboard() {
  const { status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('members')

  const [members, setMembers] = useState<Member[]>([])
  const [memberForm, setMemberForm] = useState({ phone:'', name:'', rides_count:'0', expires_at:'' })
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [memberMsg, setMemberMsg] = useState('')

  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [advForm, setAdvForm] = useState({ title:'', description:'', icon:'star', required_tier:'silver' as Tier })
  const [editingAdv, setEditingAdv] = useState<Advantage | null>(null)
  const [advMsg, setAdvMsg] = useState('')

  const [updates, setUpdates] = useState<Update[]>([])
  const [updForm, setUpdForm] = useState({ title:'', body:'', type:'general', commission_days:'' })
  const [updMsg, setUpdMsg] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login')
  }, [status, router])

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [m, a, u] = await Promise.all([
      fetch('/api/admin/members').then(r => r.json()),
      fetch('/api/admin/advantages').then(r => r.json()),
      fetch('/api/admin/updates').then(r => r.json()),
    ])
    setMembers(m.members || [])
    setAdvantages(a.advantages || [])
    setUpdates(u.updates || [])
  }

  async function saveMember() {
    const url = editingMember ? `/api/admin/members/${editingMember.id}` : '/api/admin/members'
    const method = editingMember ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...memberForm, rides_count: parseInt(memberForm.rides_count) || 0 }) })
    const data = await res.json()
    if (res.ok) {
      setMemberMsg(editingMember ? 'Membre mis à jour' : 'Membre créé')
      setMemberForm({ phone:'', name:'', rides_count:'0', expires_at:'' })
      setEditingMember(null)
      fetchAll()
    } else setMemberMsg(data.error || 'Erreur')
    setTimeout(() => setMemberMsg(''), 3000)
  }

  async function deleteMember(id: string) {
    if (!confirm('Supprimer ce membre ?')) return
    await fetch(`/api/admin/members/${id}`, { method:'DELETE' })
    fetchAll()
  }

  function editMember(m: Member) {
    setEditingMember(m)
    setMemberForm({ phone:m.phone, name:m.name,
      rides_count:String(m.rides_count), expires_at:m.expires_at.slice(0,10) })
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  async function saveAdv() {
    const url = editingAdv ? `/api/admin/advantages/${editingAdv.id}` : '/api/admin/advantages'
    const method = editingAdv ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(advForm) })
    const data = await res.json()
    if (res.ok) {
      setAdvMsg(editingAdv ? 'Privilège mis à jour' : 'Privilège ajouté')
      setAdvForm({ title:'', description:'', icon:'star', required_tier:'silver' })
      setEditingAdv(null)
      fetchAll()
    } else setAdvMsg(data.error || 'Erreur')
    setTimeout(() => setAdvMsg(''), 3000)
  }

  async function deleteAdv(id: string) {
    if (!confirm('Supprimer ce privilège ?')) return
    await fetch(`/api/admin/advantages/${id}`, { method:'DELETE' })
    fetchAll()
  }

  async function saveUpdate() {
    const body = {
      ...updForm,
      commission_days: updForm.type === 'commission' ? parseInt(updForm.commission_days) || null : null,
    }
    const res = await fetch('/api/admin/updates', { method:'POST',
      headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const data = await res.json()
    if (res.ok) {
      setUpdMsg('Publication envoyée')
      setUpdForm({ title:'', body:'', type:'general', commission_days:'' })
      fetchAll()
    } else setUpdMsg(data.error || 'Erreur')
    setTimeout(() => setUpdMsg(''), 3000)
  }

  async function deleteUpdate(id: string) {
    if (!confirm('Supprimer cette actualité ?')) return
    await fetch(`/api/admin/updates/${id}`, { method:'DELETE' })
    fetchAll()
  }

  if (status === 'loading') return null

  const card: React.CSSProperties = { background:'rgba(232,130,154,0.05)',
    border:'1px solid rgba(232,130,154,0.1)', borderRadius:'16px', padding:'24px' }
  const row: React.CSSProperties = { display:'flex', gap:'12px', flexWrap:'wrap' }
  const col: React.CSSProperties = { flex:1, minWidth:'160px', display:'flex', flexDirection:'column', gap:'6px' }
  const th: React.CSSProperties = { textAlign:'left', fontSize:'9px', fontWeight:500, letterSpacing:'0.18em',
    textTransform:'uppercase', color:'#9A7A87', padding:'8px 12px',
    borderBottom:'1px solid rgba(232,130,154,0.1)' }
  const td: React.CSSProperties = { padding:'12px', borderBottom:'1px solid rgba(232,130,154,0.06)',
    fontSize:'13px', color:'#F5EAF0', verticalAlign:'middle' }
  const msg: React.CSSProperties = { fontSize:'12px', color:'#E8829A', marginTop:'8px' }

  return (
    <main style={{ minHeight:'100vh', background:'#0E080C', color:'#F5EAF0',
      fontFamily:'Inter, sans-serif', fontWeight:300 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #3D2A34; }
      `}</style>

      <div style={{ background:'rgba(14,8,12,0.9)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(232,130,154,0.1)', padding:'0 24px', height:'56px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
          <span style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:'20px', color:'#F5EAF0' }}>Saftiee</span>
          <span style={{ fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase',
            color:'#9A7A87' }}>Administration</span>
        </div>
        <Btn variant="ghost" onClick={() => router.push('/api/auth/signout')}
          style={{ padding:'8px 14px', fontSize:'11px' }}>Déconnexion</Btn>
      </div>

      <div style={{ display:'flex', gap:'4px', padding:'20px 24px 0',
        borderBottom:'1px solid rgba(232,130,154,0.08)', maxWidth:'1000px', margin:'0 auto' }}>
        {(['members','advantages','updates'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab===t ? 'rgba(232,130,154,0.1)' : 'transparent',
            border: tab===t ? '1px solid rgba(232,130,154,0.2)' : '1px solid transparent',
            borderBottom:'none', borderRadius:'10px 10px 0 0',
            color: tab===t ? '#E8829A' : '#9A7A87',
            fontFamily:'Inter, sans-serif', fontSize:'11px', fontWeight:500,
            letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 20px', cursor:'pointer',
          }}>
            {{ members:'Membres', advantages:'Privilèges', updates:'Actualités' }[t]}
            <span style={{ marginLeft:'8px', fontSize:'10px', opacity:0.6 }}>
              {t==='members' ? members.length : t==='advantages' ? advantages.length : updates.length}
            </span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'24px' }}>

        {tab === 'members' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={card}>
              <div style={{ fontSize:'13px', fontWeight:500, color:'#F5EAF0', marginBottom:'18px' }}>
                {editingMember ? `Modifier — ${editingMember.name}` : 'Nouveau membre'}
              </div>
              <div style={row}>
                <div style={col}>
                  <Label>Numéro de téléphone</Label>
                  <Input placeholder="0661234567" value={memberForm.phone}
                    onChange={e => setMemberForm(f => ({...f, phone:e.target.value}))}/>
                </div>
                <div style={col}>
                  <Label>Nom (sur la carte)</Label>
                  <Input placeholder="Prénom Nom" value={memberForm.name}
                    onChange={e => setMemberForm(f => ({...f, name:e.target.value}))}/>
                </div>
                <div style={col}>
                  <Label>Nombre de courses</Label>
                  <Input type="number" min="0" value={memberForm.rides_count}
                    onChange={e => setMemberForm(f => ({...f, rides_count:e.target.value}))}/>
                  <div style={{ fontSize:'10px', color:'#5C3F4A' }}>
                    {parseInt(memberForm.rides_count)||0 >= 150 ? '→ Diamond' :
                     parseInt(memberForm.rides_count)||0 >= 60  ? '→ Gold' : '→ Silver'} (auto)
                  </div>
                </div>
                <div style={col}>
                  <Label>Date d'expiration</Label>
                  <Input type="date" value={memberForm.expires_at}
                    onChange={e => setMemberForm(f => ({...f, expires_at:e.target.value}))}/>
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'16px', alignItems:'center' }}>
                <Btn onClick={saveMember}>{editingMember ? 'Enregistrer' : 'Créer le membre'}</Btn>
                {editingMember && (
                  <Btn variant="ghost" onClick={() => {
                    setEditingMember(null)
                    setMemberForm({phone:'',name:'',rides_count:'0',expires_at:''})
                  }}>Annuler</Btn>
                )}
                {memberMsg && <span style={msg}>{memberMsg}</span>}
              </div>
            </div>

            <div style={card}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Nom','Téléphone','Courses','Rang','Expire','Statut',''].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id}>
                      <td style={td}>{m.name}</td>
                      <td style={{...td, color:'#9A7A87', fontFamily:'monospace', fontSize:'12px'}}>{m.phone}</td>
                      <td style={td}>{m.rides_count}</td>
                      <td style={td}><TierBadge tier={m.tier}/></td>
                      <td style={{...td, color:'#9A7A87', fontSize:'12px'}}>{m.expires_at?.slice(0,10)}</td>
                      <td style={td}>
                        <span style={{ fontSize:'9px', fontWeight:500, textTransform:'uppercase',
                          color: m.is_active ? '#6BCB77' : '#9A7A87' }}>
                          {m.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <Btn variant="ghost" style={{ padding:'6px 12px', fontSize:'10px' }}
                            onClick={() => editMember(m)}>Modifier</Btn>
                          <Btn variant="danger" style={{ padding:'6px 12px', fontSize:'10px' }}
                            onClick={() => deleteMember(m.id)}>Suppr.</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr><td colSpan={7} style={{...td, textAlign:'center', color:'#5C3F4A', padding:'32px'}}>
                      Aucun membre enregistré
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'advantages' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={card}>
              <div style={{ fontSize:'13px', fontWeight:500, color:'#F5EAF0', marginBottom:'18px' }}>
                {editingAdv ? `Modifier — ${editingAdv.title}` : 'Nouveau privilège'}
              </div>
              <div style={row}>
                <div style={col}>
                  <Label>Titre</Label>
                  <Input placeholder="Ex: Livraison offerte" value={advForm.title}
                    onChange={e => setAdvForm(f => ({...f, title:e.target.value}))}/>
                </div>
                <div style={col}>
                  <Label>Rang requis</Label>
                  <Select value={advForm.required_tier}
                    onChange={e => setAdvForm(f => ({...f, required_tier:e.target.value as Tier}))}>
                    {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                  </Select>
                </div>
                <div style={col}>
                  <Label>Icône</Label>
                  <Select value={advForm.icon}
                    onChange={e => setAdvForm(f => ({...f, icon:e.target.value}))}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </Select>
                </div>
              </div>
              <div style={{ marginTop:'12px', display:'flex', flexDirection:'column', gap:'6px' }}>
                <Label>Description</Label>
                <Input placeholder="Description courte" value={advForm.description}
                  onChange={e => setAdvForm(f => ({...f, description:e.target.value}))}/>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'16px', alignItems:'center' }}>
                <Btn onClick={saveAdv}>{editingAdv ? 'Enregistrer' : 'Ajouter le privilège'}</Btn>
                {editingAdv && (
                  <Btn variant="ghost" onClick={() => {
                    setEditingAdv(null)
                    setAdvForm({title:'',description:'',icon:'star',required_tier:'silver'})
                  }}>Annuler</Btn>
                )}
                {advMsg && <span style={msg}>{advMsg}</span>}
              </div>
            </div>

            <div style={card}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Titre','Description','Rang','Icône',''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {advantages.map(a => (
                    <tr key={a.id}>
                      <td style={td}>{a.title}</td>
                      <td style={{...td, color:'#9A7A87', fontSize:'12px'}}>{a.description}</td>
                      <td style={td}><TierBadge tier={a.required_tier}/></td>
                      <td style={{...td, color:'#9A7A87', fontSize:'12px'}}>{a.icon}</td>
                      <td style={td}>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <Btn variant="ghost" style={{ padding:'6px 12px', fontSize:'10px' }}
                            onClick={() => { setEditingAdv(a)
                              setAdvForm({title:a.title,description:a.description,icon:a.icon,required_tier:a.required_tier}) }}>
                            Modifier</Btn>
                          <Btn variant="danger" style={{ padding:'6px 12px', fontSize:'10px' }}
                            onClick={() => deleteAdv(a.id)}>Suppr.</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {advantages.length === 0 && (
                    <tr><td colSpan={5} style={{...td, textAlign:'center', color:'#5C3F4A', padding:'32px'}}>
                      Aucun privilège configuré
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'updates' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={card}>
              <div style={{ fontSize:'13px', fontWeight:500, color:'#F5EAF0', marginBottom:'18px' }}>
                Publier une actualité
              </div>
              <div style={row}>
                <div style={col}>
                  <Label>Type</Label>
                  <Select value={updForm.type}
                    onChange={e => setUpdForm(f => ({...f, type:e.target.value}))}>
                    {UPDATE_TYPES.map(t => <option key={t} value={t}>{UPDATE_TYPE_LABELS[t]}</option>)}
                  </Select>
                </div>
                {updForm.type === 'commission' && (
                  <div style={{...col, maxWidth:'160px'}}>
                    <Label>Jours offerts</Label>
                    <Input type="number" min="1" placeholder="5" value={updForm.commission_days}
                      onChange={e => setUpdForm(f => ({...f, commission_days:e.target.value}))}/>
                  </div>
                )}
              </div>
              <div style={{ marginTop:'12px', display:'flex', flexDirection:'column', gap:'6px' }}>
                <Label>Titre</Label>
                <Input placeholder="Ex: 5 jours sans commission offerts" value={updForm.title}
                  onChange={e => setUpdForm(f => ({...f, title:e.target.value}))}/>
              </div>
              <div style={{ marginTop:'12px', display:'flex', flexDirection:'column', gap:'6px' }}>
                <Label>Message</Label>
                <Textarea placeholder="Message visible par tous les membres actifs..."
                  value={updForm.body}
                  onChange={e => setUpdForm(f => ({...f, body:e.target.value}))}/>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'16px', alignItems:'center' }}>
                <Btn onClick={saveUpdate}>Publier</Btn>
                {updMsg && <span style={msg}>{updMsg}</span>}
              </div>
            </div>

            <div style={card}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Titre','Type','Jours','Date',''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {updates.map(u => (
                    <tr key={u.id}>
                      <td style={td}>{u.title}</td>
                      <td style={td}>
                        <span style={{ fontSize:'9px', fontWeight:500, textTransform:'uppercase',
                          color:'#9A7A87' }}>{UPDATE_TYPE_LABELS[u.type]}</span>
                      </td>
                      <td style={{...td, color:'#D4A843'}}>{u.commission_days ? `${u.commission_days}j` : '—'}</td>
                      <td style={{...td, color:'#9A7A87', fontSize:'12px'}}>
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={td}>
                        <Btn variant="danger" style={{ padding:'6px 12px', fontSize:'10px' }}
                          onClick={() => deleteUpdate(u.id)}>Suppr.</Btn>
                      </td>
                    </tr>
                  ))}
                  {updates.length === 0 && (
                    <tr><td colSpan={5} style={{...td, textAlign:'center', color:'#5C3F4A', padding:'32px'}}>
                      Aucune actualité publiée
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
