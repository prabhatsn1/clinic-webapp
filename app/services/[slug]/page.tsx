import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { getServiceBySlug, getServices, getDoctors } from "@/lib/mockContent";
import { Badge, Card, StarRating } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.short_description,
  };
}

const iconMap: Record<string, string> = {
  stethoscope: "🩺",
  heart: "❤️",
  sparkles: "✨",
  baby: "👶",
  bone: "🦴",
  brain: "🧠",
  scan: "🔬",
  flower: "🌸",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedDoctors = getDoctors().filter((d) =>
    d.services.includes(service.slug),
  );

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-brand-900 to-brand-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-100/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-700 text-3xl flex items-center justify-center shrink-0">
              {iconMap[service.icon] ?? "🏥"}
            </div>
            <div>
              <Badge variant="accent" className="mb-2">
                {service.category}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-2">
                {service.title}
              </h1>
              <div className="flex items-center gap-4 text-brand-100/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {service.duration_minutes} min
                </span>
                <span className="text-white font-semibold text-lg">
                  {formatCurrency(service.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About this service
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                What&apos;s included
              </h3>
              <ul className="space-y-3">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctors for this service */}
            {relatedDoctors.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Specialists
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDoctors.map((doc) => (
                    <Link key={doc.id} href={`/doctors/${doc.id}`}>
                      <Card className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-100 overflow-hidden shrink-0">
                          <Image
                            src={doc.photo_url}
                            alt={doc.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doc.specialty}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <StarRating rating={doc.rating} size="sm" />
                            <span className="text-xs text-slate-400">
                              ({doc.reviews_count})
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Book this service
              </h3>
              <div className="space-y-3 mb-6 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-semibold">
                    {service.duration_minutes} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Self-pay price</span>
                  <span className="font-semibold text-brand-600">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-semibold">{service.category}</span>
                </div>
              </div>
              <Link
                href={`/appointments?serviceId=${service.id}`}
                className="block w-full text-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
              >
                Book Appointment <ArrowRight className="inline w-4 h-4 ml-1" />
              </Link>
              <p className="text-xs text-center text-slate-400 mt-3">
                No referral needed for most services
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
