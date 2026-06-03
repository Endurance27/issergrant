interface IsserLogoProps {
  height?: number;
  white?: boolean;
}

export function IsserLogo({ height = 40 }: IsserLogoProps) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-[10px]"
      style={{
        background: '#ffffff',
        padding: '4px 10px',
      }}
    >
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
