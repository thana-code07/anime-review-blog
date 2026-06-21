import { logoImage } from "../../constants/assets";

export function Logo({ className = "" }) {
  return (
    <a
      href="#"
      className={`inline-flex shrink-0 no-underline ${className}`}
      aria-label="hh. home"
    >
      <img src={logoImage} alt="hh." className="h-7 w-auto sm:h-8" />
    </a>
  );
}
