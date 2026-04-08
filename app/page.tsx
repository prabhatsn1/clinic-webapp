import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import {
  getHero,
  getClinic,
  getServices,
  getDoctors,
  getTestimonials,
  getAbout,
} from "@/lib/mockContent";
import HeroSection from "@/components/home/HeroSection";
import { ScrollReveal, ParallaxBlock } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, StarRating, Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  const hero = getHero();
  const clinic = getClinic();
  const services = getServices().slice(0, 6);
  const doctors = getDoctors().slice(0, 4);
  const testimonials = getTestimonials().slice(0, 3);
  const about = getAbout();

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <HeroSection hero={hero} stats={clinic.stats} />

      {/* ─── Certifications bar ────────────────────────────────────── */}
      <section
        className="bg-white border-b border-border py-4"
        aria-label="Certifications"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {clinic.certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ──────────────────────────────────────────────── */}
      <section className="py-24 bg-surface" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Our Services"
              title="Comprehensive Care Under One Roof"
              description="From primary care to advanced specialty medicine — all in one location, with transparent pricing."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="block h-full"
                >
                  <Card className="h-full flex flex-col group">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <span className="text-xl" aria-hidden="true">
                        {iconMap[service.icon] ?? "🏥"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 flex-1 mb-4">
                      {service.short_description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <span className="font-semibold text-brand-600">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all"
              >
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── About / Mission ───────────────────────────────────────── */}
      <section
        className="py-24 bg-brand-900 overflow-hidden"
        aria-labelledby="about-home-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Our Mission
              </Badge>
              <h2
                id="about-home-heading"
                className="text-4xl font-bold text-white mb-6 leading-tight"
              >
                {about.headline}
              </h2>
              <p className="text-brand-100/70 text-lg mb-8 leading-relaxed">
                {about.mission}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {about.values.slice(0, 4).map((val) => (
                  <div key={val.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center shrink-0">
                      <span className="text-sm" aria-hidden="true">
                        {iconMap[val.icon] ?? "✦"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {val.title}
                      </p>
                      <p className="text-brand-100/60 text-xs mt-0.5">
                        {val.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
              >
                Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            {/* Timeline */}
            <ParallaxBlock speed={0.1}>
              <div className="relative pl-6 border-l-2 border-brand-700 space-y-8">
                {about.timeline.map((item, i) => (
                  <ScrollReveal key={item.year} delay={i * 0.1}>
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 rounded-full bg-brand-500 border-4 border-brand-900" />
                      <p className="text-accent-400 font-bold text-sm mb-1">
                        {item.year}
                      </p>
                      <p className="text-brand-100/80 text-sm">{item.event}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ParallaxBlock>
          </div>
        </div>
      </section>

      {/* ─── Doctors ───────────────────────────────────────────────── */}
      <section
        className="py-24 bg-white"
        aria-labelledby="doctors-home-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Our Specialists"
              title="Meet the Doctors"
              description="Board-certified specialists combining deep expertise with genuine care for every patient."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, i) => (
              <ScrollReveal key={doc.id} delay={i * 0.1}>
                <Link href={`/doctors/${doc.id}`} className="block">
                  <Card className="text-center group">
                    <div className="w-20 h-20 rounded-full bg-brand-100 mx-auto mb-4 overflow-hidden">
                      <Image
                        src={doc.photo_url}
                        alt={`Photo of ${doc.name}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-0.5">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      {doc.specialty}
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                      <StarRating rating={doc.rating} size="sm" />
                      <span className="text-xs text-slate-500">
                        ({doc.reviews_count})
                      </span>
                    </div>
                    {doc.accepting_new_patients && (
                      <span className="mt-3 inline-block text-xs text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                        Accepting patients
                      </span>
                    )}
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-10">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all"
              >
                Meet all doctors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────────── */}
      <section
        className="py-24 bg-surface"
        aria-labelledby="testimonials-home-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Patient Stories"
              title="What Our Patients Say"
              description="Real stories from real patients. We are proud of the difference we make every day."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1}>
                <Card className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.location}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={t.rating} size="sm" />
                    </div>
                  </div>
                  <blockquote className="text-sm text-slate-600 italic flex-1 leading-relaxed">
                    &ldquo;{t.body}&rdquo;
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Badge variant="neutral">{t.service}</Badge>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-8">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all"
              >
                Read more stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-600" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
              Ready to take charge of your health?
            </h2>
            <p className="text-brand-100/80 text-lg mb-8">
              Book an appointment online in under 2 minutes. Same-week slots
              available.
            </p>
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-brand-700 font-bold rounded-2xl text-lg hover:bg-brand-50 transition-colors shadow-lg"
            >
              Book Your Appointment <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
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
  home: "🏠",
  activity: "📊",
  shield: "🛡️",
  star: "⭐",
  users: "👥",
};
