import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDoctors } from "@/lib/mockContent";
import AvailabilityManager from "./AvailabilityManager";

export default async function AdminAvailabilityPage() {
  const supabase = await createClient();
  const mockDoctors = getDoctors();

  const { data: availability } = await supabase
    .from("doctor_availability")
    .select("*")
    .order("day_of_week");

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Doctor Availability
        </h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Configure weekly working hours for each doctor. Patients can book during
        these hours.
      </p>
      <AvailabilityManager
        doctors={mockDoctors}
        initialAvailability={availability ?? []}
      />
    </div>
  );
}
