import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Languages } from "lucide-react";
import { getDoctors } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card, StarRating } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Doctors",
  description: "Meet our board-certified specialists at MedVita Clinic.",
};

export default function DoctorsPage() {
  const doctors = getDoctors();
  const specialties = [...new Set(doctors.map((d) => d.specialty))];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">
            Our Team
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Meet Our Specialists</h1>
          <p className="text-xl text-brand-100/75 max-w-2xl mx-auto">
            Board-certified physicians who combine clinical excellence with
            genuine compassion for every patient in their care.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <ScrollReveal key={doc.id} delay={i * 0.07}>
              <Link href={`/doctors/${doc.id}`} className="block h-full">
                <Card className="h-full flex flex-col text-center group">
                  {/* Photo */}
                  <div className="w-24 h-24 rounded-full bg-brand-100 mx-auto mb-4 overflow-hidden ring-2 ring-transparent group-hover:ring-brand-300 transition-all">
                    <Image
                      src={doc.photo_url}
                      alt={`Photo of ${doc.name}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="font-bold text-slate-900 mb-0.5">
                    {doc.name}
                  </h2>
                  <p className="text-xs text-brand-600 font-semibold mb-1">
                    {doc.title}
                  </p>
                  <p className="text-sm text-slate-500 mb-3">{doc.specialty}</p>

                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <StarRating rating={doc.rating} size="sm" />
                    <span className="text-xs text-slate-500">
                      ({doc.reviews_count})
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-3">
                    <Languages className="w-3.5 h-3.5" />
                    <span>{doc.languages.join(", ")}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border">
                    {doc.accepting_new_patients ? (
                      <span className="inline-block text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                        Accepting new patients
                      </span>
                    ) : (
                      <span className="inline-block text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        Not accepting new patients
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
