import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const AvailabilityRowSchema = z.object({
  doctor_id: z.string().uuid(),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  slot_minutes: z.number().int().positive(),
});

const PutSchema = z.object({
  doctorId: z.string().uuid(),
  rows: z.array(AvailabilityRowSchema),
});

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = PutSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json(
      { error: "VALIDATION_ERROR", details: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  const { doctorId, rows } = parseResult.data;
  const supabase = await createAdminClient();

  // Delete existing rows for this doctor and re-insert
  const { error: delErr } = await supabase
    .from("doctor_availability")
    .delete()
    .eq("doctor_id", doctorId);

  if (delErr) {
    return Response.json({ error: delErr.message }, { status: 500 });
  }

  if (rows.length > 0) {
    const { error: insertErr } = await supabase
      .from("doctor_availability")
      .insert(rows);

    if (insertErr) {
      return Response.json({ error: insertErr.message }, { status: 500 });
    }
  }

  return Response.json({ ok: true });
}
