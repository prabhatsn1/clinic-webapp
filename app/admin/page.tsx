import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalToday },
    { count: totalBooked },
    { count: totalCompleted },
    { data: upcoming },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("start_ts", new Date().toISOString().split("T")[0])
      .lt(
        "start_ts",
        new Date(Date.now() + 86400000).toISOString().split("T")[0],
      ),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "booked"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase
      .from("appointments")
      .select(
        "id, patient_name, start_ts, end_ts, status, services(title), doctors(name)",
      )
      .in("status", ["booked", "confirmed"])
      .gte("start_ts", new Date().toISOString())
      .order("start_ts")
      .limit(10),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Today's Appointments"
          value={totalToday ?? 0}
          Icon={Calendar}
          color="brand"
        />
        <StatCard
          label="Confirmed Bookings"
          value={totalBooked ?? 0}
          Icon={Clock}
          color="amber"
        />
        <StatCard
          label="Completed this month"
          value={totalCompleted ?? 0}
          Icon={CheckCircle}
          color="teal"
        />
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Patient</th>
                <th className="px-6 py-3 text-left font-semibold">Doctor</th>
                <th className="px-6 py-3 text-left font-semibold">Service</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(upcoming ?? []).map((appt: any) => (
                <tr key={appt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {appt.patient_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {appt.doctors?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {appt.services?.title ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {format(new Date(appt.start_ts), "MMM d, h:mm a")}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                </tr>
              ))}
              {(!upcoming || upcoming.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No upcoming appointments.
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

function StatCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div
        className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
          color === "brand"
            ? "bg-brand-100 text-brand-600"
            : color === "amber"
              ? "bg-amber-100 text-amber-600"
              : "bg-teal-100 text-teal-600"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
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
