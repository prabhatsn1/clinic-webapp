-- ============================================================
--  MedVita Clinic — Supabase PostgreSQL Schema
--  Run this in the Supabase SQL editor (or psql)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ─── doctors ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id                      text PRIMARY KEY,
  name                    text NOT NULL,
  title                   text,
  specialty               text,
  department              text,
  bio                     text,
  education               text[],
  languages               text[],
  photo_url               text,
  rating                  numeric(3,1),
  reviews_count           int,
  accepting_new_patients  boolean NOT NULL DEFAULT true,
  is_active               boolean NOT NULL DEFAULT true,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ─── services ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                text PRIMARY KEY,
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  short_description text,
  description       text,
  category          text,
  duration_minutes  int NOT NULL CHECK (duration_minutes > 0),
  price             numeric(10,2),
  highlights        text[],
  icon              text,
  image             text,
  is_active         boolean NOT NULL DEFAULT true
);

-- ─── departments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  slug         text UNIQUE NOT NULL,
  description  text,
  icon         text,
  services     text[]
);

-- ─── doctor_services (many-to-many) ────────────────────────
CREATE TABLE IF NOT EXISTS doctor_services (
  doctor_id   text NOT NULL REFERENCES doctors(id)  ON DELETE CASCADE,
  service_id  text NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

-- ─── doctor_availability (weekly schedule) ─────────────────
CREATE TABLE IF NOT EXISTS doctor_availability (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     text NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week   int  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    time NOT NULL,
  end_time      time NOT NULL,
  slot_minutes  int  NOT NULL DEFAULT 15 CHECK (slot_minutes > 0),
  CONSTRAINT chk_end_after_start CHECK (end_time > start_time),
  UNIQUE (doctor_id, day_of_week)
);

-- ─── doctor_time_off ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctor_time_off (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id   text NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  start_ts    timestamptz NOT NULL,
  end_ts      timestamptz NOT NULL,
  reason      text,
  CONSTRAINT chk_time_off_end_after_start CHECK (end_ts > start_ts)
);

-- ─── appointments ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     text        NOT NULL REFERENCES doctors(id),
  service_id    text        NOT NULL REFERENCES services(id),
  patient_name  text        NOT NULL,
  phone         text        NOT NULL,
  email         text,
  reason        text,
  start_ts      timestamptz NOT NULL,
  end_ts        timestamptz NOT NULL,
  timeslot      tstzrange   GENERATED ALWAYS AS (tstzrange(start_ts, end_ts, '[)')) STORED,
  status        text        NOT NULL DEFAULT 'booked'
                            CHECK (status IN ('booked','confirmed','cancelled','completed','no_show')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_appt_end_after_start CHECK (end_ts > start_ts)
);

ALTER TABLE appointments
  ADD CONSTRAINT no_overlapping_appointments
  EXCLUDE USING gist (
    doctor_id WITH =,
    timeslot  WITH &&
  ) WHERE (status IN ('booked', 'confirmed'));

-- ─── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_start ON appointments (doctor_id, start_ts);
CREATE INDEX IF NOT EXISTS idx_appointments_start_ts     ON appointments (start_ts);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor ON doctor_availability (doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_time_off_doctor     ON doctor_time_off (doctor_id, start_ts, end_ts);

-- ─── Row Level Security ────────────────────────────────────
ALTER TABLE doctors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability  ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_time_off      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_doctors"          ON doctors             FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_services"         ON services            FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_departments"      ON departments         FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_doctor_services"  ON doctor_services     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_availability"     ON doctor_availability FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_time_off"         ON doctor_time_off     FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_insert_appointment"    ON appointments FOR INSERT TO anon, authenticated WITH CHECK (status = 'booked');
CREATE POLICY "patient_read_own_appointment" ON appointments FOR SELECT TO authenticated USING (email = auth.email());
