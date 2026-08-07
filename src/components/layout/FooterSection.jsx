import { Link } from "react-router-dom";
import { siGithub, siGoogle } from "simple-icons";

const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/",
    path: LINKEDIN_PATH,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    path: siGithub.path,
  },
  {
    label: "Google",
    href: "mailto:",
    path: siGoogle.path,
  },
];

function SocialIcon({ href, label, path }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full bg-brown-800 text-white transition-colors hover:bg-brown-900"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        className="size-4 fill-current"
        aria-hidden
      >
        <path d={path} />
      </svg>
    </a>
  );
}

// site footer with brand, links, and social icons
export function FooterSection() {
  return (
    <footer className="w-full border-t border-brown-300/70 bg-brown-200" aria-label="Site footer">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:px-[120px] lg:py-16">
        <div className="max-w-md">
          <Link
            to="/"
            className="font-poppins text-2xl font-semibold text-brown-900 no-underline"
          >
            Best Thana<span className="text-green-500">.</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-brown-600 sm:text-base">
            Honest anime reviews and seasonal picks—built for people who care
            what they watch next.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, path }) => (
              <SocialIcon key={label} href={href} label={label} path={path} />
            ))}
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-brown-800 underline underline-offset-4 transition-colors hover:text-brown-900 sm:text-base"
          >
            Back to home
          </Link>
        </div>
      </div>
    </footer>
  );
}
