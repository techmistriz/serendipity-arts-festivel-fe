"use client";

import { useState } from "react";
import Image from "next/image";

import { homeImages } from "@/config/images";
import { resolveCdnMediaUrl } from "@/utils/media";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { useTestimonials } from "@/hooks/useTestimonials";

export function TestimonialsSection() {
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const { testimonials, loading, error } = useTestimonials(8);

  const testimonial = testimonials[testimonialIndex];
  const testimonialImage = resolveCdnMediaUrl(testimonial?.image, "testimonials");

  const previousTestimonial = () => {
    setTestimonialIndex(
      (currentIndex) => (currentIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  const nextTestimonial = () => {
    setTestimonialIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
  };

  return (
    <section className="container-editorial mt-20 md:mt-32">
      <HomeSectionHeader title="Testimonials">
        <HomePromoPanel image={homeImages.testimonialsBox}>
          <p className="notch text-xl leading-[1] font-semibold tracking-[-0.01em] text-white uppercase md:text-2xl">
            The first hand experience
          </p>

          <p className="headline mt-2 max-w-lg text-xs text-white/85 md:text-sm">
            An actual account from festival goers, in their own words.
          </p>

          <button
            type="button"
            onClick={() => setIsFilmOpen((isOpen) => !isOpen)}
            className="label notch mt-4 border border-white px-4 py-2.5 text-white transition-colors hover:bg-white hover:text-foreground"
          >
            {isFilmOpen ? "Hide the film" : "Watch the film →"}
          </button>
        </HomePromoPanel>
      </HomeSectionHeader>

      {/* Film */}
      {isFilmOpen && (
        <div className="mb-10 border border-foreground md:mb-14">
          <div className="relative aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/xkVJHeiZL64?autoplay=1"
              title="Serendipity Arts Festival: a first hand experience"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="border border-foreground p-5 md:p-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <div className="aspect-square w-32 animate-pulse bg-muted md:w-full md:max-w-[220px]" />

              <div className="mt-3 h-5 w-3/4 animate-pulse bg-muted" />

              <div className="mt-2 h-3 w-1/2 animate-pulse bg-muted" />
            </div>

            <div className="md:col-span-9">
              <div className="h-24 w-full animate-pulse bg-muted" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="border border-foreground p-5 md:p-10">
          <p className="headline text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && testimonials.length === 0 && (
        <div className="border border-foreground p-5 md:p-10">
          <p className="headline text-sm text-muted-foreground">No testimonials available.</p>
        </div>
      )}

      {/* Testimonial */}
      {!loading && !error && testimonial && (
        <div className="border border-foreground p-5 md:p-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
            {/* Person */}
            <div className="md:col-span-3">
              {testimonialImage ? (
                <Image
                  src={testimonialImage}
                  alt={testimonial.name}
                  width={220}
                  height={220}
                  sizes="(max-width: 768px) 128px, 220px"
                  className="aspect-square w-32 border border-foreground object-cover md:w-full md:max-w-[220px]"
                />
              ) : (
                <div className="display grid aspect-square w-32 place-items-center border border-foreground text-3xl md:w-full md:max-w-[220px]">
                  {testimonial.name.charAt(0)}
                </div>
              )}

              <p className="headline mt-3 text-lg leading-tight font-semibold md:text-xl">
                {testimonial.name}
              </p>

              <p className="headline text-xs text-muted-foreground md:text-sm">
                {testimonial.designation}
              </p>

              {testimonial.company_name && (
                <p className="headline text-xs text-muted-foreground md:text-sm">
                  {testimonial.company_name}
                </p>
              )}
            </div>

            {/* Quote */}
            <blockquote className="headline text-base leading-[1.35] md:col-span-9 md:text-2xl">
              &ldquo;{testimonial.description}&rdquo;
            </blockquote>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={previousTestimonial}
                className="label border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={nextTestimonial}
                className="label border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
              >
                →
              </button>

              <div className="flex items-center gap-3">
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show testimonial from ${item.name}`}
                    aria-pressed={index === testimonialIndex}
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full border border-foreground ${
                      index === testimonialIndex ? "bg-foreground" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
