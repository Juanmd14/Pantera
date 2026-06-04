type Props = { size?: number; className?: string };

export default function PawIcon({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <ellipse cx="12" cy="15.5" rx="4.6" ry="3.6" />
      <ellipse cx="5.5" cy="9" rx="1.9" ry="2.6" transform="rotate(-18 5.5 9)" />
      <ellipse cx="9.4" cy="5.4" rx="1.7" ry="2.4" />
      <ellipse cx="14.6" cy="5.4" rx="1.7" ry="2.4" />
      <ellipse cx="18.5" cy="9" rx="1.9" ry="2.6" transform="rotate(18 18.5 9)" />
    </svg>
  );
}
