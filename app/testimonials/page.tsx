import type { Metadata } from "next";
import { getTestimonials } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Card, StarRating, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Patient Testimonials",
  description:
    "Read what MedVita Clinic patients say about their care experience.",
};

export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            Patient Stories
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Real Patients, Real Results
          </h1>
          <p className="text-xl text-brand-100/75">
            Every story is a reminder of why we do what we do.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.07}>
              <Card className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.location}</p>
                    </div>
                  </div>
                  <StarRating rating={t.rating} size="sm" />
                </div>
                <blockquote className="text-sm text-slate-600 italic flex-1 leading-relaxed mb-4">
                  &ldquo;{t.body}&rdquo;
                </blockquote>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Badge variant="neutral">{t.service}</Badge>
                  <span className="text-xs text-slate-400">
                    {formatDate(t.date)}
                  </span>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
