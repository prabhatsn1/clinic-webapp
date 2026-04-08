import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const PatchSchema = z.object({
  status: z.enum(["cancelled", "confirmed", "completed", "no_show"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = PatchSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json(
      { error: "VALIDATION_ERROR", details: parseResult.error.flatten() },
      { status: 422 },
    );
  }

  // Use admin client for staff operations
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: parseResult.data.status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
