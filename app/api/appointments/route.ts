import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingFormSchema } from "@/lib/schemas";
import { getServices } from "@/lib/mockContent";
import { addMinutes } from "date-fns";
import { z } from "zod";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate input
  const parseResult = BookingFormSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json(
      { error: "VALIDATION_ERROR", details: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  const { serviceId, doctorId, startTs, patientName, phone, email, reason } =
    parseResult.data;

  // Derive end time from service duration (authoritative source = mock.json)
  const mockServices = getServices();
  const mockService = mockServices.find((s) => s.id === serviceId);
  if (!mockService) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  const startDate = new Date(startTs);
  const endDate = addMinutes(startDate, mockService.duration_minutes);

  // Validate the start time is in the future
  if (startDate <= new Date()) {
    return Response.json(
      { error: "Appointment must be in the future" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Confirm doctor exists and is active
  const { data: doctor, error: docErr } = await supabase
    .from("doctors")
    .select("id")
    .eq("id", doctorId)
    .eq("active", true)
    .single();

  if (docErr || !doctor) {
    return Response.json({ error: "Doctor not found" }, { status: 404 });
  }

  // Confirm service exists in Supabase
  const { data: service, error: svcErr } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .single();

  if (svcErr || !service) {
    return Response.json(
      { error: "Service not found in database" },
      { status: 404 },
    );
  }

  // Insert appointment — the DB EXCLUDE constraint will reject overlaps
  const { data: appt, error: insertErr } = await supabase
    .from("appointments")
    .insert({
      doctor_id: doctorId,
      service_id: serviceId,
      patient_name: patientName,
      phone,
      email: email || null,
      reason: reason || null,
      start_ts: startDate.toISOString(),
      end_ts: endDate.toISOString(),
      status: "booked",
    })
    .select("id, start_ts, end_ts, status")
    .single();

  if (insertErr) {
    // PostgreSQL exclusion violation error code: 23P01
    if (
      insertErr.code === "23P01" ||
      insertErr.message?.toLowerCase().includes("no_overlapping_appointments")
    ) {
      return Response.json(
        {
          error: "SLOT_TAKEN",
          message:
            "This slot was just taken by another patient. Please pick another time.",
        },
        { status: 409 },
      );
    }
    console.error("[POST /api/appointments] Supabase error:", insertErr);
    return Response.json(
      { error: "Booking failed. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(appt, { status: 201 });
}
