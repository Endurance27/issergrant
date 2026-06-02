interface IsserLogoProps {
  height?: number;
  white?: boolean;
}

export function IsserLogo({ height = 40 }: IsserLogoProps) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 10,
      padding: '4px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src="/isser-logo.png"
        alt="ISSER - University of Ghana - Knowledge for Development"
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
