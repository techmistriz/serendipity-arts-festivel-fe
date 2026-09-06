"use client";

import GlitchBar from "@/components/common/GlitchBar";
import { useFaqs } from "@/hooks/use-faqs";

export default function FaqPageClient() {
  const { faqs, loading, error } = useFaqs();

  return (
    <div className="container-editorial relative pb-32 pt-10 md:pt-20">
      <GlitchBar
        seed={29}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={70}
        className="absolute bottom-32 left-0 top-20 hidden w-1 md:block"
      />

      <h1 className="display uppercase text-[13vw] leading-[0.9] md:text-[9vw]">FAQ</h1>

      <p className="headline mt-6 max-w-2xl text-muted-foreground">
        Everything you might want to know before you arrive. If we’ve missed something, write to us.
      </p>

      {loading && (
        <div className="mt-12 md:mt-16">
          <p className="headline text-muted-foreground">Loading FAQs...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-12 md:mt-16">
          <p className="headline text-muted-foreground">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <ul className="rule-t mt-12 md:mt-16">
          {faqs.map((faq) => (
            <li key={faq.id} className="rule-b grid grid-cols-12 gap-4 py-6 md:gap-8 md:py-8">
              <p className="display col-span-12 text-xl uppercase leading-[1] tracking-[-0.02em] md:col-span-5 md:text-3xl">
                {faq.question}
              </p>

              <p className="headline col-span-12 max-w-prose text-base leading-relaxed text-muted-foreground md:col-span-7 md:text-lg">
                {faq.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
