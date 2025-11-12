export function SkillBridgeLogo({ size = 40, className = "" }) {
  const viewBoxSize = 32;
  const scale = size / viewBoxSize;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white" />
      <path d="M12 14L16 12L20 14V18L16 20L12 18V14Z" fill="currentColor" />
      <circle cx="16" cy="16" r="2" fill="white" />
      <path d="M10 10L22 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 22L22 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
