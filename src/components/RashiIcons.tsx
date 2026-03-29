// Indian astrology rashi pictorial SVG icons
// Each icon is a silhouette matching the traditional zodiac wheel imagery

interface IconProps {
  color: string;
  size?: number;
}

export function MeshIcon({ color, size = 32 }: IconProps) {
  // Aries — Ram
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Ram head */}
        <ellipse cx="32" cy="22" rx="10" ry="9" />
        {/* Left horn curl */}
        <path d="M22 18 C14 12 10 6 16 4 C20 3 22 8 20 12 C18 15 20 18 22 18Z" />
        {/* Right horn curl */}
        <path d="M42 18 C50 12 54 6 48 4 C44 3 42 8 44 12 C46 15 44 18 42 18Z" />
        {/* Body */}
        <ellipse cx="32" cy="42" rx="9" ry="11" />
        {/* Neck */}
        <rect x="28" y="30" width="8" height="6" rx="2" />
        {/* Legs */}
        <rect x="24" y="51" width="5" height="9" rx="2" />
        <rect x="35" y="51" width="5" height="9" rx="2" />
        {/* Eyes */}
        <circle cx="28" cy="21" r="1.5" fill="white" />
        <circle cx="36" cy="21" r="1.5" fill="white" />
      </g>
    </svg>
  );
}

export function VrushabhIcon({ color, size = 32 }: IconProps) {
  // Taurus — Bull head
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Bull head */}
        <ellipse cx="32" cy="32" rx="16" ry="14" />
        {/* Snout */}
        <ellipse cx="32" cy="41" rx="9" ry="6" />
        {/* Nostrils */}
        <circle cx="28" cy="42" r="2" fill="white" />
        <circle cx="36" cy="42" r="2" fill="white" />
        {/* Left horn */}
        <path d="M18 22 C10 14 8 6 14 5 C18 5 20 12 18 22Z" />
        {/* Right horn */}
        <path d="M46 22 C54 14 56 6 50 5 C46 5 44 12 46 22Z" />
        {/* Ears */}
        <ellipse cx="16" cy="28" rx="5" ry="7" />
        <ellipse cx="48" cy="28" rx="5" ry="7" />
        {/* Eyes */}
        <circle cx="26" cy="28" r="3" fill="white" />
        <circle cx="38" cy="28" r="3" fill="white" />
        <circle cx="27" cy="28" r="1.5" fill={color} opacity="0.3" />
        <circle cx="39" cy="28" r="1.5" fill={color} opacity="0.3" />
      </g>
    </svg>
  );
}

export function MithunaIcon({ color, size = 32 }: IconProps) {
  // Gemini — Twins (two figures)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Left figure head */}
        <circle cx="20" cy="10" r="6" />
        {/* Left figure body */}
        <path d="M14 18 C14 16 26 16 26 18 L28 40 L12 40 Z" />
        {/* Left figure legs */}
        <rect x="13" y="40" width="5" height="14" rx="2" />
        <rect x="20" y="40" width="5" height="14" rx="2" />
        {/* Right figure head */}
        <circle cx="44" cy="10" r="6" />
        {/* Right figure body */}
        <path d="M38 18 C38 16 50 16 50 18 L52 40 L36 40 Z" />
        {/* Right figure legs */}
        <rect x="37" y="40" width="5" height="14" rx="2" />
        <rect x="44" y="40" width="5" height="14" rx="2" />
        {/* Connecting bar top */}
        <rect x="24" y="18" width="16" height="3" rx="1.5" />
        {/* Connecting bar bottom */}
        <rect x="24" y="36" width="16" height="3" rx="1.5" />
      </g>
    </svg>
  );
}

