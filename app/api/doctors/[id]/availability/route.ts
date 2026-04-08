import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeAvailableSlots } from "@/lib/availability";
import { getServices } from "@/lib/mockContent";
import type {
  DBDoctorAvailability,
  DBDoctorTimeOff,
  DBAppointment,
} from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: doctorId } = await params;
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return Response.json(
      { error: "Missing required params: date, serviceId" },
      { status: 400 },
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 },
    );
  }

  // Get service duration from mock.json (source of truth for content)
  const mockServices = getServices();
  const mockService = mockServices.find((s) => s.id === serviceId);
  if (!mockService) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }
  const durationMinutes = mockService.duration_minutes;

  const supabase = await createClient();

  // Fetch doctor's weekly availability
  const { data: availability, error: availErr } = await supabase
    .from("doctor_availability")
    .select("*")
    .eq("doctor_id", doctorId);

  if (availErr) {
    return Response.json({ error: availErr.message }, { status: 500 });
  }

  // Fetch time-off that overlaps the target date
  const dayStart = `${date}T00:00:00+00:00`;
  const dayEnd = `${date}T23:59:59+00:00`;

  const { data: timeOff, error: toErr } = await supabase
    .from("doctor_time_off")
    .select("*")
    .eq("doctor_id", doctorId)
    .lt("start_ts", dayEnd)
    .gt("end_ts", dayStart);

  if (toErr) {
    return Response.json({ error: toErr.message }, { status: 500 });
  }

  // Fetch existing appointments for that doctor on that date
  const { data: appointments, error: apptErr } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .in("status", ["booked", "confirmed"])
    .gte("start_ts", dayStart)
    .lte("start_ts", dayEnd);

  if (apptErr) {
    return Response.json({ error: apptErr.message }, { status: 500 });
  }

  const slots = computeAvailableSlots({
    date,
    availability: (availability ?? []) as DBDoctorAvailability[],
    timeOff: (timeOff ?? []) as DBDoctorTimeOff[],
    existingAppointments: (appointments ?? []) as DBAppointment[],
    durationMinutes,
    slotIncrementMinutes:
      (availability?.[0] as DBDoctorAvailability | undefined)?.slot_minutes ??
      15,
  });

  return Response.json({ slots });
}
