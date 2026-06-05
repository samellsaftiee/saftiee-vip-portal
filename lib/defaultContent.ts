import type { SiteContent } from "./types";

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "Saftiee Driver VIP",
    subtitle: "Accès exclusif aux avantages conductrices Saftiee",
    badge: "Programme VIP Officiel",
  },
  logo: {
    url: null,
    alt: "Saftiee",
  },
  benefits: [
    {
      id: "b1",
      icon: "hotel",
      title: "Hôtels Partenaires",
      description: "Tarifs préférentiels dans les meilleurs établissements d'Oran et d'Algérie.",
      badge: "–20% à –40%",
      color: "gold",
    },
    {
      id: "b2",
      icon: "shield",
      title: "Assurances VIP",
      description: "Couverture complète véhicule et personnelle avec nos partenaires assureurs.",
      badge: "Tarif exclusif",
      color: "blush",
    },
    {
      id: "b3",
      icon: "spa",
      title: "Bien-être & Gym",
      description: "Accès clubs de sport, spas et centres de bien-être partenaires.",
      badge: "Accès illimité",
      color: "gold",
    },
    {
      id: "b4",
      icon: "car",
      title: "Services Véhicule",
      description: "Révisions, pneumatiques, lavage auto — chez nos garages partenaires.",
      badge: "Prix réduits",
      color: "blush",
    },
    {
      id: "b5",
      icon: "coffee",
      title: "Restaurants & Cafés",
      description: "Bons de réduction dans une sélection de restaurants et salons de thé.",
      badge: "Nouveauté",
      color: "gold",
    },
    {
      id: "b6",
      icon: "phone",
      title: "Support Prioritaire",
      description: "Ligne dédiée VIP — réponse garantie en moins de 2 heures.",
      badge: "24h/7j",
      color: "blush",
    },
  ],
  updates: [
    {
      id: "u1",
      date: "2025-06-01",
      title: "Nouveau partenaire : Pharmacies Algérie",
      content: "Bénéficiez de 15% de réduction dans plus de 30 pharmacies partenaires à travers la wilaya d'Oran.",
      tag: "Nouveau",
    },
    {
      id: "u2",
      date: "2025-05-20",
      title: "Extension du réseau hôtelier",
      content: "5 nouveaux hôtels rejoignent le programme VIP Saftiee. Consultez vos codes d'accès ci-dessous.",
      tag: "Mise à jour",
    },
    {
      id: "u3",
      date: "2025-05-10",
      title: "Bonus conduite exceptionnelle",
      content: "Les conductrices avec une note ≥ 4.8 reçoivent un bonus spécial ce mois-ci. Félicitations !",
      tag: "Bonus",
    },
  ],
  promoCodes: [
    { id: "p1", code: "SAFTIEE-VIP10", description: "10% chez Auto Express Oran", expiry: "2025-12-31", active: true },
    { id: "p2", code: "HOTEL-DRV25", description: "25% Hôtel Eden Oran", expiry: "2025-09-30", active: true },
    { id: "p3", code: "GYM-SAFTIEE", description: "1 mois offert — FitZone Oran", expiry: "2025-08-31", active: true },
  ],
  footer: {
    tagline: "Parce que chaque conductrice Saftiee mérite le meilleur.",
    contact: {
      phone: "+213 XXX XXX XXX",
      email: "vip@saftiee.dz",
      whatsapp: "+213 XXX XXX XXX",
    },
    legal: "© 2025 Saftiee. Tous droits réservés.",
  },
};
