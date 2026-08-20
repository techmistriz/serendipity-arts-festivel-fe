"use client";

import { useState } from "react";
import Image from "next/image";

import { homeImages } from "@/config/images";
import { TESTIMONIALS } from "@/data/testimonials";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";

export function TestimonialsSection() {
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonial = TESTIMONIALS[testimonialIndex];

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

      <div className="border border-foreground p-5 md:p-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            {testimonial.img ? (
              <Image
                src={testimonial.img}
                alt={testimonial.name}
                sizes="(max-width: 768px) 128px, 220px"
                className="aspect-square w-32 border border-foreground object-cover md:w-full md:max-w-[220px]"
              />
            ) : (
              <div className="display grid aspect-square w-32 place-items-center border border-foreground text-3xl md:w-full md:max-w-[220px]">
                {testimonial.initials}
              </div>
            )}
            <p className="headline mt-3 text-lg leading-tight font-semibold md:text-xl">
              {testimonial.name}
            </p>
            <p className="headline text-xs text-muted-foreground md:text-sm">{testimonial.role}</p>
          </div>
          <blockquote className="headline text-base leading-[1.35] md:col-span-9 md:text-2xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() =>
              setTestimonialIndex(
                (currentIndex) => (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
              )
            }
            className="label border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() =>
              setTestimonialIndex((currentIndex) => (currentIndex + 1) % TESTIMONIALS.length)
            }
            className="label border border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
          >
            →
          </button>
          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((item, index) => (
              <button
                key={item.name}
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
      </div>
    </section>
  );
}
