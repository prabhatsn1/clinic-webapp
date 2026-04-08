/**
 * scripts/seed.ts
 *
 * Seeds the Supabase database with doctors, services, departments, and
 * doctor_services relationships from data/mock.json. Also inserts a sample
 * weekly availability for every doctor (Mon–Fri, 09:00–17:00).
 *
 * Usage:
 *   cp .env.example .env.local   # fill in your keys first
 *   npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import mockData from "../data/mock.json";

// ---------------------------------------------------------------------------
// Supabase client (service role — required for writes bypassing RLS)
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "[seed] Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function upsert<T extends object>(
  table: string,
  rows: T[],
  conflictColumn = "id",
): Promise<void> {
  const { error } = await supabase
    .from(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(rows as any[], {
      onConflict: conflictColumn,
    });
  if (error) {
    throw new Error(`[seed] Error upserting into "${table}": ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Seed: services
// ---------------------------------------------------------------------------

async function seedServices(): Promise<void> {
  const rows = mockData.services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    short_description: s.short_description,
    description: s.description,
    category: s.category,
    duration_minutes: s.duration_minutes,
    price: s.price,
    highlights: s.highlights,
    icon: s.icon,
    image: s.image,
    is_active: true,
  }));

  await upsert("services", rows);
  console.log(`[seed] services: ${rows.length} upserted`);
}

// ---------------------------------------------------------------------------
// Seed: departments
// ---------------------------------------------------------------------------

async function seedDepartments(): Promise<void> {
  const rows = mockData.departments.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    icon: d.icon,
    services: d.services,
  }));

  await upsert("departments", rows);
  console.log(`[seed] departments: ${rows.length} upserted`);
}

// ---------------------------------------------------------------------------
// Seed: doctors
// ---------------------------------------------------------------------------

async function seedDoctors(): Promise<void> {
  const rows = mockData.doctors.map((d) => ({
    id: d.id,
    name: d.name,
    title: d.title,
    specialty: d.specialty,
    department: d.department,
    bio: d.bio,
    education: d.education,
    languages: d.languages,
    photo_url: d.photo_url,
    rating: d.rating,
    reviews_count: d.reviews_count,
    accepting_new_patients: d.accepting_new_patients,
    is_active: true,
  }));

  await upsert("doctors", rows);
  console.log(`[seed] doctors: ${rows.length} upserted`);
}

// ---------------------------------------------------------------------------
// Seed: doctor_services (junction table)
// ---------------------------------------------------------------------------

async function seedDoctorServices(): Promise<void> {
  const rows = mockData.doctors
    .flatMap((d) =>
      d.services.map((serviceSlug) => {
        const service = mockData.services.find((s) => s.slug === serviceSlug);
        if (!service) {
          console.warn(
            `[seed] doctor_services: no service found for slug "${serviceSlug}" (doctor ${d.id})`,
          );
          return null;
        }
        return { doctor_id: d.id, service_id: service.id };
      }),
    )
    .filter((r): r is { doctor_id: string; service_id: string } => r !== null);

  await upsert("doctor_services", rows, "doctor_id,service_id");
  console.log(`[seed] doctor_services: ${rows.length} upserted`);
}

// ---------------------------------------------------------------------------
// Seed: doctor_availability (Mon–Fri 09:00–17:00 for every doctor)
// ---------------------------------------------------------------------------

async function seedAvailability(): Promise<void> {
  // dow: 0 = Sunday … 6 = Saturday (PostgreSQL convention)
  const weekdays = [1, 2, 3, 4, 5]; // Mon–Fri

  const rows = mockData.doctors.flatMap((d) =>
    weekdays.map((dow) => ({
      doctor_id: d.id,
      day_of_week: dow,
      start_time: "09:00:00",
      end_time: "17:00:00",
    })),
  );

  // Use upsert with a composite conflict column — adjust if your schema uses a unique constraint name
  const { error } = await supabase
    .from("doctor_availability")
    .upsert(rows, { onConflict: "doctor_id,day_of_week" });

  if (error) {
    throw new Error(
      `[seed] Error upserting into "doctor_availability": ${error.message}`,
    );
  }
  console.log(`[seed] doctor_availability: ${rows.length} rows upserted`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("[seed] Starting database seed…\n");

  await seedServices();
  await seedDepartments();
  await seedDoctors();
  await seedDoctorServices();
  await seedAvailability();

  console.log("\n[seed] Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
