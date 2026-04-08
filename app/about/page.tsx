import type { Metadata } from "next";
import { getAbout } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about MedVita Clinic — our mission, values, and the story behind the care.",
};

const iconMap: Record<string, string> = {
  heart: "❤️",
  shield: "🛡️",
  star: "⭐",
  users: "👥",
};

export default function AboutPage() {
  const about = getAbout();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">
            Our Story
          </Badge>
          <h1 className="text-5xl font-bold mb-6">{about.headline}</h1>
          <p className="text-xl text-brand-100/75 leading-relaxed max-w-2xl mx-auto">
            {about.mission}
          </p>
        </div>
      </section>

      {/* About body */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
              {about.body.split("\n\n").map((para, i) => (
                <p key={i} className="mb-6">
                  {para}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="What We Stand For"
              title="Our Core Values"
            />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.values.map((val, i) => (
              <ScrollReveal key={val.title} delay={i * 0.1}>
                <Card>
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-2xl flex items-center justify-center mb-4">
                    {iconMap[val.icon] ?? "✦"}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-500">{val.body}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Our Journey"
              title="19 Years of Excellence"
            />
          </ScrollReveal>
          <div className="relative pl-6 border-l-2 border-brand-200 space-y-8">
            {about.timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 rounded-full bg-brand-500 border-4 border-white ring-2 ring-brand-200" />
                  <p className="text-brand-600 font-bold text-sm mb-1">
                    {item.year}
                  </p>
                  <p className="text-slate-700">{item.event}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
