import type { Metadata } from "next";
import { getFAQs } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge } from "@/components/ui";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about appointments, billing, insurance, and more at MedVita Clinic.",
};

export default function FAQPage() {
  const faqs = getFAQs();
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            FAQ
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-brand-100/75">
            Everything you need to know before your visit.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <ScrollReveal>
              <h2 className="text-lg font-bold text-brand-600 uppercase tracking-wider mb-4">
                {category}
              </h2>
            </ScrollReveal>
            <Accordion.Root type="multiple" className="space-y-2">
              {faqs
                .filter((f) => f.category === category)
                .map((faq) => (
                  <ScrollReveal key={faq.id}>
                    <Accordion.Item
                      value={faq.id}
                      className="bg-white rounded-xl border border-border overflow-hidden"
                    >
                      <Accordion.Header>
                        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors group">
                          {faq.question}
                          <ChevronDown
                            className="w-4 h-4 text-slate-400 shrink-0 group-data-[state=open]:rotate-180 transition-transform"
                            aria-hidden="true"
                          />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="px-6 pb-4 text-sm text-slate-600 leading-relaxed data-[state=open]:animate-none">
                        {faq.answer}
                      </Accordion.Content>
                    </Accordion.Item>
                  </ScrollReveal>
                ))}
            </Accordion.Root>
          </div>
        ))}

        <div className="bg-brand-50 rounded-2xl p-8 text-center mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-500 mb-4">
            Our front desk team is happy to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
