"use client";

import { useEffect, useState } from "react";

import { AsyncErrorAlert, EmptyState } from "@/components/common/AsyncState";
import GlitchBar from "@/components/common/GlitchBar";
import { getFaqs } from "@/services/faq.service";
import type { Faq } from "@/types/faq";
import { getErrorMessage } from "@/utils/error";

export function FAQPageClient() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFaqs = () => {
    void getFaqs()
      .then(setFaqs)
      .catch((loadError: unknown) => {
        setError(getErrorMessage(loadError, "Unable to load FAQs. Please try again."));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const retryFaqs = () => {
    setLoading(true);
    setError(null);
    loadFaqs();
  };

  return (
    <div className="container-editorial relative pb-32 pt-10 md:pt-20">
      <GlitchBar
        seed={29}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={70}
        className="absolute left-0 top-20 bottom-32 hidden w-1 md:block"
      />
      <h1 className="display uppercase text-[13vw] leading-[0.9] md:text-[9vw]">FAQ</h1>
      <p className="headline mt-6 max-w-2xl text-muted-foreground">
        Everything you might want to know before you arrive. If we&apos;ve missed something, write
        to us.
      </p>

      {loading ? (
        <p className="headline mt-12 text-sm text-muted-foreground md:mt-16">Loading FAQs…</p>
      ) : error ? (
        <AsyncErrorAlert
          title="FAQs are unavailable"
          error={error}
          onRetry={retryFaqs}
          className="mt-12 md:mt-16"
        />
      ) : faqs.length === 0 ? (
        <EmptyState message="No FAQs are available yet" />
      ) : (
        <ul className="mt-12 rule-t md:mt-16">
          {faqs.map((faq) => (
            <li key={faq.id} className="grid grid-cols-12 gap-4 rule-b py-6 md:gap-8 md:py-8">
              <p className="display col-span-12 text-xl leading-[1] tracking-[-0.02em] uppercase md:col-span-5 md:text-3xl">
                {faq.question}
              </p>
              <p className="headline col-span-12 max-w-prose whitespace-pre-line text-base leading-relaxed text-muted-foreground md:col-span-7 md:text-lg">
                {faq.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
