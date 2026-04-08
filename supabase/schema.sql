-- ============================================================
--  MedVita Clinic — Supabase PostgreSQL Schema
--  Run this in the Supabase SQL editor (or psql)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ─── doctors ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text NOT NULL,
  bio          text,
  photo_url    text,
  specialties  text[]  NOT NULL DEFAULT '{}',
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── services ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  description       text,
  duration_minutes  int  NOT NULL CHECK (duration_minutes > 0),
  price             numeric(10,2)
);

-- ─── departments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text NOT NULL,
  description  text
);

-- ─── doctor_services (many-to-many) ────────────────────────
CREATE TABLE IF NOT EXISTS doctor_services (
  doctor_id   uuid NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
  service_id  uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

-- ─── doctor_availability (weekly schedule) ─────────────────
-- day_of_week: 0=Sunday … 6=Saturday
CREATE TABLE IF NOT EXISTS doctor_availability (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week   int  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    time NOT NULL,
  end_time      time NOT NULL,
  slot_minutes  int  NOT NULL DEFAULT 15 CHECK (slot_minutes > 0),
  CONSTRAINT chk_end_after_start CHECK (end_time > start_time),
  UNIQUE (doctor_id, day_of_week)
);

-- ─── doctor_time_off (exceptions / PTO) ────────────────────
CREATE TABLE IF NOT EXISTS doctor_time_off (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id   uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  start_ts    timestamptz NOT NULL,
  end_ts      timestamptz NOT NULL,
  reason      text,
  CONSTRAINT chk_time_off_end_after_start CHECK (end_ts > start_ts)
);

-- ─── appointments ───────────────────────────────────────────
--
--  timeslot is a GENERATED column of type tstzrange,
--  which is indexed with GiST + EXCLUDE to prevent any
--  two overlapping appointments for the same doctor.
--
CREATE TABLE IF NOT EXISTS appointments (
  id            uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     uuid         NOT NULL REFERENCES doctors(id),
  service_id    uuid         NOT NULL REFERENCES services(id),
  patient_name  text         NOT NULL,
  phone         text         NOT NULL,
  email         text,
  reason        text,
  start_ts      timestamptz  NOT NULL,
  end_ts        timestamptz  NOT NULL,
  -- Generated range column — used by the EXCLUDE constraint
  timeslot      tstzrange    GENERATED ALWAYS AS (tstzrange(start_ts, end_ts, '[)')) STORED,
  status        text         NOT NULL DEFAULT 'booked'
                             CHECK (status IN ('booked','confirmed','cancelled','completed','no_show')),
  created_at    timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT chk_appt_end_after_start CHECK (end_ts > start_ts)
);

-- ─── OVERLAP PREVENTION ─────────────────────────────────────
--  Guarantees no two ACTIVE appointments for the same doctor
--  have overlapping time ranges at the database level.
--  Only active statuses participate; cancelled/completed do not block slots.
--
--  NOTE: Postgres cannot directly filter a partial EXCLUDE constraint,
--  so we use a separate partial unique index approach alongside the
--  application-level status check in the API.
--
--  This EXCLUDE fires on every INSERT/UPDATE regardless of status.
--  The API must only send INSERT when status = 'booked' or 'confirmed'.
--  To handle cancellations properly the API sets status = 'cancelled'
--  (not a DELETE) so the slot re-opens automatically because the
--  EXCLUDE only prevents NEW overlapping rows, not updates to existing ones.
--
--  For production you may want a partial index approach; see notes below.

ALTER TABLE appointments
  ADD CONSTRAINT no_overlapping_appointments
  EXCLUDE USING gist (
    doctor_id WITH =,
    timeslot  WITH &&
  ) WHERE (status IN ('booked', 'confirmed'));

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_start
  ON appointments (doctor_id, start_ts);

CREATE INDEX IF NOT EXISTS idx_appointments_start_ts
  ON appointments (start_ts);

CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor
  ON doctor_availability (doctor_id);

CREATE INDEX IF NOT EXISTS idx_doctor_time_off_doctor
  ON doctor_time_off (doctor_id, start_ts, end_ts);

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE doctors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability  ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_time_off      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments     ENABLE ROW LEVEL SECURITY;

-- Public read-only access (for the patient-facing website)
CREATE POLICY "public_read_doctors"
  ON doctors FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "public_read_services"
  ON services FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_departments"
  ON departments FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_doctor_services"
  ON doctor_services FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_availability"
  ON doctor_availability FOR SELECT TO anon, authenticated
  USING (true);

-- Time-off is readable by anyone (needed for slot generation)
CREATE POLICY "public_read_time_off"
  ON doctor_time_off FOR SELECT TO anon, authenticated
  USING (true);

-- ─── Appointments RLS ─────────────────────────────────────────
-- Public can INSERT (book), but cannot read others' appointments
CREATE POLICY "public_insert_appointment"
  ON appointments FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'booked');

-- Patients can only read appointments they booked by email
-- (in a real app you'd tie this to auth.uid())
CREATE POLICY "patient_read_own_appointment"
  ON appointments FOR SELECT TO authenticated
  USING (email = auth.email());

-- ─── Staff / Admin role ───────────────────────────────────────
-- Create a custom role 'staff' in Supabase Dashboard > Authentication > Roles
-- or use service-role key in server-side admin actions.
--
-- Example staff policies (uncomment when 'staff' role exists):
--
-- CREATE POLICY "staff_all_appointments"
--   ON appointments FOR ALL TO staff
--   USING (true) WITH CHECK (true);
--
-- CREATE POLICY "staff_manage_availability"
--   ON doctor_availability FOR ALL TO staff
--   USING (true) WITH CHECK (true);
--
-- CREATE POLICY "staff_manage_time_off"
--   ON doctor_time_off FOR ALL TO staff
--   USING (true) WITH CHECK (true);

-- ─── Notes on overlap prevention ──────────────────────────────
--
-- HOW IT WORKS:
--   1. The `timeslot tstzrange GENERATED ALWAYS AS (tstzrange(start_ts,end_ts,'[)')) STORED`
--      column produces a half-open range [start, end) for every row.
--
--   2. The EXCLUDE USING gist (...) constraint runs a GiST index scan before
--      every INSERT or UPDATE. If any existing row has the same doctor_id AND
--      a timeslot that overlaps (&&) the new row's timeslot, the write is
--      rejected with error code 23P01 (exclusion_violation).
--
--   3. The WHERE clause (status IN ('booked','confirmed')) means that
--      cancelled/completed appointments no longer block the slot.
--
--   4. The API catches error code 23P01 (exclusion_violation / constraint name
--      'no_overlapping_appointments') and returns HTTP 409 with:
--      { "error": "SLOT_TAKEN", "message": "This slot was just taken, pick another." }
