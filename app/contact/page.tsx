import type { Metadata } from "next";
import { getClinic } from "@/lib/mockContent";
import { Badge } from "@/components/ui";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MedVita Clinic — call, email, or visit us in San Francisco.",
};

export default function ContactPage() {
  const clinic = getClinic();

  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-brand-100/75">
            We&apos;re here to help — reach out any time.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Clinic Information
              </h2>
              <div className="space-y-4">
                <InfoItem
                  Icon={Phone}
                  label="Phone"
                  value={clinic.phone}
                  href={`tel:${clinic.phone}`}
                />
                <InfoItem
                  Icon={Mail}
                  label="Email"
                  value={clinic.email}
                  href={`mailto:${clinic.email}`}
                />
                <InfoItem
                  Icon={MapPin}
                  label="Address"
                  value={`${clinic.address.street}, ${clinic.address.city}, ${clinic.address.state} ${clinic.address.zip}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-slate-900">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {clinic.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600">{h.days}</span>
                    <span className="font-semibold text-slate-900">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-border h-64">
              <iframe
                src={clinic.mapEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MedVita Clinic location map"
                className="border-0"
              />
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Send a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand-600" />
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            className="text-slate-800 font-medium hover:text-brand-600 transition-colors text-sm"
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-800 font-medium text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}
