"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(ContactSchema) });

  const onSubmit = async (_data: ContactFormData) => {
    // In production, connect to an email API (e.g., SendGrid, Resend)
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    reset();
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-500">
          We&apos;ll get back to you within one business day.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-brand-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            className={cn(
              "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
              errors.name ? "border-red-400" : "border-border",
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={cn(
              "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
              errors.email ? "border-red-400" : "border-border",
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          Subject *
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          className={cn(
            "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
            errors.subject ? "border-red-400" : "border-border",
          )}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          placeholder="How can we help you?"
          className={cn(
            "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none",
            errors.message ? "border-red-400" : "border-border",
          )}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
