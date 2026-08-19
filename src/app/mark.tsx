// Logomark: a speech bubble (the testimonial) holding a star (the rating).
// Shared by the marketing nav (client) and the footer (server).
export default function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5a623" />
          <stop offset="1" stopColor="#e8780c" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C8.27 2 2 7.6 2 14.5c0 3.93 2.03 7.43 5.2 9.72l-1.18 5.4c-.2.92.74 1.63 1.55 1.16l5.53-3.2c.94.18 1.9.27 2.9.27 7.73 0 14-5.6 14-12.5S23.73 2 16 2z"
        fill="url(#plg)"
      />
      <path
        d="M16 7.6l2.14 4.33 4.78.7-3.46 3.37.82 4.76L16 18.51l-4.28 2.25.82-4.76-3.46-3.37 4.78-.7z"
        fill="#fff"
      />
    </svg>
  );
}
