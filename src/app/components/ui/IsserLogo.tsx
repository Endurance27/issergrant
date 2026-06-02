interface IsserLogoProps {
  height?: number;
  white?: boolean;
}

export function IsserLogo({ height = 40, white = false }: IsserLogoProps) {
  return (
    <img
      src="/isser-logo.png"
      alt="ISSER - University of Ghana - Knowledge for Development"
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        filter: white ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  );
}
