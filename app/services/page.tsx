import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getServices } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our comprehensive medical services — from primary care to advanced specialty medicine.",
};

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

export default function ServicesPage() {
  const services = getServices();
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">
            All Services
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Our Medical Services</h1>
          <p className="text-xl text-brand-100/75 max-w-2xl mx-auto">
            Comprehensive care spanning eight specialties — all under one roof
            with transparent, upfront pricing.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                {category}
                <span className="h-px flex-1 bg-border" />
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter((s) => s.category === category)
                .map((service, i) => (
                  <ScrollReveal key={service.id} delay={i * 0.08}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="block h-full"
                    >
                      <Card className="h-full flex flex-col group">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-brand-100 text-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition-colors">
                            {iconMap[service.icon] ?? "🏥"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {service.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              {service.duration_minutes} min
                              <span>•</span>
                              <span className="text-brand-600 font-semibold">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 flex-1 mb-4">
                          {service.short_description}
                        </p>
                        <ul className="space-y-1 mb-4">
                          {service.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-center gap-2 text-xs text-slate-600"
                            >
                              <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-1 text-brand-600 text-sm font-semibold group-hover:gap-2 transition-all mt-auto">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </div>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Not sure which service you need?
          </h2>
          <p className="text-slate-500 mb-8">
            Start with a General Medicine consultation. Our internists will
            guide you to the right specialist.
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            Book a Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
