import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Serendipity Arts Festival 2026" },
      { name: "description", content: "Privacy Notice & Digital Personal Data Protection (DPDP) Statement for the Serendipity Arts Festival." },
    ],
  }),
  component: Privacy,
});

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rule-t pt-8 md:pt-10">
      <p className="label text-muted-foreground">Section {n}</p>
      <h2 className="mt-2 display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">{title}</h2>
      <div className="mt-5 space-y-4 max-w-prose text-base md:text-lg leading-relaxed headline text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Privacy</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground headline">
        Privacy Notice &amp; Digital Personal Data Protection (DPDP) Statement.
        This page maintained by Serendipity Arts.
      </p>

      <div className="mt-12 md:mt-16 space-y-12 md:space-y-16">
        <Section n="1" title="Who we are">
          <p>
            Serendipity Arts (“we”, “us”, “our”) operates the Serendipity Arts Festival
            and related programmes. We are the Data Fiduciary for the personal data collected through
            this website and Festival operations, and we are committed to protecting your privacy in
            accordance with the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and applicable
            Indian law.
          </p>
        </Section>

        <Section n="2" title="What personal data we collect">
          <p>
            When you register, book a programme, subscribe to our newsletter, apply for a grant or
            contact us, we may collect: your name, email address, phone/WhatsApp number, city and
            country, age group, gender (where you choose to share it), your interests, and, for
            paid bookings, payment information processed by our payment partners.
          </p>
          <p>
            We also collect standard technical data — device type, browser, IP address and pages
            visited — through cookies and similar technologies, to keep the site secure and improve
            it.
          </p>
        </Section>

        <Section n="3" title="Why we use it">
          <p>
            Your data is used to: create and manage your Art Pass and bookings; send you Festival
            information you have signed up for; process payments and issue tickets; respond to your
            queries; run analytics to improve the site and programming; and comply with legal and
            regulatory obligations.
          </p>
          <p>
            We only process your data for the purposes for which it was collected, and we do not
            sell your data to third parties.
          </p>
        </Section>

        <Section n="4" title="Consent">
          <p>
            We ask for your consent before collecting or using your personal data. You may withdraw
            consent at any time by writing to <span className="text-foreground">info@serendipityarts.org</span>.
            Withdrawing consent will not affect the lawfulness of processing done before your
            withdrawal.
          </p>
        </Section>

        <Section n="5" title="Sharing & data processors">
          <p>
            We share limited personal data with trusted service providers who help us run the
            Festival — including ticketing, payment gateways, email service providers, cloud hosting
            and analytics. These processors are bound by contractual obligations to keep your data
            confidential and to process it only on our instructions.
          </p>
          <p>
            We may disclose personal data where required by law, court order or to protect the
            safety of our attendees, artists and staff.
          </p>
        </Section>

        <Section n="6" title="Retention">
          <p>
            We retain your personal data only as long as needed for the purpose it was collected —
            for example, booking records are retained for the duration of the Festival cycle and
            for accounting and audit obligations thereafter. When no longer required, data is
            securely deleted or anonymised.
          </p>
        </Section>

        <Section n="7" title="Your rights">
          <p>Under the DPDP Act you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request erasure of your data where legally permissible.</li>
            <li>Nominate another person to exercise these rights in the event of your death or incapacity.</li>
            <li>Withdraw your consent and raise grievances.</li>
          </ul>
          <p>
            To exercise any of these rights, write to <span className="text-foreground">info@serendipityarts.org</span>.
            We will respond within the timelines set out by law.
          </p>
        </Section>

        <Section n="8" title="Security">
          <p>
            We use industry-standard technical and organisational safeguards — encryption in transit,
            access controls, and staff training — to protect your personal data. No system is entirely
            secure, but we take every reasonable step to keep your information safe.
          </p>
        </Section>

        <Section n="9" title="Grievance officer">
          <p>
            If you have a concern about how your personal data is handled, you can contact our
            Grievance Officer:
          </p>
          <p className="text-foreground">
            Grievance Officer, Serendipity Arts<br />
            Email: ritik@serendipityarts.org
          </p>
          <p>
            You may also register a complaint with the Data Protection Board of India if you believe
            your rights have been infringed.
          </p>
        </Section>

        <Section n="10" title="Updates to this notice">
          <p>
            We may update this Privacy Notice from time to time. The most current version will always
            be available on this page, with the date of the last update noted below.
          </p>
          <p className="text-foreground">Last updated: July 2026.</p>
        </Section>
      </div>
    </div>
  );
}
