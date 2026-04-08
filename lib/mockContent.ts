import rawMock from "@/data/mock.json";
import {
  MockServiceSchema,
  MockDoctorSchema,
  DepartmentSchema,
  TestimonialSchema,
  FAQSchema,
  PricingItemSchema,
  BlogPostSchema,
  CareerSchema,
} from "@/lib/schemas";
import type {
  ClinicInfo,
  HeroContent,
  AboutContent,
  MockService,
  MockDoctor,
  Department,
  Testimonial,
  FAQ,
  PricingItem,
  BlogPost,
  Career,
  NavItem,
} from "@/types";
import { z } from "zod";

// Validate in dev, skip expensive validation in production for performance
function validate<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  if (process.env.NODE_ENV === "development") {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error(
        `[mockContent] Zod validation failed for "${label}":`,
        result.error.flatten(),
      );
      throw new Error(`Mock data validation failed: ${label}`);
    }
    return result.data;
  }
  return data as T;
}

// Cast typed without re-validating each item in prod
function validateArray<T>(
  schema: z.ZodSchema<T>,
  data: unknown[],
  label: string,
): T[] {
  if (process.env.NODE_ENV === "development") {
    return data.map((item, i) => validate(schema, item, `${label}[${i}]`));
  }
  return data as T[];
}

// ─── Exportable getters ─────────────────────────────────────────────────────

export function getClinic(): ClinicInfo {
  return rawMock.clinic as ClinicInfo;
}

export function getHero(): HeroContent {
  return rawMock.hero as HeroContent;
}

export function getAbout(): AboutContent {
  return rawMock.about as AboutContent;
}

export function getServices(): MockService[] {
  return validateArray(MockServiceSchema, rawMock.services, "services");
}

export function getServiceBySlug(slug: string): MockService | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function getDoctors(): MockDoctor[] {
  return validateArray(MockDoctorSchema, rawMock.doctors, "doctors");
}

export function getDoctorById(id: string): MockDoctor | undefined {
  return getDoctors().find((d) => d.id === id);
}

export function getDepartments(): Department[] {
  return validateArray(DepartmentSchema, rawMock.departments, "departments");
}

export function getTestimonials(): Testimonial[] {
  return validateArray(TestimonialSchema, rawMock.testimonials, "testimonials");
}

export function getFAQs(): FAQ[] {
  return validateArray(FAQSchema, rawMock.faqs, "faqs");
}

export function getPricing(): PricingItem[] {
  return validateArray(PricingItemSchema, rawMock.pricing, "pricing");
}

export function getBlogPosts(): BlogPost[] {
  return validateArray(BlogPostSchema, rawMock.blog, "blog");
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getCareers(): Career[] {
  return validateArray(CareerSchema, rawMock.careers, "careers");
}

export function getNavigation(): {
  main: NavItem[];
  footer: typeof rawMock.navigation.footer;
} {
  return rawMock.navigation as {
    main: NavItem[];
    footer: typeof rawMock.navigation.footer;
  };
}
