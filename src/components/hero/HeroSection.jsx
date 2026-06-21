import heroImage from "../../assets/hero-section-picture.jpg";

export function HeroSection() {
  return (
    <section className="w-full bg-brown-100" aria-label="Featured article">
      <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-10 px-4 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-[120px] lg:py-16 xl:gap-16">
        <div className="flex flex-1 flex-col justify-center items-center text-left lg:items-end lg:text-right">
          <h1 className="font-poppins text-[36px] font-bold leading-[1.1] tracking-tight text-brown-900 sm:text-[40px] lg:text-[44px] xl:text-[52px]">
            Anime <br className="hidden lg:block" />
            Is Good, <br />
            Anime Is Life,
          </h1>
          <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-brown-600 sm:text-base lg:mt-6">
            Honest anime reviews, curated recommendations, and seasonal
            breakdowns—all in one place. Stop wasting time wondering what to
            watch next; let us find your next 10/10 masterpiece.
          </p>
        </div>

        <div className="flex shrink-0 justify-center lg:w-[280px] xl:w-[320px]">
          <div className="w-full max-w-[280px] overflow-hidden rounded-3xl sm:max-w-[320px]">
            <img
              src={heroImage}
              alt="Anime hero illustration"
              className="aspect-[3/4] w-full object-cover object-[center_30%]"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="text-sm text-brown-400">-Author</p>
          <h2 className="mt-1 font-poppins text-2xl font-bold text-brown-900 sm:text-[28px]">
            Best Thana.
          </h2>
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-relaxed text-brown-600 sm:text-base">
              When I have a free time, I like to watch anime and spend a lot of
              time wondering if this anime is good or not, That&apos;s why I
              created this website to help you find the best anime for you.
            </p>
            <p className="text-sm leading-relaxed text-brown-600 sm:text-base">
              I&apos;m currently learning to code and built websites, This is my
              first react project, I hope you like it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
