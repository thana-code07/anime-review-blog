export function SocialShareButton({ label, className, href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex size-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </a>
  );
}
