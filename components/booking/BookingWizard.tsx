"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingFormSchema, type BookingFormData } from "@/lib/schemas";
import type { MockService, MockDoctor, TimeSlot } from "@/types";
import { format, addDays, startOfDay } from "date-fns";
import { CheckCircle, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingWizardProps {
  services: MockService[];
  doctors: MockDoctor[];
  prefilledServiceId?: string;
  prefilledDoctorId?: string;
}

type Step = "service" | "doctor" | "datetime" | "details" | "confirmation";
const STEPS: Step[] = [
  "service",
  "doctor",
  "datetime",
  "details",
  "confirmation",
];
const STEP_LABELS: Record<Step, string> = {
  service: "Service",
  doctor: "Doctor",
  datetime: "Date & Time",
  details: "Your Details",
  confirmation: "Confirmed",
};

export default function BookingWizard({
  services,
  doctors,
  prefilledServiceId,
  prefilledDoctorId,
}: BookingWizardProps) {
  const [step, setStep] = useState<Step>(
    prefilledServiceId
      ? prefilledDoctorId
        ? "datetime"
        : "doctor"
      : "service",
  );
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      serviceId: prefilledServiceId ?? "",
      doctorId: prefilledDoctorId ?? "",
      date: "",
      startTs: "",
      patientName: "",
      phone: "",
      email: "",
      reason: "",
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("date");
  const selectedSlot = watch("startTs");

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Filter doctors by service
  const eligibleDoctors = selectedServiceId
    ? doctors.filter((d) => {
        const svc = services.find((s) => s.id === selectedServiceId);
        return svc ? d.services.includes(svc.slug) : true;
      })
    : doctors;

  // Generate min/max dates (today + 60 days)
  const today = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 60), "yyyy-MM-dd");

  // Fetch slots when doctor + date + service are set
  const fetchSlots = useCallback(async () => {
    if (!selectedDoctorId || !selectedDate || !selectedServiceId) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/doctors/${selectedDoctorId}/availability?date=${selectedDate}&serviceId=${selectedServiceId}`,
      );
      if (!res.ok) throw new Error("Could not load slots");
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setSlotsError("Unable to load available slots. Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedDoctorId, selectedDate, selectedServiceId]);

  useEffect(() => {
    if (step === "datetime" && selectedDate) {
      fetchSlots();
    }
  }, [step, selectedDate, fetchSlots]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "SLOT_TAKEN") {
          setSubmitError(
            "This slot was just taken by another patient. Please pick another time.",
          );
          setStep("datetime");
          setValue("startTs", "");
          await fetchSlots();
          return;
        }
        throw new Error(json.message ?? "Booking failed");
      }
      setBookingRef(json.id);
      setStep("confirmation");
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepIndex = STEPS.indexOf(step);

  // ─── Confirmation screen ──────────────────────────────────────────────────
  if (step === "confirmation") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Appointment Booked!
        </h2>
        <p className="text-slate-500 mb-6">
          Your appointment has been confirmed. You will receive an email
          confirmation shortly.
        </p>
        {bookingRef && (
          <div className="bg-brand-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-500">Booking Reference</p>
            <p className="text-xl font-mono font-bold text-brand-700 mt-1">
              {bookingRef.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl border border-border p-6 text-left mb-6 space-y-3">
          <InfoRow label="Service" value={selectedService?.title ?? "—"} />
          <InfoRow label="Doctor" value={selectedDoctor?.name ?? "—"} />
          <InfoRow
            label="Date"
            value={
              selectedDate
                ? format(new Date(selectedDate), "EEEE, MMMM d, yyyy")
                : "—"
            }
          />
          <InfoRow
            label="Time"
            value={
              selectedSlot ? format(new Date(selectedSlot), "h:mm a") : "—"
            }
          />
        </div>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress stepper */}
      <nav aria-label="Booking steps" className="mb-10">
        <ol className="flex items-center gap-2">
          {(STEPS.slice(0, 4) as Step[]).map((s, idx) => (
            <li key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  idx < currentStepIndex && "text-brand-600",
                  idx === currentStepIndex && "text-brand-600",
                  idx > currentStepIndex && "text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                    idx < currentStepIndex && "bg-brand-500 text-white",
                    idx === currentStepIndex &&
                      "bg-brand-500 text-white ring-4 ring-brand-100",
                    idx > currentStepIndex && "bg-slate-200 text-slate-400",
                  )}
                >
                  {idx < currentStepIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="hidden sm:block">{STEP_LABELS[s]}</span>
              </div>
              {idx < 3 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* STEP 1: Select Service */}
        {step === "service" && (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-900 mb-6">
              Select a Service
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => (
                <label
                  key={svc.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedServiceId === svc.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-border hover:border-brand-300 bg-white",
                  )}
                >
                  <input
                    type="radio"
                    {...register("serviceId")}
                    value={svc.id}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">
                      {svc.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {svc.duration_minutes} min · ${svc.price}
                    </p>
                  </div>
                  {selectedServiceId === svc.id && (
                    <CheckCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  )}
                </label>
              ))}
            </div>
            {errors.serviceId && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {errors.serviceId.message}
              </p>
            )}
            <StepButtons
              onNext={() => {
                if (selectedServiceId) setStep("doctor");
              }}
              nextDisabled={!selectedServiceId}
            />
          </fieldset>
        )}

        {/* STEP 2: Select Doctor */}
        {step === "doctor" && (
          <fieldset>
            <legend className="text-2xl font-bold text-slate-900 mb-2">
              Select a Doctor
            </legend>
            {selectedService && (
              <p className="text-sm text-slate-500 mb-6">
                Showing specialists for <strong>{selectedService.title}</strong>
              </p>
            )}
            <div className="space-y-3">
              {eligibleDoctors.map((doc) => (
                <label
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedDoctorId === doc.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-border hover:border-brand-300 bg-white",
                  )}
                >
                  <input
                    type="radio"
                    {...register("doctorId")}
                    value={doc.id}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 shrink-0 text-lg">
                    {doc.name.split(" ")[1]?.[0] ?? doc.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-amber-500">★</span>
                      <span className="text-xs text-slate-600">
                        {doc.rating} ({doc.reviews_count})
                      </span>
                    </div>
                  </div>
                  {selectedDoctorId === doc.id && (
                    <CheckCircle className="w-5 h-5 text-brand-500 shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {errors.doctorId && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {errors.doctorId.message}
              </p>
            )}
            <StepButtons
              onBack={() => setStep("service")}
              onNext={() => {
                if (selectedDoctorId) setStep("datetime");
              }}
              nextDisabled={!selectedDoctorId}
            />
          </fieldset>
        )}

        {/* STEP 3: Date & Time */}
        {step === "datetime" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Pick a Date & Time
            </h2>

            {/* Date picker */}
            <div className="mb-6">
              <label
                htmlFor="date-input"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Select Date
              </label>
              <input
                id="date-input"
                type="date"
                min={today}
                max={maxDate}
                {...register("date")}
                className="w-full sm:w-64 px-4 py-3 border border-border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                aria-describedby={errors.date ? "date-error" : undefined}
              />
              {errors.date && (
                <p
                  id="date-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Slots */}
            {selectedDate && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Available times on{" "}
                  {format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM d")}
                </p>
                {slotsLoading && (
                  <div className="flex items-center gap-2 text-slate-500 py-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading available slots…
                  </div>
                )}
                {slotsError && (
                  <div
                    className="flex items-center gap-2 text-red-600 py-4"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {slotsError}
                  </div>
                )}
                {!slotsLoading && !slotsError && slots.length === 0 && (
                  <p className="text-slate-500 py-4">
                    No available slots on this date. Try a different day.
                  </p>
                )}
                {!slotsLoading && slots.length > 0 && (
                  <div
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2"
                    role="group"
                    aria-label="Available time slots"
                  >
                    {slots.map((slot) => (
                      <label key={slot.start}>
                        <input
                          type="radio"
                          {...register("startTs")}
                          value={slot.start}
                          disabled={!slot.available}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "block text-center px-2 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                            !slot.available &&
                              "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed",
                            slot.available &&
                              selectedSlot !== slot.start &&
                              "bg-white border-border text-slate-700 hover:border-brand-400 hover:text-brand-600",
                            selectedSlot === slot.start &&
                              "bg-brand-500 border-brand-500 text-white",
                          )}
                          aria-label={`${slot.label}${!slot.available ? " (unavailable)" : ""}`}
                        >
                          {slot.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.startTs && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.startTs.message}
                  </p>
                )}
              </div>
            )}

            {submitError && (
              <div
                className="mt-4 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <StepButtons
              onBack={() => setStep("doctor")}
              onNext={() => {
                if (selectedDate && selectedSlot) setStep("details");
              }}
              nextDisabled={!selectedDate || !selectedSlot}
            />
          </div>
        )}

        {/* STEP 4: Patient Details */}
        {step === "details" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your Details
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Booking for {selectedService?.title} with {selectedDoctor?.name}{" "}
              on{" "}
              {selectedDate &&
                format(new Date(selectedDate + "T00:00:00"), "MMMM d")}{" "}
              at {selectedSlot && format(new Date(selectedSlot), "h:mm a")}
            </p>

            <div className="space-y-5">
              <FormField
                label="Full Name *"
                id="patientName"
                error={errors.patientName?.message}
              >
                <input
                  id="patientName"
                  type="text"
                  autoComplete="name"
                  {...register("patientName")}
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
                    errors.patientName ? "border-red-400" : "border-border",
                  )}
                  aria-describedby={
                    errors.patientName ? "patientName-error" : undefined
                  }
                />
              </FormField>

              <FormField
                label="Phone Number *"
                id="phone"
                error={errors.phone?.message}
              >
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  {...register("phone")}
                  className={cn(
                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
                    errors.phone ? "border-red-400" : "border-border",
                  )}
                />
              </FormField>

              <FormField
                label="Email (optional)"
                id="email"
                error={errors.email?.message}
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </FormField>

              <FormField
                label="Reason for visit (optional)"
                id="reason"
                error={errors.reason?.message}
              >
                <textarea
                  id="reason"
                  rows={3}
                  {...register("reason")}
                  placeholder="Briefly describe your concern…"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none"
                />
              </FormField>
            </div>

            {submitError && (
              <div
                className="mt-4 p-4 bg-red-50 rounded-xl flex items-start gap-3 text-red-700"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStep("datetime")}
                className="px-6 py-3 border border-border rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming…
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StepButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center gap-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-border rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 sm:flex-none px-8 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

function FormField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
