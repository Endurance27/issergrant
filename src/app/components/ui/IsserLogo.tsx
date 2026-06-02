interface IsserLogoProps {
  height?: number;
  white?: boolean;
}

export function IsserLogo({ height = 40, white = false }: IsserLogoProps) {
  const textColor = white ? '#FFFFFF' : '#1A3A6B';
  const goldColor = white ? 'rgba(255,255,255,0.85)' : '#B79A64';
  const subColor = white ? 'rgba(255,255,255,0.75)' : '#2F4A75';
  const scale = height / 60;

  return (
    <svg
      width={Math.round(160 * scale)}
      height={height}
      viewBox="0 0 160 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="28" cy="30" rx="22" ry="13" stroke={goldColor} strokeWidth="1.8" fill="none" transform="rotate(-20 28 30)" />
      <ellipse cx="28" cy="30" rx="22" ry="13" stroke={goldColor} strokeWidth="1.8" fill="none" transform="rotate(20 28 30)" opacity="0.5" />
      <circle cx="28" cy="10" r="2.5" fill={goldColor} />
      <text x="58" y="26" fontFamily="'Plus Jakarta Sans', Georgia, serif" fontWeight="800" fontSize="18" fill={textColor} letterSpacing="1">ISSER</text>
      <text x="58" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" fontSize="7.5" fill={subColor} letterSpacing="0.3">UNIVERSITY OF GHANA</text>
      <text x="58" y="49" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="400" fontSize="6.5" fill={goldColor} letterSpacing="0.2">Knowledge for Development</text>
    </svg>
  );
}