export function KarkIcon({ color, size = 32 }: IconProps) {
  // Cancer — Crab
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Body shell */}
        <ellipse cx="32" cy="34" rx="16" ry="12" />
        {/* Shell pattern */}
        <ellipse cx="32" cy="34" rx="10" ry="7" fill="white" opacity="0.2" />
        {/* Left big claw */}
        <path d="M16 28 C8 22 4 14 8 10 C11 7 15 10 14 16 C13 20 15 24 16 28Z" />
        <ellipse cx="8" cy="10" rx="4" ry="3" />
        <ellipse cx="12" cy="7" rx="3" ry="2.5" />
        {/* Right big claw */}
        <path d="M48 28 C56 22 60 14 56 10 C53 7 49 10 50 16 C51 20 49 24 48 28Z" />
        <ellipse cx="56" cy="10" rx="4" ry="3" />
        <ellipse cx="52" cy="7" rx="3" ry="2.5" />
        {/* Left legs */}
        <line x1="18" y1="32" x2="8" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="36" x2="8" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="40" x2="12" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Right legs */}
        <line x1="46" y1="32" x2="56" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="46" y1="36" x2="56" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="40" x2="52" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Eyes on stalks */}
        <line x1="27" y1="22" x2="25" y2="16" stroke={color} strokeWidth="2" />
        <circle cx="25" cy="15" r="3" />
        <line x1="37" y1="22" x2="39" y2="16" stroke={color} strokeWidth="2" />
        <circle cx="39" cy="15" r="3" />
      </g>
    </svg>
  );
}

export function SinhIcon({ color, size = 32 }: IconProps) {
  // Leo — Lion
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Mane */}
        <circle cx="32" cy="24" r="18" opacity="0.5" />
        {/* Face */}
        <circle cx="32" cy="24" r="13" />
        {/* Snout */}
        <ellipse cx="32" cy="31" rx="7" ry="5" />
        {/* Nose */}
        <ellipse cx="32" cy="28" rx="3" ry="2" fill="white" opacity="0.4" />
        {/* Eyes */}
        <circle cx="26" cy="22" r="3" fill="white" />
        <circle cx="38" cy="22" r="3" fill="white" />
        <circle cx="27" cy="22" r="1.5" fill={color} opacity="0.3" />
        <circle cx="39" cy="22" r="1.5" fill={color} opacity="0.3" />
        {/* Ears */}
        <path d="M20 14 L16 6 L24 12 Z" />
        <path d="M44 14 L48 6 L40 12 Z" />
        {/* Body */}
        <ellipse cx="32" cy="50" rx="10" ry="8" />
        {/* Neck */}
        <rect x="28" y="36" width="8" height="8" rx="3" />
        {/* Tail curl */}
        <path d="M42 50 C52 48 56 42 52 38 C48 34 44 38 46 42" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="47" cy="43" r="2" />
      </g>
    </svg>
  );
}

export function KanyaIcon({ color, size = 32 }: IconProps) {
  // Virgo — Woman with wheat
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Head */}
        <circle cx="32" cy="10" r="7" />
        {/* Hair flowing */}
        <path d="M26 8 C20 6 18 18 22 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M38 8 C44 6 46 18 42 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Body/dress */}
        <path d="M24 20 C24 18 40 18 40 20 L44 48 L20 48 Z" />
        {/* Left arm */}
        <path d="M24 26 L14 34 L16 36" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Right arm holding wheat */}
        <path d="M40 26 L50 22" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Wheat stalk */}
        <line x1="50" y1="22" x2="56" y2="8" stroke={color} strokeWidth="2" />
        {/* Wheat grains */}
        <ellipse cx="54" cy="10" rx="3" ry="4" transform="rotate(-20 54 10)" />
        <ellipse cx="57" cy="12" rx="3" ry="4" transform="rotate(10 57 12)" />
        <ellipse cx="56" cy="7" rx="3" ry="4" transform="rotate(-40 56 7)" />
        {/* Legs */}
        <rect x="25" y="48" width="6" height="12" rx="3" />
        <rect x="33" y="48" width="6" height="12" rx="3" />
      </g>
    </svg>
  );
}

export function TulaIcon({ color, size = 32 }: IconProps) {
  // Libra — Scales of justice
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Center pole */}
        <rect x="30" y="8" width="4" height="44" rx="2" />
        {/* Base */}
        <rect x="18" y="52" width="28" height="5" rx="2.5" />
        <rect x="22" y="57" width="20" height="4" rx="2" />
        {/* Balance beam */}
        <rect x="10" y="20" width="44" height="4" rx="2" />
        {/* Top knob */}
        <circle cx="32" cy="10" r="5" />
        {/* Left chain */}
        <line x1="14" y1="24" x2="14" y2="36" stroke={color} strokeWidth="2" strokeDasharray="3,2" />
        {/* Right chain */}
        <line x1="50" y1="24" x2="50" y2="36" stroke={color} strokeWidth="2" strokeDasharray="3,2" />
        {/* Left pan */}
        <path d="M6 36 Q14 42 22 36" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Right pan (slightly lower — unbalanced) */}
        <path d="M42 38 Q50 44 58 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Pan edges */}
        <line x1="6" y1="36" x2="22" y2="36" stroke={color} strokeWidth="2" />
        <line x1="42" y1="38" x2="58" y2="38" stroke={color} strokeWidth="2" />
      </g>
    </svg>
  );
}

