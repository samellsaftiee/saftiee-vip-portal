"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown, Copy, Check, ChevronDown, Phone, Mail, MessageCircle, Sparkles, Calendar } from "lucide-react";
import { BenefitIcon } from "./BenefitIcon";
import type { SiteContent } from "@/lib/types";

interface Props { content: SiteContent; }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="promo-code flex items-center gap-2 group">
      <span>{code}</span>
      {copied
        ? <Check size={13} className="text-green-500" />
        : <Copy size={13} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      }
    </button>
  );
}

export function VIPPage({ content }: Props) {
  const { hero, logo, benefits, updates, promoCodes, footer } = content;
  const activeCodes = promoCodes.filter((p) => p.active);

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* ─── Ambient background ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fde68a 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #F4A0BD 0%, transparent 70%)" }} />
        <div className="absolute bottom-32 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} />
      </div>

      {/* ─── Navigation Bar ─── */}
      <nav className="sticky top-0 z-50 glass border-b border-gold-200/30">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {logo.url ? (
              <Image src={logo.url} alt={logo.alt} width={36} height={36} className="rounded-lg object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #C9A84C, #F4A0BD)" }}>
                <Crown size={16} className="text-white" />
              </div>
            )}
            <span className="font-display text-lg font-semibold gold-text">{logo.alt || "Saftiee"}</span>
          </div>
          <span className="badge-vip">
            <Sparkles size={11} />
            VIP
          </span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 pb-20">

        {/* ─── HERO ─── */}
        <section className="pt-16 pb-12 text-center">
          <div className="mb-5 flex justify-center">
            <span className="badge-vip text-xs">
              <Crown size={12} />
              {hero.badge}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-wide mb-4 leading-tight"
            style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.1s forwards" }}>
            <span className="gold-text">{hero.title}</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted max-w-md mx-auto leading-relaxed"
            style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.3s forwards" }}>
            {hero.subtitle}
          </p>
          <div className="mt-8 divider-gold" />
        </section>

        {/* ─── AVANTAGES VIP ─── */}
        <section className="py-10">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3">Vos Avantages</h2>
            <p className="text-muted text-sm font-body">
              Des privilèges sélectionnés pour valoriser votre engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={b.id} className="luxury-card p-5 relative overflow-hidden group"
                style={{ opacity: 0, animation: `fadeUp 0.6s ease ${0.1 + i * 0.08}s forwards` }}>
                {/* shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.06) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }} />

                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                    ${b.color === "gold"
                      ? "bg-gradient-to-br from-gold-100 to-gold-200/60"
                      : "bg-gradient-to-br from-blush-100 to-blush-200/60"
                    }`}>
                    <BenefitIcon
                      name={b.icon}
                      size={19}
                      className={b.color === "gold" ? "text-gold-600" : "text-blush-600"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-body font-semibold text-sm text-ink/90">{b.title}</h3>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-body font-medium
                        ${b.color === "gold"
                          ? "bg-gold-50 text-gold-700 border border-gold-200/60"
                          : "bg-blush-50 text-blush-700 border border-blush-200/60"
                        }`}>
                        {b.badge}
                      </span>
                    </div>
                    <p className="text-muted text-xs leading-relaxed font-body">{b.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CODES PROMO ─── */}
        {activeCodes.length > 0 && (
          <section className="py-10">
            <div className="text-center mb-8">
              <h2 className="section-heading mb-3">Codes VIP</h2>
              <p className="text-muted text-sm font-body">
                Cliquez sur un code pour le copier
              </p>
            </div>

            <div className="luxury-card p-6">
              <div className="space-y-4">
                {activeCodes.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                    pb-4 border-b border-gold-100/60 last:border-0 last:pb-0">
                    <div>
                      <p className="font-body text-sm font-medium text-ink/80 mb-0.5">{p.description}</p>
                      <p className="text-muted text-xs font-body flex items-center gap-1">
                        <Calendar size={11} />
                        Expire le {formatDate(p.expiry)}
                      </p>
                    </div>
                    <CopyCodeButton code={p.code} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── MISES À JOUR ─── */}
        <section className="py-10">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3">Actualités VIP</h2>
            <p className="text-muted text-sm font-body">
              Les dernières nouvelles de votre programme
            </p>
          </div>

          <div className="space-y-4">
            {updates.map((u, i) => (
              <article key={u.id} className="luxury-card p-5 flex gap-4"
                style={{ opacity: 0, animation: `fadeUp 0.6s ease ${0.1 + i * 0.1}s forwards` }}>
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-2 h-2 rounded-full mt-1.5"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #F4A0BD)" }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-body font-medium px-2 py-0.5 rounded-full
                      bg-blush-50 text-blush-700 border border-blush-200/50">
                      {u.tag}
                    </span>
                    <time className="text-muted text-xs font-body">{formatDate(u.date)}</time>
                  </div>
                  <h3 className="font-body font-semibold text-sm text-ink/90 mb-1.5">{u.title}</h3>
                  <p className="text-muted text-xs leading-relaxed font-body">{u.content}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="pt-10 border-t border-gold-200/30">
          <div className="text-center mb-8">
            <p className="font-display text-xl font-light text-muted/80 italic">
              &ldquo;{footer.tagline}&rdquo;
            </p>
          </div>

          <div className="luxury-card p-6">
            <h3 className="font-body text-xs font-medium uppercase tracking-widest text-muted mb-4 text-center">
              Nous contacter
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href={`tel:${footer.contact.phone}`}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                  bg-gold-50/60 text-gold-700 text-sm font-body font-medium
                  border border-gold-200/50 hover:border-gold-400 transition-all hover:bg-gold-50">
                <Phone size={14} />
                <span className="truncate">{footer.contact.phone}</span>
              </a>
              <a href={`mailto:${footer.contact.email}`}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                  bg-blush-50/60 text-blush-700 text-sm font-body font-medium
                  border border-blush-200/50 hover:border-blush-400 transition-all hover:bg-blush-50">
                <Mail size={14} />
                <span className="truncate">{footer.contact.email}</span>
              </a>
              <a href={`https://wa.me/${footer.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                  bg-green-50/60 text-green-700 text-sm font-body font-medium
                  border border-green-200/50 hover:border-green-400 transition-all hover:bg-green-50">
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <p className="text-center text-muted text-xs font-body mt-6">{footer.legal}</p>
        </footer>
      </main>
    </div>
  );
}
