"use client";

import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import {
  Crown, LogOut, Save, Plus, Trash2, ChevronDown, ChevronUp,
  Image as ImageIcon, Bell, Tag, FileText, Settings, Loader2, Check,
  Sparkles, Eye
} from "lucide-react";
import Link from "next/link";
import { ICON_OPTIONS } from "./BenefitIcon";
import type { SiteContent, Benefit, Update, PromoCode } from "@/lib/types";

interface Props { initialContent: SiteContent; }

type Tab = "hero" | "benefits" | "updates" | "codes" | "footer" | "logo";

function TabBtn({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void;
  icon: React.FC<any>; label: string;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium
        transition-all whitespace-nowrap
        ${active
          ? "bg-gradient-to-r from-gold-100 to-blush-50 text-gold-700 border border-gold-300/60 shadow-gold-sm"
          : "text-muted hover:text-ink hover:bg-white/60 border border-transparent"
        }`}>
      <Icon size={14} />
      {label}
    </button>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function AdminDashboard({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab,     setTab]     = useState<Tab>("hero");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<SiteContent>) =>
    setContent((prev) => ({ ...prev, ...patch }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      update({ logo: { ...content.logo, url } });
    }
  }

  // ── Benefits helpers
  const addBenefit = () => update({
    benefits: [
      ...content.benefits,
      { id: uid(), icon: "star", title: "Nouveau avantage", description: "", badge: "", color: "gold" },
    ],
  });
  const removeBenefit = (id: string) =>
    update({ benefits: content.benefits.filter((b) => b.id !== id) });
  const patchBenefit = (id: string, patch: Partial<Benefit>) =>
    update({ benefits: content.benefits.map((b) => b.id === id ? { ...b, ...patch } : b) });

  // ── Updates helpers
  const addUpdate = () => update({
    updates: [
      { id: uid(), date: new Date().toISOString().slice(0, 10), title: "Nouvelle mise à jour", content: "", tag: "Nouveau" },
      ...content.updates,
    ],
  });
  const removeUpdate = (id: string) =>
    update({ updates: content.updates.filter((u) => u.id !== id) });
  const patchUpdate = (id: string, patch: Partial<Update>) =>
    update({ updates: content.updates.map((u) => u.id === id ? { ...u, ...patch } : u) });

  // ── Promo codes helpers
  const addCode = () => update({
    promoCodes: [
      ...content.promoCodes,
      { id: uid(), code: "CODE-VIP", description: "", expiry: "2025-12-31", active: true },
    ],
  });
  const removeCode = (id: string) =>
    update({ promoCodes: content.promoCodes.filter((p) => p.id !== id) });
  const patchCode = (id: string, patch: Partial<PromoCode>) =>
    update({ promoCodes: content.promoCodes.map((p) => p.id === id ? { ...p, ...patch } : p) });

  return (
    <div className="min-h-screen bg-cream">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-50 glass border-b border-gold-200/30">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C9A84C, #F4A0BD)" }}>
              <Crown size={14} className="text-white" />
            </div>
            <div>
              <p className="font-body font-semibold text-sm text-ink/90 leading-none">Admin</p>
              <p className="text-muted text-xs font-body">Saftiee VIP Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank"
              className="btn-outline-gold py-2 px-3 text-xs hidden sm:inline-flex">
              <Eye size={13} />
              Voir le site
            </Link>
            <button onClick={save} disabled={saving}
              className="btn-gold py-2 px-4 text-xs disabled:opacity-60">
              {saving
                ? <><Loader2 size={13} className="animate-spin" />Enregistrement...</>
                : saved
                  ? <><Check size={13} />Enregistré !</>
                  : <><Save size={13} />Sauvegarder</>
              }
            </button>
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="p-2 rounded-xl text-muted hover:text-ink hover:bg-white/60 transition-all border border-transparent hover:border-gold-200/40">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        {/* ─── Tabs ─── */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <TabBtn active={tab === "hero"}     onClick={() => setTab("hero")}     icon={Sparkles}  label="Hero"       />
          <TabBtn active={tab === "logo"}     onClick={() => setTab("logo")}     icon={ImageIcon} label="Logo"       />
          <TabBtn active={tab === "benefits"} onClick={() => setTab("benefits")} icon={Crown}     label="Avantages"  />
          <TabBtn active={tab === "updates"}  onClick={() => setTab("updates")}  icon={Bell}      label="Actualités" />
          <TabBtn active={tab === "codes"}    onClick={() => setTab("codes")}    icon={Tag}       label="Codes VIP"  />
          <TabBtn active={tab === "footer"}   onClick={() => setTab("footer")}   icon={FileText}  label="Pied de page"/>
        </div>

        {/* ─────────────────── HERO ─────────────────── */}
        {tab === "hero" && (
          <div className="luxury-card p-6 space-y-4">
            <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted mb-4">
              Section Hero
            </h2>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Badge</label>
              <input className="input-luxury" value={content.hero.badge}
                onChange={(e) => update({ hero: { ...content.hero, badge: e.target.value } })} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Titre principal</label>
              <input className="input-luxury text-lg font-display" value={content.hero.title}
                onChange={(e) => update({ hero: { ...content.hero, title: e.target.value } })} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Sous-titre</label>
              <textarea rows={2} className="input-luxury resize-none" value={content.hero.subtitle}
                onChange={(e) => update({ hero: { ...content.hero, subtitle: e.target.value } })} />
            </div>
          </div>
        )}

        {/* ─────────────────── LOGO ─────────────────── */}
        {tab === "logo" && (
          <div className="luxury-card p-6 space-y-4">
            <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted mb-4">
              Logo & Marque
            </h2>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Nom affiché</label>
              <input className="input-luxury" value={content.logo.alt}
                onChange={(e) => update({ logo: { ...content.logo, alt: e.target.value } })} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-3 font-body">Image du logo</label>
              {content.logo.url && (
                <div className="mb-3 p-3 rounded-xl bg-white border border-gold-200/40 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.logo.url} alt="logo" className="h-12 w-auto object-contain" />
                </div>
              )}
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) uploadLogo(e.target.files[0]); }} />
              <button onClick={() => logoInputRef.current?.click()}
                className="btn-outline-gold text-xs">
                <ImageIcon size={13} />
                {content.logo.url ? "Changer le logo" : "Télécharger un logo"}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── BENEFITS ─────────────────── */}
        {tab === "benefits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted">
                Avantages VIP ({content.benefits.length})
              </h2>
              <button onClick={addBenefit} className="btn-gold text-xs py-2">
                <Plus size={13} />
                Ajouter
              </button>
            </div>

            {content.benefits.map((b, i) => (
              <div key={b.id} className="luxury-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted font-body">Avantage #{i + 1}</span>
                  <button onClick={() => removeBenefit(b.id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Titre</label>
                    <input className="input-luxury" value={b.title}
                      onChange={(e) => patchBenefit(b.id, { title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Badge</label>
                    <input className="input-luxury" value={b.badge}
                      onChange={(e) => patchBenefit(b.id, { badge: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted mb-1.5 font-body">Description</label>
                    <textarea rows={2} className="input-luxury resize-none" value={b.description}
                      onChange={(e) => patchBenefit(b.id, { description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Icône</label>
                    <select className="input-luxury" value={b.icon}
                      onChange={(e) => patchBenefit(b.id, { icon: e.target.value })}>
                      {ICON_OPTIONS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Couleur</label>
                    <select className="input-luxury" value={b.color}
                      onChange={(e) => patchBenefit(b.id, { color: e.target.value as "gold" | "blush" })}>
                      <option value="gold">Or (gold)</option>
                      <option value="blush">Rose (blush)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─────────────────── UPDATES ─────────────────── */}
        {tab === "updates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted">
                Actualités ({content.updates.length})
              </h2>
              <button onClick={addUpdate} className="btn-gold text-xs py-2">
                <Plus size={13} />
                Ajouter
              </button>
            </div>

            {content.updates.map((u, i) => (
              <div key={u.id} className="luxury-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted font-body">Actualité #{i + 1}</span>
                  <button onClick={() => removeUpdate(u.id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Titre</label>
                    <input className="input-luxury" value={u.title}
                      onChange={(e) => patchUpdate(u.id, { title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Tag</label>
                    <input className="input-luxury" value={u.tag}
                      onChange={(e) => patchUpdate(u.id, { tag: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Date</label>
                    <input type="date" className="input-luxury" value={u.date}
                      onChange={(e) => patchUpdate(u.id, { date: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted mb-1.5 font-body">Contenu</label>
                    <textarea rows={3} className="input-luxury resize-none" value={u.content}
                      onChange={(e) => patchUpdate(u.id, { content: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─────────────────── PROMO CODES ─────────────────── */}
        {tab === "codes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted">
                Codes VIP ({content.promoCodes.length})
              </h2>
              <button onClick={addCode} className="btn-gold text-xs py-2">
                <Plus size={13} />
                Ajouter
              </button>
            </div>

            {content.promoCodes.map((p, i) => (
              <div key={p.id} className={`luxury-card p-5 ${!p.active ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted font-body">Code #{i + 1}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`relative w-8 h-4 rounded-full transition-colors
                        ${p.active ? "bg-gold-400" : "bg-gray-200"}`}
                        onClick={() => patchCode(p.id, { active: !p.active })}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform
                          ${p.active ? "translate-x-4" : "translate-x-0.5"}`} />
                      </div>
                      <span className="text-xs text-muted font-body">{p.active ? "Actif" : "Désactivé"}</span>
                    </label>
                  </div>
                  <button onClick={() => removeCode(p.id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Code promo</label>
                    <input className="input-luxury font-mono uppercase" value={p.code}
                      onChange={(e) => patchCode(p.id, { code: e.target.value.toUpperCase() })} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-body">Date d&apos;expiration</label>
                    <input type="date" className="input-luxury" value={p.expiry}
                      onChange={(e) => patchCode(p.id, { expiry: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted mb-1.5 font-body">Description</label>
                    <input className="input-luxury" value={p.description}
                      onChange={(e) => patchCode(p.id, { description: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─────────────────── FOOTER ─────────────────── */}
        {tab === "footer" && (
          <div className="luxury-card p-6 space-y-4">
            <h2 className="font-body font-semibold text-sm uppercase tracking-widest text-muted mb-4">
              Pied de page
            </h2>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Tagline</label>
              <input className="input-luxury" value={content.footer.tagline}
                onChange={(e) => update({ footer: { ...content.footer, tagline: e.target.value } })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1.5 font-body">Téléphone</label>
                <input className="input-luxury" value={content.footer.contact.phone}
                  onChange={(e) => update({ footer: { ...content.footer, contact: { ...content.footer.contact, phone: e.target.value } } })} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-body">Email</label>
                <input type="email" className="input-luxury" value={content.footer.contact.email}
                  onChange={(e) => update({ footer: { ...content.footer, contact: { ...content.footer.contact, email: e.target.value } } })} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5 font-body">WhatsApp</label>
                <input className="input-luxury" value={content.footer.contact.whatsapp}
                  onChange={(e) => update({ footer: { ...content.footer, contact: { ...content.footer.contact, whatsapp: e.target.value } } })} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-body">Mention légale</label>
              <input className="input-luxury" value={content.footer.legal}
                onChange={(e) => update({ footer: { ...content.footer, legal: e.target.value } })} />
            </div>
          </div>
        )}

        {/* ─── Save reminder ─── */}
        <div className="mt-8 flex justify-end">
          <button onClick={save} disabled={saving}
            className="btn-gold py-3 px-8 text-sm disabled:opacity-60">
            {saving
              ? <><Loader2 size={14} className="animate-spin" />Enregistrement...</>
              : saved
                ? <><Check size={14} />Sauvegardé avec succès</>
                : <><Save size={14} />Sauvegarder toutes les modifications</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
