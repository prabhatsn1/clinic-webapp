"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import type { MockDoctor } from "@/types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AvailabilityRow {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
}

interface Props {
  doctors: MockDoctor[];
  initialAvailability: AvailabilityRow[];
}

export default function AvailabilityManager({
  doctors,
  initialAvailability,
}: Props) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    doctors[0]?.id ?? "",
  );
  const [rows, setRows] = useState<AvailabilityRow[]>(initialAvailability);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const doctorRows = rows.filter((r) => r.doctor_id === selectedDoctorId);

  const addRow = () => {
    const existingDays = doctorRows.map((r) => r.day_of_week);
    const nextDay = [1, 2, 3, 4, 5, 6, 0].find(
      (d) => !existingDays.includes(d),
    );
    if (nextDay === undefined) return;
    setRows((prev) => [
      ...prev,
      {
        doctor_id: selectedDoctorId,
        day_of_week: nextDay,
        start_time: "09:00",
        end_time: "17:00",
        slot_minutes: 15,
      },
    ]);
  };

  const removeRow = (index: number) => {
    const target = doctorRows[index];
    setRows((prev) => prev.filter((r) => r !== target));
  };

  const updateRow = (
    index: number,
    field: keyof AvailabilityRow,
    value: string | number,
  ) => {
    const target = doctorRows[index];
    setRows((prev) =>
      prev.map((r) => (r === target ? { ...r, [field]: value } : r)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: selectedDoctorId, rows: doctorRows }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Doctor selector */}
      <div className="mb-6">
        <label
          htmlFor="doctor-select"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Select Doctor
        </label>
        <select
          id="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white min-w-64"
        >
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} — {doc.specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Availability table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Weekly Schedule</h2>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Day
          </button>
        </div>
        <div className="p-6 space-y-4">
          {doctorRows.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              No schedule set. Click "Add Day" to add working hours.
            </p>
          ) : (
            doctorRows.map((row, i) => (
              <div key={i} className="flex flex-wrap items-center gap-4">
                <select
                  value={row.day_of_week}
                  onChange={(e) =>
                    updateRow(i, "day_of_week", Number(e.target.value))
                  }
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-36"
                  aria-label="Day of week"
                >
                  {DAYS.map((day, idx) => (
                    <option key={day} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <input
                    type="time"
                    value={row.start_time}
                    onChange={(e) => updateRow(i, "start_time", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    aria-label="Start time"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={row.end_time}
                    onChange={(e) => updateRow(i, "end_time", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    aria-label="End time"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={row.slot_minutes}
                    onChange={(e) =>
                      updateRow(i, "slot_minutes", Number(e.target.value))
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    aria-label="Slot duration in minutes"
                  >
                    {[15, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>
                        {m} min slots
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remove this day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4" /> Saved!
          </>
        ) : (
          "Save Schedule"
        )}
      </button>
    </div>
  );
}
