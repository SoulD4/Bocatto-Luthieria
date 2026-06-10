/**
 * Stylized concept illustration of a classical guitar. Used as elegant
 * placeholder art until real photography is available. Wood tones are
 * configurable so each catalog entry feels distinct.
 */
export default function GuitarArt({
  woodFrom = "#5a3b22",
  woodTo = "#2e1d10",
  className = "",
}: {
  woodFrom?: string;
  woodTo?: string;
  className?: string;
}) {
  // Stable id derived from the palette: identical colors produce identical
  // gradient defs, so collisions are harmless (and SSR stays deterministic).
  const id = `ga-${woodFrom.replace("#", "")}-${woodTo.replace("#", "")}`;
  return (
    <svg
      viewBox="0 0 200 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={woodFrom} />
          <stop offset="100%" stopColor={woodTo} />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8cd6f" />
          <stop offset="100%" stopColor="#8c6d1f" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Neck */}
      <rect x="92" y="34" width="16" height="150" fill={`url(#${id}-wood)`} stroke="rgba(201,162,39,0.5)" strokeWidth="1" />
      {/* Headstock */}
      <path
        d="M86 10 h28 a4 4 0 0 1 4 4 v26 h-36 v-26 a4 4 0 0 1 4-4 Z"
        fill={`url(#${id}-wood)`}
        stroke="rgba(201,162,39,0.6)"
        strokeWidth="1"
      />
      {/* Tuners */}
      {[18, 26, 34].map((y) => (
        <g key={y}>
          <circle cx="82" cy={y} r="2.4" fill={`url(#${id}-gold)`} />
          <circle cx="118" cy={y} r="2.4" fill={`url(#${id}-gold)`} />
        </g>
      ))}
      {/* Frets */}
      {[52, 70, 88, 106, 124, 142, 160].map((y) => (
        <line key={y} x1="92" y1={y} x2="108" y2={y} stroke="rgba(232,205,111,0.45)" strokeWidth="1" />
      ))}

      {/* Body */}
      <path
        d="M100,176
           C138,176 154,196 154,224
           C154,250 140,260 140,284
           C140,312 166,326 166,370
           C166,418 138,458 100,458
           C62,458 34,418 34,370
           C34,326 60,312 60,284
           C60,260 46,250 46,224
           C46,196 62,176 100,176 Z"
        fill={`url(#${id}-wood)`}
        stroke={`url(#${id}-gold)`}
        strokeWidth="1.5"
      />
      {/* Top sheen */}
      <path
        d="M100,176
           C138,176 154,196 154,224
           C154,250 140,260 140,284
           C140,312 166,326 166,370
           C166,418 138,458 100,458
           C62,458 34,418 34,370
           C34,326 60,312 60,284
           C60,260 46,250 46,224
           C46,196 62,176 100,176 Z"
        fill={`url(#${id}-sheen)`}
      />

      {/* Rosette + soundhole */}
      <circle cx="100" cy="252" r="27" fill="#120d08" />
      <circle cx="100" cy="252" r="27" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2" />
      <circle cx="100" cy="252" r="32" fill="none" stroke="rgba(232,205,111,0.35)" strokeWidth="1.2" />

      {/* Bridge */}
      <rect x="74" y="366" width="52" height="10" rx="2" fill="#1a120a" stroke="rgba(201,162,39,0.55)" strokeWidth="1" />

      {/* Strings */}
      {[94, 96.4, 98.8, 101.2, 103.6, 106].map((x) => (
        <line
          key={x}
          x1={x}
          y1="22"
          x2={x}
          y2="370"
          stroke="rgba(242,234,217,0.4)"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
