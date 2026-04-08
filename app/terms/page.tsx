import { Metadata } from "next";
import { getClinic } from "@/lib/mockContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing your use of the MedVita Clinic website and services.",
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

export default function TermsPage() {
  const clinic = getClinic();

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-slate-400 mb-2">
          Last updated: January 1, 2025
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-10">
          Terms of Service
        </h1>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the {clinic.name} website (the "Site") or
            booking an appointment, you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree, please do not use the Site.
          </p>
        </Section>

        <Section title="2. Not a Substitute for Medical Advice">
          <p>
            Content on this Site is provided for general informational purposes
            only and does <strong>not</strong> constitute medical advice,
            diagnosis, or treatment. Always seek the guidance of a qualified
            healthcare professional with questions regarding a medical
            condition.
          </p>
          <p className="mt-3">
            In a medical emergency, call <strong>911</strong> or go to the
            nearest emergency room immediately.
          </p>
        </Section>

        <Section title="3. Appointment Booking">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Appointment requests submitted through the Site are subject to
              availability and confirmation by our scheduling team.
            </li>
            <li>
              A booking confirmation does not constitute a binding contract
              until confirmed by {clinic.name} staff.
            </li>
            <li>
              Please cancel or reschedule at least <strong>24 hours</strong> in
              advance to avoid a late-cancellation fee.
            </li>
            <li>
              Repeated no-shows may result in suspension of online booking
              privileges.
            </li>
          </ul>
        </Section>

        <Section title="4. User Responsibilities">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              Provide false or misleading information when booking appointments.
            </li>
            <li>Use the Site for any unlawful purpose.</li>
            <li>
              Attempt to gain unauthorised access to any part of the Site or its
              servers.
            </li>
            <li>
              Scrape, crawl, or harvest data from the Site without written
              permission.
            </li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All content on this Site—including text, images, logos, and
            software—is owned by or licensed to {clinic.name} and is protected
            by copyright and trademark law. You may not reproduce, distribute,
            or create derivative works without prior written consent.
          </p>
        </Section>

        <Section title="6. Third-Party Links">
          <p>
            The Site may contain links to third-party websites. {clinic.name} is
            not responsible for the content, privacy practices, or availability
            of third-party sites.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The Site is provided on an "as is" and "as available" basis without
            warranties of any kind, express or implied, including fitness for a
            particular purpose or non-infringement.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, {clinic.name} shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising out of your use of the Site or reliance on its
            content.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These Terms are governed by the laws of the State of California,
            without regard to its conflict-of-law provisions. Any disputes shall
            be resolved in the courts of San Francisco County, California.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>
            We may revise these Terms at any time. Continued use of the Site
            after changes constitutes acceptance of the updated Terms. We
            encourage you to review this page periodically.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For questions about these Terms, email{" "}
            <a
              href={`mailto:${clinic.email}`}
              className="text-brand-600 hover:underline"
            >
              {clinic.email}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${clinic.phone}`}
              className="text-brand-600 hover:underline"
            >
              {clinic.phone}
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
