export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="13" fill="none" stroke="#57DFFF" strokeWidth="1.6" strokeDasharray="4 2.2" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="#E8EDF2" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="3.2" fill="#57DFFF" />
      <path d="M16 3v4M16 25v4M3 16h4M25 16h4" stroke="#C7353D" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}
