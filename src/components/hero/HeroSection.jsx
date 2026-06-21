import { HERO_IMAGE_URL } from "../../constants/assets";
import { HERO_CONTENT } from "../../constants/design";

export function HeroSection() {
  const { mottoLines, subtext, authorLabel, authorName, authorBio } =
    HERO_CONTENT;

  return (
    <section className="w-full bg-brown-100" aria-label="Featured article">
      <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-10 px-4 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-[120px] lg:py-16 xl:gap-16">
        <div className="flex flex-1 flex-col justify-center items-center text-left lg:items-end lg:text-right">
          <h1 className="font-poppins text-[36px] font-bold leading-[1.1] tracking-tight text-brown-900 sm:text-[40px] lg:text-[44px] xl:text-[52px]">
            {mottoLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-brown-600 sm:text-base lg:mt-6">
            {subtext}
          </p>
        </div>

        <div className="flex shrink-0 justify-center lg:w-[280px] xl:w-[320px]">
          <div className="w-full max-w-[280px] overflow-hidden rounded-3xl sm:max-w-[320px]">
            <img
              src={HERO_IMAGE_URL}
              alt="A man with a cat on his shoulder in an autumn forest with snow on the ground"
              className="aspect-[3/4] w-full object-cover object-[center_30%]"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="text-sm text-brown-400">{authorLabel}</p>
          <h2 className="mt-1 font-poppins text-2xl font-bold text-brown-900 sm:text-[28px]">
            {authorName}
          </h2>
          <div className="mt-4 space-y-4">
            {authorBio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-sm leading-relaxed text-brown-600 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
