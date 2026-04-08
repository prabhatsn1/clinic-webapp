import type { Metadata } from "next";
import { getCareers } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Badge, Card } from "@/components/ui";
import { MapPin, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the MedVita Clinic team. View open positions in healthcare.",
};

export default function CareersPage() {
  const careers = getCareers();

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            Join Our Team
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Careers at MedVita</h1>
          <p className="text-xl text-brand-100/75 max-w-2xl mx-auto">
            We&apos;re building the future of patient-centered care. Come grow
            with us.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {careers.map((job, i) => (
            <ScrollReveal key={job.id} delay={i * 0.08}>
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <Badge
                        variant={
                          job.type.includes("Full") ? "brand" : "neutral"
                        }
                      >
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    Posted {formatDate(job.posted_at)}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4">{job.description}</p>
                <ul className="space-y-1 mb-6">
                  {job.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`mailto:careers@medvitaclinic.com?subject=Application: ${job.title}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
