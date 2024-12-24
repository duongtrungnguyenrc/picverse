import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { Button } from "../shadcn";

type HeroProps = {};

const Hero: FC<HeroProps> = ({}) => {
  return (
    <section className="relative before:absolute before:inset-0 before:pointer-events-none before:-z-10 before:bg-gray-100 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gray-900/10 after:to-transparent z-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(145deg,var(--tw-gradient-stops))] from-violet-500/25 to-gray-200/0 to-50% pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/icons/hero-left-gradient-bg.svg"
          alt="Gradient background"
          className="absolute -top-[200px] left-0 -translate-x-full -ml-[520px]"
          layout="fill"
        />
      </div>

      <div className="container mx-auto">
        <div className="relative pt-28 md:pt-36 pb-12 md:pb-16 p-5 lg:px-0">
          <div className="max-w-[620px] flex flex-col">
            <h1 className="h1 mb-5 max-w-full text-wrap">Tailwind CSS templates for your next project</h1>
            <p className="text-lg text-gray-500">
              Landing pages, websites, and dashboards built on top of
              <strong className="font-normal text-gray-900 whitespace-nowrap">Tailwind CSS</strong>
              and fully coded in
              <strong className="font-normal text-gray-900">HTML</strong>,
              <strong className="font-normal text-gray-900">React</strong>,
              <strong className="font-normal text-gray-900">Next.js</strong>, and{" "}
              <strong className="font-normal text-gray-900">Vue</strong>. A great starting point for your next project,
              saving you weeks of development time.
            </p>
            <div className="-order-1">
              <div className="inline-flex mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 p-1 pr-3 rounded-full bg-white bg-opacity-80 shadow backdrop-blur">
                  <div className="flex -space-x-2 -ml-0.5">
                    <img
                      decoding="async"
                      fetchPriority="high"
                      className="rounded-full border-2 border-white box-content"
                      src="https://cruip.com/wp-content/themes/cruip-2/dist/images/dev-01.jpg"
                      width="20"
                      height="20"
                      alt="Alessio Santo"
                    />
                    <img
                      decoding="async"
                      fetchPriority="high"
                      className="rounded-full border-2 border-white box-content"
                      src="https://cruip.com/wp-content/themes/cruip-2/dist/images/dev-02.jpg"
                      width="20"
                      height="20"
                      alt="Arnob Dada"
                    />
                    <img
                      decoding="async"
                      fetchPriority="high"
                      className="rounded-full border-2 border-white box-content"
                      src="https://cruip.com/wp-content/themes/cruip-2/dist/images/dev-03.jpg"
                      width="20"
                      height="20"
                      alt="Ryan Chew"
                    />
                    <img
                      decoding="async"
                      fetchPriority="high"
                      className="rounded-full border-2 border-white box-content"
                      src="https://cruip.com/wp-content/themes/cruip-2/dist/images/dev-04.jpg"
                      width="20"
                      height="20"
                      alt="Adrian"
                    />
                  </div>
                  <span>
                    Trusted by
                    <strong className="font-normal text-gray-900">60K+</strong>
                    developers.
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link
                className="btn text-gray-50 bg-gray-800 hover:bg-gray-900 group shadow-[0px_12px_12px_-6px_rgba(3,7,18,.20)]"
                href="#gallery"
              >
                <Button>
                  <span>Get Unlimited Access</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-[520px] pointer-events-none -z-10" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="1132" height="641" fill="none">
              <g filter="url(#sh2a)" opacity=".48">
                <circle cx="566" cy="540" r="246" fill="#7E5FFB"></circle>
              </g>
              <defs>
                <filter
                  id="sh2a"
                  width="1132"
                  height="1132"
                  x="0"
                  y="-26"
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feGaussianBlur result="effect1_foregroundBlur_2010_54" stdDeviation="160"></feGaussianBlur>
                </filter>
              </defs>
            </svg>
          </div>
          <div className="hidden sm:block absolute left-[600px] -top-[196px] -rotate-[16deg] pointer-events-none -z-10">
            <picture>
              <source
                type="image/webp"
                srcSet="https://cruip.com/wp-content/themes/cruip-2/dist/images/hero-illustration.webp"
              />
              <img
                decoding="async"
                fetchPriority="high"
                className="max-w-none"
                src="https://cruip.com/wp-content/themes/cruip-2/dist/images/hero-illustration.png"
                width="1051"
                height="740"
                alt="Preview of some Tailwind templates"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