export function VrushchikIcon({ color, size = 32 }: IconProps) {
  // Scorpio — Scorpion
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Body segments */}
        <ellipse cx="32" cy="28" rx="10" ry="8" />
        <ellipse cx="32" cy="38" rx="8" ry="6" />
        {/* Tail segments curving up */}
        <ellipse cx="34" cy="48" rx="6" ry="5" />
        <ellipse cx="40" cy="54" rx="5" ry="4" />
        <ellipse cx="47" cy="54" rx="4" ry="4" />
        {/* Stinger */}
        <path d="M50 52 C56 48 58 42 54 40 C52 39 50 42 52 46" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <polygon points="54,40 58,36 56,42" />
        {/* Left claws */}
        <path d="M22 24 L10 16" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="8" cy="14" rx="5" ry="3" transform="rotate(-30 8 14)" />
        <ellipse cx="11" cy="11" rx="4" ry="2.5" transform="rotate(-60 11 11)" />
        {/* Right claws */}
        <path d="M42 24 L54 16" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="56" cy="14" rx="5" ry="3" transform="rotate(30 56 14)" />
        <ellipse cx="53" cy="11" rx="4" ry="2.5" transform="rotate(60 53 11)" />
        {/* Legs */}
        <line x1="22" y1="28" x2="12" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="32" x2="10" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="28" x2="52" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="32" x2="54" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="28" cy="26" r="2" fill="white" />
        <circle cx="36" cy="26" r="2" fill="white" />
      </g>
    </svg>
  );
}

export function DhanuIcon({ color, size = 32 }: IconProps) {
  // Sagittarius — Archer / Centaur with bow
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Human torso head */}
        <circle cx="38" cy="10" r="6" />
        {/* Torso */}
        <path d="M32 16 C32 14 44 14 44 16 L44 30 L32 30 Z" />
        {/* Left arm pulling bowstring */}
        <path d="M32 22 L18 28" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Right arm holding bow */}
        <path d="M44 20 L56 14" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Bow */}
        <path d="M52 8 C60 14 60 24 52 28" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Bowstring */}
        <line x1="52" y1="8" x2="52" y2="28" stroke={color} strokeWidth="1.5" />
        {/* Arrow */}
        <line x1="18" y1="28" x2="52" y2="18" stroke={color} strokeWidth="2" />
        <polygon points="18,28 14,24 14,32" />
        {/* Horse body */}
        <ellipse cx="24" cy="44" rx="14" ry="9" />
        {/* Horse neck connecting */}
        <path d="M32 30 L30 36 L18 36" fill={color} />
        {/* Horse legs */}
        <rect x="12" y="51" width="5" height="10" rx="2" />
        <rect x="19" y="51" width="5" height="10" rx="2" />
        <rect x="26" y="51" width="5" height="10" rx="2" />
        <rect x="33" y="51" width="5" height="10" rx="2" />
        {/* Horse tail */}
        <path d="M38 44 C44 40 48 44 46 50" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function MakarIcon({ color, size = 32 }: IconProps) {
  // Capricorn — Sea-goat (goat head + fish tail)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Goat head */}
        <ellipse cx="20" cy="18" rx="10" ry="9" />
        {/* Left horn */}
        <path d="M14 12 C10 4 14 0 18 4 C20 8 18 12 14 12Z" />
        {/* Right horn */}
        <path d="M22 10 C24 2 28 0 28 6 C28 10 24 10 22 10Z" />
        {/* Beard */}
        <path d="M16 24 C14 28 16 32 20 30" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Ears */}
        <ellipse cx="10" cy="18" rx="4" ry="6" />
        {/* Goat body */}
        <ellipse cx="32" cy="36" rx="12" ry="10" />
        {/* Neck */}
        <path d="M20 22 L24 28 L32 28" fill={color} />
        {/* Front legs */}
        <rect x="24" y="44" width="5" height="10" rx="2" />
        <rect x="32" y="44" width="5" height="10" rx="2" />
        {/* Fish tail replacing back legs */}
        <path d="M38 34 C46 30 54 34 52 42 C50 48 42 50 38 46 C34 42 36 36 38 34Z" />
        {/* Tail fin */}
        <path d="M52 40 C58 36 62 44 56 48 C52 50 52 44 52 40Z" />
        {/* Scales on tail */}
        <path d="M42 36 Q46 34 50 36" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M40 40 Q44 38 48 40" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
        {/* Eye */}
        <circle cx="18" cy="17" r="2.5" fill="white" />
      </g>
    </svg>
  );
}

