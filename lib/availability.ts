import {
  parseISO,
  addMinutes,
  format,
  isAfter,
  isBefore,
  getDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  startOfDay,
} from "date-fns";
import type {
  DBDoctorAvailability,
  DBDoctorTimeOff,
  DBAppointment,
  TimeSlot,
} from "@/types";

interface ComputeSlotsParams {
  date: string; // "YYYY-MM-DD"
  availability: DBDoctorAvailability[]; // doctor's weekly schedule
  timeOff: DBDoctorTimeOff[]; // time-off blocks
  existingAppointments: DBAppointment[]; // confirmed/booked appointments
  durationMinutes: number; // service duration
  slotIncrementMinutes?: number; // default 15
}

/**
 * Returns all possible time slots for a doctor on a given date,
 * marked available/unavailable based on schedule, time-off, and bookings.
 */
export function computeAvailableSlots({
  date,
  availability,
  timeOff,
  existingAppointments,
  durationMinutes,
  slotIncrementMinutes = 15,
}: ComputeSlotsParams): TimeSlot[] {
  const dayOfWeek = getDay(parseISO(date)); // 0=Sun

  // Find the doctor's schedule for this day
  const schedule = availability.find((a) => a.day_of_week === dayOfWeek);
  if (!schedule) return [];

  const baseDate = startOfDay(parseISO(date));

  // Parse schedule times into Date objects for this specific date
  const [startH, startM] = schedule.start_time.split(":").map(Number);
  const [endH, endM] = schedule.end_time.split(":").map(Number);

  let windowStart = setMilliseconds(
    setSeconds(setMinutes(setHours(baseDate, startH), startM), 0),
    0,
  );
  const windowEnd = setMilliseconds(
    setSeconds(setMinutes(setHours(baseDate, endH), endM), 0),
    0,
  );

  const slots: TimeSlot[] = [];
  const now = new Date();

  while (
    isBefore(addMinutes(windowStart, durationMinutes), windowEnd) ||
    addMinutes(windowStart, durationMinutes).getTime() === windowEnd.getTime()
  ) {
    const slotStart = windowStart;
    const slotEnd = addMinutes(slotStart, durationMinutes);

    // Skip slots in the past
    if (!isAfter(slotStart, now)) {
      windowStart = addMinutes(windowStart, slotIncrementMinutes);
      continue;
    }

    // Check for time-off conflicts
    const blockedByTimeOff = timeOff.some((off) => {
      const offStart = parseISO(off.start_ts);
      const offEnd = parseISO(off.end_ts);
      return isBefore(slotStart, offEnd) && isAfter(slotEnd, offStart);
    });

    // Check for appointment conflicts
    const blockedByAppointment = existingAppointments.some((appt) => {
      const apptStart = parseISO(appt.start_ts);
      const apptEnd = parseISO(appt.end_ts);
      // Overlap: slot starts before appt ends AND slot ends after appt starts
      return isBefore(slotStart, apptEnd) && isAfter(slotEnd, apptStart);
    });

    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      label: format(slotStart, "h:mm a"),
      available: !blockedByTimeOff && !blockedByAppointment,
    });

    windowStart = addMinutes(windowStart, slotIncrementMinutes);
  }

  return slots;
}
