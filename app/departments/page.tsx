import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDepartments } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Departments",
  description:
    "Explore MedVita Clinic departments — from Primary Care to Radiology & Diagnostics.",
};

const iconMap: Record<string, string> = {
  home: "🏠",
  heart: "❤️",
  activity: "📊",
  brain: "🧠",
  scan: "🔬",
  sparkles: "✨",
  flower: "🌸",
};

export default function DepartmentsPage() {
  const departments = getDepartments();

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">
            Our Departments
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Clinical Departments</h1>
          <p className="text-xl text-brand-100/75 max-w-2xl mx-auto">
            Seven specialised departments, one cohesive care team. Each
            department is staffed by fellowship-trained specialists working
            together for your best outcome.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, i) => (
            <ScrollReveal key={dept.id} delay={i * 0.08}>
              <Card className="flex flex-col h-full group">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-3xl flex items-center justify-center mb-4 group-hover:bg-brand-500 transition-colors">
                  {iconMap[dept.icon] ?? "🏥"}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {dept.name}
                </h2>
                <p className="text-slate-500 text-sm flex-1 mb-4">
                  {dept.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dept.services.map((svc) => (
                    <Link
                      key={svc}
                      href={`/services/${svc}`}
                      className="text-xs px-3 py-1 bg-brand-50 text-brand-700 rounded-full hover:bg-brand-100 transition-colors"
                    >
                      {svc.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/services?dept=${dept.slug}`}
                  className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold group-hover:gap-2 transition-all"
                >
                  View services <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
