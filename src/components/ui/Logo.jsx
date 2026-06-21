export function Logo({ className = "" }) {
  return (
    <a
      href="#"
      className={`inline-flex shrink-0 font-poppins text-xl font-semibold leading-none text-brown-900 no-underline sm:text-2xl ${className}`}
      aria-label="Best Thana home"
    >
      Best Thana<span className="text-green-500">.</span>
    </a>
  );
}
