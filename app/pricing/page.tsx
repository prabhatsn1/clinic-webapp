import type { Metadata } from "next";
import { getPricing } from "@/lib/mockContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, upfront pricing for all MedVita Clinic services. No hidden fees.",
};

export default function PricingPage() {
  const pricing = getPricing();

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="accent" className="mb-4">
            Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Clear, Upfront Pricing</h1>
          <p className="text-xl text-brand-100/75 max-w-2xl mx-auto">
            No surprise bills. Self-pay rates and typical insurance estimates
            listed for every service.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pricing.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">
                    {item.service}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 ml-4">
                    <Clock className="w-3.5 h-3.5" />
                    {item.duration_minutes} min
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-brand-600">
                      {formatCurrency(item.self_pay)}
                    </p>
                    <p className="text-xs text-slate-400">Self-pay rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      {item.insurance_estimate}
                    </p>
                    <p className="text-xs text-slate-400">
                      Typical insurance copay
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{item.notes}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="bg-brand-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Accepted Insurance Plans
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              "Blue Cross Blue Shield",
              "Aetna",
              "United Healthcare",
              "Cigna",
              "Humana",
              "Medicare",
            ].map((plan) => (
              <div
                key={plan}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                {plan}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mb-4">
            We work with most major PPO plans. Please call +1 (555) 234-5679 to
            verify your coverage before your visit.
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors text-sm"
          >
            Book an Appointment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
