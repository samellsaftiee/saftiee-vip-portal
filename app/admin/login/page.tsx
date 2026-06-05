"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(244,160,189,0.08) 0%, transparent 60%), #FDF8F3",
      }}>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #C9A84C, #F4A0BD)" }}>
            <Crown size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-light gold-text mb-1">Saftiee VIP</h1>
          <p className="text-muted text-xs font-body">Panneau d&apos;administration</p>
        </div>

        {/* Card */}
        <div className="luxury-card p-7">
          <h2 className="font-body text-sm font-medium text-ink/70 mb-6 text-center uppercase tracking-widest">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-medium text-muted mb-1.5 ml-0.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saftiee.dz"
                className="input-luxury"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-body font-medium text-muted mb-1.5 ml-0.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-luxury pr-10"
                  required
                  autoComplete="current-password"
                />
                <button type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200/60
                text-red-600 text-xs font-body text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Connexion...</>
                : "Se connecter"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-muted/50 text-xs font-body mt-5">
          Accès réservé — personnel autorisé uniquement
        </p>
      </div>
    </div>
  );
}
