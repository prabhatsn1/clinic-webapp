import { Metadata } from "next";
import { getClinic } from "@/lib/mockContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How MedVita Clinic collects, uses, and protects your personal health information.",
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

export default function PrivacyPage() {
  const clinic = getClinic();

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-slate-400 mb-2">
          Last updated: January 1, 2025
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-10">
          Privacy Policy
        </h1>

        <Section title="1. Who We Are">
          <p>
            {clinic.name} ("{clinic.name}", "we", "us", or "our") operates the
            website medvita.com. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our
            website or use our services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We may collect the following categories of information:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Appointment data</strong>: name, email address, phone
              number, date of birth, reason for visit, and the doctor or service
              you select.
            </li>
            <li>
              <strong>Contact form data</strong>: name, email address, and the
              content of your message.
            </li>
            <li>
              <strong>Usage data</strong>: IP address, browser type, pages
              visited, and referring URLs (collected automatically via server
              logs and analytics).
            </li>
          </ul>
          <p className="mt-4">
            We do not collect payment card data directly. All payments are
            processed by PCI-DSS– compliant third-party processors.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>To schedule and manage your appointments.</li>
            <li>
              To communicate appointment confirmations, reminders, and
              follow-ups.
            </li>
            <li>To respond to your enquiries via the contact form.</li>
            <li>
              To improve our website and services through aggregated analytics.
            </li>
            <li>
              To comply with applicable legal and regulatory obligations,
              including HIPAA.
            </li>
          </ul>
        </Section>

        <Section title="4. HIPAA Compliance">
          <p>
            As a covered healthcare entity, {clinic.name} complies with the
            Health Insurance Portability and Accountability Act (HIPAA).
            Protected Health Information (PHI) is handled according to our
            Notice of Privacy Practices, which is available at the front desk
            and on request.
          </p>
        </Section>

        <Section title="5. How We Share Your Information">
          <p>We do not sell your personal information. We may share it with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Service providers</strong> acting on our behalf (e.g.,
              appointment scheduling software, email delivery) under
              data-processing agreements.
            </li>
            <li>
              <strong>Healthcare providers</strong> involved in your care, as
              permitted by HIPAA.
            </li>
            <li>
              <strong>Law enforcement or regulators</strong> when required by
              law.
            </li>
          </ul>
        </Section>

        <Section title="6. Cookies & Tracking">
          <p>
            We use essential cookies to operate the site and, with your consent,
            analytics cookies to understand traffic patterns. You can manage
            cookie preferences in your browser settings.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain appointment and health records for a minimum of 7 years in
            accordance with California state law and HIPAA requirements, or
            longer if required by specific medical regulations.
          </p>
        </Section>

        <Section title="8. Your Rights (CCPA / California Residents)">
          <p>California residents have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              Know what personal information we collect and how it is used.
            </li>
            <li>
              Request deletion of personal information not needed for ongoing
              care.
            </li>
            <li>
              Opt out of the sale of personal information (we do not sell your
              data).
            </li>
            <li>Non-discrimination for exercising these rights.</li>
          </ul>
          <p className="mt-4">
            To submit a request, email us at{" "}
            <a
              href={`mailto:${clinic.email}`}
              className="text-brand-600 hover:underline"
            >
              {clinic.email}
            </a>
            .
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We implement administrative, technical, and physical
            safeguards—including TLS encryption, access controls, and regular
            security audits—to protect your information. No system is 100%
            secure; please contact us immediately if you suspect a breach.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            For privacy-related questions or requests, contact our Privacy
            Officer at{" "}
            <a
              href={`mailto:${clinic.email}`}
              className="text-brand-600 hover:underline"
            >
              {clinic.email}
            </a>{" "}
            or write to us at {clinic.address.street}, {clinic.address.city},{" "}
            {clinic.address.state} {clinic.address.zip}.
          </p>
        </Section>
      </div>
    </main>
  );
}
