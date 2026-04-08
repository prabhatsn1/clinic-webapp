// ─── CMS / Mock Content Types ──────────────────────────────────────────────

export interface ClinicInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  hours: { days: string; hours: string }[];
  social: {
    twitter: string;
    linkedin: string;
    instagram: string;
    facebook: string;
  };
  mapEmbedUrl: string;
  stats: { label: string; value: string }[];
  certifications: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: { label: string; href: string };
  cta_secondary: { label: string; href: string };
  badge: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  body: string;
}

export interface AboutTimeline {
  year: string;
  event: string;
}

export interface AboutContent {
  headline: string;
  body: string;
  mission: string;
  values: AboutValue[];
  timeline: AboutTimeline[];
}

export interface MockService {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  duration_minutes: number;
  price: number;
  category: string;
  highlights: string[];
  image: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: string[];
}

export interface MockDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  bio: string;
  education: string[];
  languages: string[];
  services: string[];
  photo_url: string;
  rating: number;
  reviews_count: number;
  accepting_new_patients: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  body: string;
  date: string;
  avatar: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface PricingItem {
  id: string;
  service: string;
  self_pay: number;
  insurance_estimate: string;
  duration_minutes: number;
  notes: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  published_at: string;
  read_time_minutes: number;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  posted_at: string;
}

// ─── Supabase Database Types ────────────────────────────────────────────────

export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface DBDoctor {
  id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  specialties: string[];
  active: boolean;
  created_at: string;
}

export interface DBService {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
}

export interface DBDepartment {
  id: string;
  name: string;
  description: string | null;
}

export interface DBDoctorService {
  doctor_id: string;
  service_id: string;
}

export interface DBDoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0=Sun … 6=Sat
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  slot_minutes: number;
}

export interface DBDoctorTimeOff {
  id: string;
  doctor_id: string;
  start_ts: string;
  end_ts: string;
  reason: string | null;
}

export interface DBAppointment {
  id: string;
  doctor_id: string;
  service_id: string;
  patient_name: string;
  phone: string;
  email: string | null;
  reason: string | null;
  start_ts: string;
  end_ts: string;
  status: AppointmentStatus;
  created_at: string;
}

// ─── Availability ───────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string; // ISO string
  end: string; // ISO string
  label: string; // "9:00 AM"
  available: boolean;
}

// ─── Booking form ───────────────────────────────────────────────────────────

export interface BookingFormValues {
  serviceId: string;
  doctorId: string;
  date: string; // "YYYY-MM-DD"
  startTs: string; // ISO string
  patientName: string;
  phone: string;
  email?: string;
  reason?: string;
}
