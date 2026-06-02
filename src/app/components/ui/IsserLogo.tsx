interface IsserLogoProps {
  height?: number;
  white?: boolean;
}

export function IsserLogo({ height = 40 }: IsserLogoProps) {
  return (
    <img
      src="/isser-logo.png"
      alt="ISSER - University of Ghana - Knowledge for Development"
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
      }}
    />
  );
}
