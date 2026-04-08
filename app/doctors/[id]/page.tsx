import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Languages,
  Star,
  Calendar,
} from "lucide-react";
import { getDoctorById, getDoctors, getServiceBySlug } from "@/lib/mockContent";
import { Badge, Card, StarRating } from "@/components/ui";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getDoctors().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = getDoctorById(id);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: `${doctor.specialty} specialist at MedVita Clinic. ${doctor.bio.slice(0, 120)}`,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params;
  const doctor = getDoctorById(id);
  if (!doctor) notFound();

  const serviceObjects = doctor.services
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-brand-900 to-brand-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-brand-100/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Doctors
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-28 h-28 rounded-2xl bg-brand-700 overflow-hidden ring-4 ring-brand-600 shrink-0">
              <Image
                src={doctor.photo_url}
                alt={`Photo of ${doctor.name}`}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Badge variant="accent" className="mb-2">
                {doctor.department}
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-1">
                {doctor.name}
              </h1>
              <p className="text-brand-300 font-semibold mb-2">
                {doctor.title} · {doctor.specialty}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-brand-100/70">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white font-semibold">
                    {doctor.rating}
                  </span>
                  <span>({doctor.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4" />
                  {doctor.languages.join(", ")}
                </div>
                {doctor.accepting_new_patients && (
                  <span className="text-teal-300">
                    ✓ Accepting new patients
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-500" />
                Education & Training
              </h3>
              <ul className="space-y-3">
                {doctor.education.map((edu) => (
                  <li
                    key={edu}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            {serviceObjects.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Services Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {serviceObjects.map(
                    (svc) =>
                      svc && (
                        <Link
                          key={svc.id}
                          href={`/services/${svc.slug}`}
                          className="px-4 py-2 bg-brand-50 text-brand-700 text-sm font-medium rounded-xl hover:bg-brand-100 transition-colors"
                        >
                          {svc.title}
                        </Link>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-brand-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Book an Appointment
                </h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Choose a service below then pick your preferred date and time.
              </p>
              {serviceObjects.map(
                (svc) =>
                  svc && (
                    <Link
                      key={svc.id}
                      href={`/appointments?doctorId=${doctor.id}&serviceId=${svc.id}`}
                      className="flex items-center justify-between w-full mb-2 px-4 py-3 border border-border rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-all text-sm"
                    >
                      <span className="font-medium text-slate-800">
                        {svc.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-500" />
                    </Link>
                  ),
              )}
              {doctor.accepting_new_patients ? (
                <p className="mt-4 text-xs text-center text-teal-600 bg-teal-50 rounded-lg py-2">
                  ✓ Currently accepting new patients
                </p>
              ) : (
                <p className="mt-4 text-xs text-center text-slate-400 bg-slate-50 rounded-lg py-2">
                  Not accepting new patients
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
