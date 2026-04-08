import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import CancelButton from "./CancelButton";

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, services(title, duration_minutes), doctors(name)")
    .order("start_ts", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">All Appointments</h1>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Patient</th>
                <th className="px-6 py-3 text-left font-semibold">Phone</th>
                <th className="px-6 py-3 text-left font-semibold">Doctor</th>
                <th className="px-6 py-3 text-left font-semibold">Service</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(appointments ?? []).map((appt: any) => (
                <tr key={appt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {appt.patient_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{appt.phone}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {appt.doctors?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {appt.services?.title ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {format(new Date(appt.start_ts), "MMM d, yyyy h:mm a")}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4">
                    {appt.status === "booked" || appt.status === "confirmed" ? (
                      <CancelButton appointmentId={appt.id} />
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    booked: "bg-blue-50 text-blue-700",
    confirmed: "bg-teal-50 text-teal-700",
    cancelled: "bg-red-50 text-red-700",
    completed: "bg-slate-100 text-slate-600",
    no_show: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${variants[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}
