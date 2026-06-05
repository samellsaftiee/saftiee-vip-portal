import {
  Hotel, ShieldCheck, Dumbbell, Car, Coffee, Phone,
  Star, Gift, Zap, Heart, MapPin, Tag, Bell, Crown,
  Sparkles, type LucideProps,
} from "lucide-react";

const icons: Record<string, React.FC<LucideProps>> = {
  hotel:    Hotel,
  shield:   ShieldCheck,
  spa:      Dumbbell,
  car:      Car,
  coffee:   Coffee,
  phone:    Phone,
  star:     Star,
  gift:     Gift,
  zap:      Zap,
  heart:    Heart,
  map:      MapPin,
  tag:      Tag,
  bell:     Bell,
  crown:    Crown,
  sparkles: Sparkles,
};

interface BenefitIconProps extends LucideProps {
  name: string;
}

export function BenefitIcon({ name, ...props }: BenefitIconProps) {
  const Icon = icons[name] ?? Star;
  return <Icon {...props} />;
}

export const ICON_OPTIONS = Object.keys(icons);
