import { Metadata } from "next";
import { getClinic } from "@/lib/mockContent";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "MedVita Clinic is committed to making our website accessible to everyone, including people with disabilities.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function AccessibilityPage() {
  const clinic = getClinic();

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-slate-400 mb-2">
          Last updated: January 1, 2025
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-10">
          Accessibility Statement
        </h1>

        <p className="text-lg text-slate-600 mb-10">
          {clinic.name} is committed to ensuring digital accessibility for
          people with disabilities. We continually improve the user experience
          for everyone and apply relevant accessibility standards.
        </p>

        <Section title="Measures to Support Accessibility">
          <p>We take the following steps to ensure accessibility:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              Include accessibility as a requirement throughout our development
              process.
            </li>
            <li>
              Assign clear accessibility responsibilities to our development
              team.
            </li>
            <li>
              Test with assistive technologies including screen readers and
              keyboard navigation.
            </li>
            <li>
              Provide regular accessibility training for staff who manage web
              content.
            </li>
          </ul>
        </Section>

        <Section title="Conformance Status">
          <p>
            The Web Content Accessibility Guidelines (WCAG) define requirements
            for designers and developers to improve accessibility for people
            with disabilities. We aim to conform to{" "}
            <strong>WCAG 2.1 Level AA</strong>. Our current conformance status
            is:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Semantic HTML5 structure with proper heading hierarchy.</li>
            <li>
              All images include descriptive alt text or are marked decorative.
            </li>
            <li>
              Colour contrast ratios meet or exceed the 4.5:1 minimum for normal
              text.
            </li>
            <li>
              All interactive elements (buttons, links, form inputs) are
              keyboard-focusable.
            </li>
            <li>
              Focus indicators are visible and meet WCAG 2.4.11 (Non-Text
              Contrast).
            </li>
            <li>
              Reduced-motion: animations respect the{" "}
              <code>prefers-reduced-motion</code> media query.
            </li>
            <li>Forms are associated with clear, programmatic labels.</li>
            <li>
              ARIA landmarks identify page regions (header, main, nav, footer).
            </li>
          </ul>
        </Section>

        <Section title="Known Limitations">
          <p>
            We are aware of the following limitations and are actively working
            to address them:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              The 3D canvas on the home hero section does not convey information
              and is purely decorative; it is hidden from screen readers via{" "}
              <code>aria-hidden="true"</code>.
            </li>
            <li>
              The embedded Google Maps iframe may have limited screen-reader
              support. A text address alternative is always provided alongside
              the map.
            </li>
          </ul>
        </Section>

        <Section title="Feedback & Contact">
          <p>
            We welcome your feedback on the accessibility of this website. If
            you experience any barriers or have suggestions for improvement,
            please contact us:
          </p>
          <ul className="list-none mt-3 space-y-2">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${clinic.email}`}
                className="text-brand-600 hover:underline"
              >
                {clinic.email}
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${clinic.phone}`}
                className="text-brand-600 hover:underline"
              >
                {clinic.phone}
              </a>
            </li>
            <li>
              <strong>Address:</strong> {clinic.address.street},{" "}
              {clinic.address.city}, {clinic.address.state} {clinic.address.zip}
            </li>
          </ul>
          <p className="mt-4">
            We aim to respond to accessibility feedback within{" "}
            <strong>2 business days</strong>.
          </p>
        </Section>

        <Section title="Formal Complaints">
          <p>
            If you are not satisfied with our response, you may contact the{" "}
            <a
              href="https://www.ada.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              U.S. Department of Justice ADA Information Line
            </a>{" "}
            at 1-800-514-0301 (voice) or 1-800-514-0383 (TTY).
          </p>
        </Section>

        <Section title="Assessment Approach">
          <p>
            {clinic.name} assesses accessibility through self-evaluation and
            periodic audits using automated tools (Axe, Lighthouse) and manual
            testing with VoiceOver (macOS/iOS) and NVDA (Windows).
          </p>
        </Section>
      </div>
    </main>
  );
}
