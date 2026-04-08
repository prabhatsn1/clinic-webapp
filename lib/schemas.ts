import { z } from "zod";

// ─── Zod schemas matching mock.json ────────────────────────────────────────

export const MockServiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  short_description: z.string(),
  description: z.string(),
  icon: z.string(),
  duration_minutes: z.number().int().positive(),
  price: z.number().nonnegative(),
  category: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
});

export const MockDoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  specialty: z.string(),
  department: z.string(),
  bio: z.string(),
  education: z.array(z.string()),
  languages: z.array(z.string()),
  services: z.array(z.string()),
  photo_url: z.string(),
  rating: z.number().min(0).max(5),
  reviews_count: z.number().int().nonnegative(),
  accepting_new_patients: z.boolean(),
});

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  icon: z.string(),
  services: z.array(z.string()),
});

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  service: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string(),
  date: z.string(),
  avatar: z.string(),
});

export const FAQSchema = z.object({
  id: z.string(),
  category: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const PricingItemSchema = z.object({
  id: z.string(),
  service: z.string(),
  self_pay: z.number().nonnegative(),
  insurance_estimate: z.string(),
  duration_minutes: z.number().int().positive(),
  notes: z.string(),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  body: z.string(),
  author: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  published_at: z.string(),
  read_time_minutes: z.number().int().positive(),
});

export const CareerSchema = z.object({
  id: z.string(),
  title: z.string(),
  department: z.string(),
  type: z.string(),
  location: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  posted_at: z.string(),
});

export const BookingFormSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Please select a date"),
  startTs: z.string().min(1, "Please select a time slot"),
  patientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s\-().]+$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  reason: z.string().max(500).optional(),
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;