export function KumbhIcon({ color, size = 32 }: IconProps) {
  // Aquarius — Water bearer with pot
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Head */}
        <circle cx="32" cy="9" r="7" />
        {/* Body */}
        <path d="M24 18 C24 16 40 16 40 18 L42 40 L22 40 Z" />
        {/* Left arm raised holding pot */}
        <path d="M24 24 L12 18 L10 22" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Pot / Kumbh */}
        <path d="M4 14 C2 16 2 22 4 24 C6 26 14 26 16 24 C18 22 18 16 16 14 C14 12 6 12 4 14Z" />
        {/* Pot neck */}
        <rect x="7" y="10" width="6" height="4" rx="1" />
        {/* Water pouring out */}
        <path d="M4 14 C0 10 -2 6 2 4" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Water waves on ground */}
        <path d="M8 54 Q16 50 24 54 Q32 58 40 54 Q48 50 56 54" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M4 60 Q12 56 20 60 Q28 64 36 60 Q44 56 52 60" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M40 24 L50 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <rect x="26" y="40" width="6" height="10" rx="3" />
        <rect x="34" y="40" width="6" height="10" rx="3" />
      </g>
    </svg>
  );
}

export function MeenIcon({ color, size = 32 }: IconProps) {
  // Pisces — Two fish swimming in opposite directions
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        {/* Top fish (swimming right) */}
        <ellipse cx="34" cy="18" rx="14" ry="7" transform="rotate(-20 34 18)" />
        {/* Top fish tail */}
        <path d="M46 12 L54 6 L54 14 Z" />
        {/* Top fish eye */}
        <circle cx="24" cy="20" r="2" fill="white" />
        {/* Top fish fin */}
        <path d="M30 12 C32 8 38 10 36 14" fill="white" opacity="0.3" />
        {/* Bottom fish (swimming left) */}
        <ellipse cx="30" cy="46" rx="14" ry="7" transform="rotate(20 30 46)" />
        {/* Bottom fish tail */}
        <path d="M18 52 L10 58 L10 50 Z" />
        {/* Bottom fish eye */}
        <circle cx="40" cy="44" r="2" fill="white" />
        {/* Bottom fish fin */}
        <path d="M34 52 C32 56 26 54 28 50" fill="white" opacity="0.3" />
        {/* Connecting cord between fish */}
        <path d="M26 24 C20 30 20 36 26 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3,2" />
        <path d="M38 24 C44 30 44 36 38 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3,2" />
        {/* Bubbles */}
        <circle cx="50" cy="22" r="2" opacity="0.5" />
        <circle cx="54" cy="18" r="1.5" opacity="0.4" />
        <circle cx="14" cy="42" r="2" opacity="0.5" />
        <circle cx="10" cy="46" r="1.5" opacity="0.4" />
      </g>
    </svg>
  );
}

// Map rashi index (0-11) to icon component
export const RASHI_ICONS = [
  MeshIcon,      // 0 Aries / Mesh
  VrushabhIcon,  // 1 Taurus / Vrushabh
  MithunaIcon,   // 2 Gemini / Mithuna
  KarkIcon,      // 3 Cancer / Kark
  SinhIcon,      // 4 Leo / Sinh
  KanyaIcon,     // 5 Virgo / Kanya
  TulaIcon,      // 6 Libra / Tula
  VrushchikIcon, // 7 Scorpio / Vrushchik
  DhanuIcon,     // 8 Sagittarius / Dhanu
  MakarIcon,     // 9 Capricorn / Makar
  KumbhIcon,     // 10 Aquarius / Kumbh
  MeenIcon,      // 11 Pisces / Meen
];
