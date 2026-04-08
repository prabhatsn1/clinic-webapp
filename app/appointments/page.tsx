import type { Metadata } from "next";
import { getServices, getDoctors } from "@/lib/mockContent";
import BookingWizard from "@/components/booking/BookingWizard";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book an appointment at MedVita Clinic. Select a service, choose your doctor, and pick your preferred date and time.",
};

interface Props {
  searchParams: Promise<{ serviceId?: string; doctorId?: string }>;
}

export default async function AppointmentsPage({ searchParams }: Props) {
  const { serviceId, doctorId } = await searchParams;
  const services = getServices();
  const doctors = getDoctors();

  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">
            Book Online
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Book an Appointment</h1>
          <p className="text-brand-100/75">
            Complete in under 2 minutes — select your service, doctor, and
            preferred slot.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookingWizard
          services={services}
          doctors={doctors}
          prefilledServiceId={serviceId}
          prefilledDoctorId={doctorId}
        />
      </div>
    </div>
  );
}
