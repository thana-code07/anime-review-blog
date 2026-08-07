import heroImage from "@/assets/hero-section-picture.jpg";
import { Button } from "@/components/ui/Button";
import { AUTHOR_BIO_PARAGRAPHS } from "@/lib/constants";

// full-bleed landing hero — brand, headline, CTA over edge-to-edge image
export function HeroSection() {
  return (
    <section
      className="relative min-h-[min(92svh,880px)] w-full overflow-hidden bg-brown-900"
      aria-label="Best Thana hero"
    >
      <img
        src={heroImage}
        alt=""
        className="hero-image-in absolute inset-0 size-full object-cover object-[center_28%]"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brown-900/88 via-brown-900/55 to-brown-900/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-brown-900/30"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[min(92svh,880px)] max-w-[1440px] flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:px-[120px] lg:pb-24 lg:pt-32">
        <div className="max-w-xl text-left">
          <p className="hero-rise font-poppins text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Best Thana<span className="text-green-500">.</span>
          </p>
          <h1 className="hero-rise hero-rise-delay-1 mt-4 font-poppins text-[2.25rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Anime Is Good,
            <br />
            Anime Is Life
          </h1>
          <p className="hero-rise hero-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-brown-200 sm:text-lg">
            Honest reviews and seasonal picks—so you spend less time wondering
            what to watch next.
          </p>
          <div className="hero-rise hero-rise-delay-3 mt-8">
            <Button
              variant="primary"
              className="bg-white px-8 text-brown-900 hover:bg-brown-100"
              asChild
            >
              <a href="#latest-articles">Browse articles</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// author story below the hero fold
export function AuthorIntroSection() {
  return (
    <section
      className="w-full border-b border-brown-300/60 bg-brown-100"
      aria-label="About the author"
    >
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16 lg:px-[120px] lg:py-20">
        <div>
          <p className="text-sm tracking-wide text-brown-500 uppercase">
            Author
          </p>
          <h2 className="mt-2 font-poppins text-3xl font-bold tracking-tight text-brown-900 sm:text-4xl">
            Best Thana<span className="text-green-500">.</span>
          </h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-brown-600 sm:text-lg">
          {AUTHOR_BIO_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
