"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Globe,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { avatarBase64 } from "@/data/avatarBase64";
import { siteContent } from "@/data/content";

// Helper to calculate current time in India Standard Time (IST, UTC+5:30)
const getTodayIST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 330 * 60000);
  return {
    year: ist.getFullYear(),
    month: ist.getMonth(),
    day: ist.getDate(),
    hours: ist.getHours(),
    minutes: ist.getMinutes(),
  };
};

interface AvailableSlot {
  start: string; // ISO format
  formatted: string; // "10:00 AM" or "08:00 PM"
}

export default function WorkTogetherPage() {
  const router = useRouter();
  const [returnPath, setReturnPath] = useState<string>("/");

  // Dynamic calendar month state initialized to current IST date
  const todayIST = getTodayIST();
  const [viewDate, setViewDate] = useState(() => new Date(todayIST.year, todayIST.month, 1));
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: todayIST.year,
    month: todayIST.month,
    day: todayIST.day,
  });

  // Real-time Cal.com slots
  const [calSlotsMap, setCalSlotsMap] = useState<Record<string, AvailableSlot[]>>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot>({
    start: "",
    formatted: "11:15 AM",
  });

  const [step, setStep] = useState<"slot" | "form" | "confirmed">("slot");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectBrief, setProjectBrief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    uid?: string;
    meetUrl: string;
    title?: string;
  }>({
    meetUrl: "https://meet.google.com/new",
  });
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Return path handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (from === "work") {
        setReturnPath("/work");
      } else if (from === "skills") {
        setReturnPath("/skills");
      } else if (from === "kairo") {
        setReturnPath("/work/kairo");
      } else if (from === "kai") {
        setReturnPath("/work/kai");
      } else if (from?.startsWith("/")) {
        setReturnPath(from);
      } else if (document.referrer && document.referrer.includes(window.location.host)) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.pathname !== "/work-together") {
            setReturnPath(refUrl.pathname + refUrl.search);
          }
        } catch {
          // fallback
        }
      }
    }
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (returnPath) {
      router.push(returnPath);
    } else {
      router.push("/");
    }
  };

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Dynamic calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // Format date key: YYYY-MM-DD
  const formatKey = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const selectedDateKey = formatKey(selectedDate.year, selectedDate.month, selectedDate.day);

  // Fetch real-time slots from Cal.com API for current view window
  useEffect(() => {
    let isCancelled = false;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const start = formatKey(year, month, 1);
        const end = formatKey(year, month, daysInMonth);
        const res = await fetch(`/api/cal/slots?start=${start}&end=${end}`);
        const data = await res.json();
        if (!isCancelled && data.success && data.slots) {
          setCalSlotsMap(data.slots);
        }
      } catch (err) {
        console.warn("[Cal.com Slots Fetch]", err);
      } finally {
        if (!isCancelled) setIsLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isCancelled = true;
    };
  }, [year, month, daysInMonth]);

  // Fallback default slots if Cal.com has no custom slots on that day
  const defaultFallbackSlots = useMemo(() => {
    return [
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:15 PM",
      "08:00 PM",
      "08:15 PM",
    ];
  }, []);

  // Compute available slots for selected date
  const availableSlots: AvailableSlot[] = useMemo(() => {
    const realSlots = calSlotsMap[selectedDateKey];
    if (realSlots && realSlots.length > 0) {
      return realSlots;
    }

    // Generate fallback slot ISO timestamps
    return defaultFallbackSlots.map((timeStr) => {
      const [timePart, meridiem] = timeStr.split(" ");
      const [hStr, mStr] = (timePart || "11:00").split(":");
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;

      // Convert IST to UTC timestamp
      const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
      const utcTime =
        Date.UTC(selectedDate.year, selectedDate.month, selectedDate.day, h, m, 0) - istOffsetMs;

      return {
        start: new Date(utcTime).toISOString(),
        formatted: timeStr,
      };
    });
  }, [calSlotsMap, selectedDateKey, defaultFallbackSlots, selectedDate]);

  // Auto-select first available slot when date changes
  useEffect(() => {
    if (availableSlots.length > 0) {
      const match = availableSlots.find((s) => s.formatted === selectedSlot.formatted);
      if (match) {
        setSelectedSlot(match);
      } else {
        setSelectedSlot(availableSlots[0]);
      }
    }
  }, [selectedDateKey, availableSlots]);

  const handlePrevMonth = () => {
    if (year > todayIST.year || (year === todayIST.year && month > todayIST.month)) {
      setViewDate(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isPrevDisabled =
    year < todayIST.year || (year === todayIST.year && month <= todayIST.month);

  const isPastDay = (day: number) => {
    const current = getTodayIST();
    if (year < current.year) return true;
    if (year > current.year) return false;
    if (month < current.month) return true;
    if (month > current.month) return false;
    return day < current.day;
  };

  const isSlotPast = (slot: AvailableSlot) => {
    const current = getTodayIST();
    const isToday =
      selectedDate.year === current.year &&
      selectedDate.month === current.month &&
      selectedDate.day === current.day;

    if (!isToday) {
      if (
        selectedDate.year < current.year ||
        (selectedDate.year === current.year && selectedDate.month < current.month) ||
        (selectedDate.year === current.year && selectedDate.month === current.month && selectedDate.day < current.day)
      ) {
        return true;
      }
      return false;
    }

    // Check slot timestamp against current time
    if (slot.start) {
      const slotMs = new Date(slot.start).getTime();
      return slotMs <= Date.now();
    }

    const [timePart, meridiem] = slot.formatted.split(" ");
    const [hStr, mStr] = (timePart || "10:00").split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (meridiem === "PM" && h < 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    const slotMinutes = h * 60 + m;
    const currentMinutes = current.hours * 60 + current.minutes;
    return slotMinutes <= currentMinutes;
  };

  const handleDateClick = (day: number) => {
    setSelectedDate({ year, month, day });
  };

  const isDaySelected = (day: number) => {
    return (
      selectedDate.year === year &&
      selectedDate.month === month &&
      selectedDate.day === day
    );
  };

  // Helper to get slot start Date
  const getSlotDates = () => {
    if (selectedSlot.start) {
      const start = new Date(selectedSlot.start);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
      return { start, end };
    }
    const [timePart, meridiem] = selectedSlot.formatted.split(" ");
    const [hourStr, minuteStr] = (timePart || "11:15").split(":");
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
    const slotUtcTimestamp =
      Date.UTC(selectedDate.year, selectedDate.month, selectedDate.day, hours, minutes, 0) -
      istOffsetMs;

    const start = new Date(slotUtcTimestamp);
    const end = new Date(start.getTime() + 15 * 60 * 1000);
    return { start, end };
  };

  // Confirm booking directly via Cal.com API
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setBookingError(null);

    const { start } = getSlotDates();

    try {
      const res = await fetch("/api/cal/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          start: start.toISOString(),
          brief: projectBrief,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to schedule call via Cal.com");
      }

      setConfirmedBooking({
        uid: data.booking?.uid,
        meetUrl: data.meetUrl || data.booking?.meetingUrl || "https://meet.google.com/new",
        title: data.booking?.title,
      });

      setStep("confirmed");
    } catch (err: any) {
      console.error("[Cal.com Booking Error]:", err);
      setBookingError(err?.message || "Failed to schedule meeting. Please try another slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected date formatted string
  const selectedDateFormatted = new Date(
    selectedDate.year,
    selectedDate.month,
    selectedDate.day
  ).toLocaleString("default", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const selectedShortMonth = new Date(
    selectedDate.year,
    selectedDate.month,
    1
  ).toLocaleString("default", { month: "short" });

  // Generate real Google Calendar Event template URL
  const getGoogleCalendarUrl = () => {
    const { start, end } = getSlotDates();
    const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

    const title = `15-Min Intro Call: Adarsh Verma & ${name || "Guest"}`;
    const meetUrl = confirmedBooking.meetUrl;
    const details = [
      `Introductory Call with Adarsh Verma`,
      `Attendee: ${name || "Guest"} (${email || "Not provided"})`,
      `Host: Adarsh Verma (vermaadarsh1024@gmail.com)`,
      `Timezone: India Standard Time (IST, UTC+5:30)`,
      `Google Meet / Cal Video: ${meetUrl}`,
      `Topic / Project Brief: ${projectBrief || "General introductory discussion"}`,
      `Scheduled via Cal.com: https://cal.com/adarsh-verma/intro`,
    ].join("\n");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatUtc(start)}/${formatUtc(end)}`,
      details,
      location: meetUrl,
      add: email ? `${email},vermaadarsh1024@gmail.com` : "vermaadarsh1024@gmail.com",
      ctz: "Asia/Kolkata",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate and download standard .ics calendar invite
  const handleDownloadIcs = () => {
    const { start, end } = getSlotDates();
    const formatIcs = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
    const uid = confirmedBooking.uid
      ? `${confirmedBooking.uid}@cal.com`
      : `intro-${Date.now()}@adarshverma.xyz`;

    const meetUrl = confirmedBooking.meetUrl;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Adarsh Verma//Portfolio Scheduler//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(start)}`,
      `DTEND:${formatIcs(end)}`,
      `SUMMARY:15-Min Intro Call: Adarsh Verma & ${name || "Guest"}`,
      `DESCRIPTION:Introductory Call with Adarsh Verma\\nAttendee: ${name} (${email})\\nTopic: ${projectBrief || "Introductory exploration"}\\nMeeting Link: ${meetUrl}`,
      `LOCATION:${meetUrl}`,
      "STATUS:CONFIRMED",
      "ORGANIZER;CN=Adarsh Verma:mailto:vermaadarsh1024@gmail.com",
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${name || "Guest"}:mailto:${email}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `intro-call-${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}.ics`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDirectMailtoUrl = () => {
    const subject = encodeURIComponent(
      `15-Min Intro Call: Adarsh Verma & ${name || "Guest"} (${selectedDateFormatted} at ${selectedSlot.formatted} IST)`
    );
    const body = encodeURIComponent(
      `Hi Adarsh,\n\nI would like to connect for a 15-minute call on ${selectedDateFormatted} at ${selectedSlot.formatted} IST.\n\nTopic / Brief:\n${projectBrief || "Introductory discussion"}\n\nBest,\n${name} (${email})`
    );
    return `mailto:vermaadarsh1024@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] selection:bg-[var(--accent)]/25 selection:text-[var(--accent)] relative flex flex-col items-center justify-center py-10 sm:py-16">
      {/* Extreme Left: Back Button + Heading */}
      <div
        style={{ maxWidth: "850px" }}
        className="lg:fixed lg:top-14 xl:top-16 lg:left-8 xl:left-12 2xl:left-16 z-40 flex items-center gap-2.5 sm:gap-3 select-none px-5 pt-6 sm:pt-8 lg:p-0 mb-6 lg:mb-0 w-full lg:w-auto"
      >
        <Link
          href={returnPath}
          onClick={handleBack}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/15 bg-[#0E0E0E] hover:bg-[#181818] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer group shrink-0 shadow-sm"
          aria-label="Back"
          title="Back"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>

        <Link
          href={returnPath}
          onClick={handleBack}
          className="cursor-pointer group"
          title="Back"
        >
          <h1 className="text-base sm:text-lg font-medium tracking-tight text-[#EDEDEA] group-hover:text-white transition-colors">
            Work together
          </h1>
        </Link>
      </div>

      {/* Centered Content: Dead center of the viewport */}
      <main style={{ maxWidth: "800px" }} className="w-full px-5 sm:px-6">
        <div className="w-full rounded-2xl bg-[#0E0E0E] shadow-2xl overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] min-h-[580px] sm:min-h-[600px]">
            {/* Left Column: Meeting Info & Host Profile (compact height on mobile, full height on desktop) */}
            <div className="md:col-span-5 p-5 sm:p-7 space-y-4 md:space-y-6 flex flex-col justify-between bg-[#0A0A0A] min-h-0 md:min-h-[580px] lg:min-h-[600px]">
              <div className="space-y-4">
                {/* Host Badge */}
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundImage: `url(${avatarBase64})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="w-11 h-11 rounded-full border border-white/15 shrink-0 bg-[#141414]"
                    role="img"
                    aria-label={siteContent.name}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-[#EDEDEA]">
                      {siteContent.name}
                    </h3>
                  </div>
                </div>

                {/* Event Title */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                    Introductory Call
                  </h2>
                  <p className="text-xs text-[#8A8A85] mt-1 leading-relaxed">
                    A brief intro to meet, understand your project goals, and see if there is a mutual fit.
                  </p>
                </div>

                {/* Meta details */}
                <div className="space-y-2.5 pt-2 text-xs text-[#8A8A85] font-sans">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-[#8A8A85]" />
                    <span>15 mins</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Video className="w-3.5 h-3.5 text-[#8A8A85]" />
                    <span>Google Meet</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-[#8A8A85]" />
                    <span>India Standard Time (IST, UTC+5:30)</span>
                  </div>
                </div>
              </div>

              {/* Direct Email Fallback */}
              <div className="pt-4 border-t border-white/[0.08]">
                <p className="text-[11px] font-sans text-[#8A8A85] mb-2">
                  Prefer direct email instead?
                </p>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 text-xs text-[var(--accent)] hover:text-[var(--accent-light)] font-sans transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8A8A85]" />
                  <span>{siteContent.email}</span>
                  {copiedEmail && (
                    <span className="text-[10px] text-green-400 font-semibold">
                      (Copied!)
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Booking Flow */}
            <div className="md:col-span-7 p-6 sm:p-7 bg-[#0E0E0E] flex flex-col justify-between min-h-[580px] sm:min-h-[600px]">
              {step === "slot" && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Calendar Header with working month navigation */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#EDEDEA] font-sans">
                      {monthName} {year}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isPrevDisabled}
                        className={`p-1.5 rounded-lg border border-white/10 transition-colors ${
                          isPrevDisabled
                            ? "opacity-30 cursor-not-allowed text-[#8A8A85]"
                            : "hover:bg-white/[0.08] text-[#EDEDEA] cursor-pointer"
                        }`}
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg border border-white/10 hover:bg-white/[0.08] text-[#EDEDEA] transition-colors cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day Picker Grid */}
                  <div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {daysOfWeek.map((d) => (
                        <div
                          key={d}
                          className="text-[11px] font-medium text-[#8A8A85] font-sans py-1"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Empty filler cells before the first day of month */}
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8" />
                      ))}

                      {/* Day cells */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const disabled = isPastDay(day);
                        const selected = isDaySelected(day);

                        return (
                          <button
                            key={`day-${day}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDateClick(day)}
                            className={`h-8 rounded-lg text-xs font-sans transition-all flex items-center justify-center relative ${
                              disabled
                                ? "text-[#8A8A85]/30 cursor-not-allowed"
                                : selected
                                ? "bg-[var(--accent)] text-white font-semibold shadow-md shadow-indigo-950/50 cursor-pointer"
                                : "text-[#EDEDEA] hover:bg-white/[0.08] cursor-pointer"
                            }`}
                          >
                            <span>{day}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Selector */}
                  <div className="pt-2 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-medium text-[#8A8A85] font-sans flex items-center gap-1.5">
                        <span>Available Times ({selectedShortMonth} {selectedDate.day})</span>
                        {isLoadingSlots && (
                          <div className="w-2.5 h-2.5 rounded-full border border-white/20 border-t-white animate-spin" />
                        )}
                      </span>
                      <span className="text-[11px] text-[var(--accent)] font-sans">
                        IST (UTC+5:30)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-0.5">
                      {availableSlots.map((slot) => {
                        const isPast = isSlotPast(slot);
                        const isSelected = selectedSlot.formatted === slot.formatted;

                        return (
                          <button
                            key={slot.start || slot.formatted}
                            type="button"
                            disabled={isPast}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-sans text-center transition-all ${
                              isPast
                                ? "border border-white/5 bg-transparent text-[#8A8A85]/30 cursor-not-allowed line-through"
                                : isSelected
                                ? "bg-white text-black font-semibold shadow-sm cursor-pointer"
                                : "border border-white/10 hover:border-white/25 text-[#EDEDEA] bg-[#141414] hover:bg-[#1A1A1A] cursor-pointer"
                            }`}
                          >
                            {slot.formatted}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-950/40"
                    >
                      Next: Enter Your Details →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Form */}
              {step === "form" && (
                <motion.form
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleConfirmBooking}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("slot");
                          setBookingError(null);
                        }}
                        className="text-xs font-sans text-[#8A8A85] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-[#8A8A85]" />
                        <span>Back to calendar</span>
                      </button>
                      <span className="text-xs font-sans text-[#EDEDEA]">
                        {selectedShortMonth} {selectedDate.day}, {selectedSlot.formatted} IST
                      </span>
                    </div>

                    {bookingError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-sans leading-relaxed">
                        {bookingError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-sans text-[#8A8A85]">
                        Your name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-xs sm:text-sm text-[#EDEDEA] placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-sans text-[#8A8A85]">
                        Your email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-xs sm:text-sm text-[#EDEDEA] placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-sans text-[#8A8A85]">
                        Project brief or discussion topic (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={projectBrief}
                        onChange={(e) => setProjectBrief(e.target.value)}
                        placeholder="discussing MVP timelines, architecture, or collaboration..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-xs sm:text-sm text-[#EDEDEA] placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-950/40 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Scheduling</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm & Schedule Meeting</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Confirmed Screen */}
              {step === "confirmed" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center mx-auto shadow-lg text-emerald-400">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>

                  <div>
                    <p className="text-sm text-emerald-400/90 mt-1 font-sans">
                      Meeting is scheduled and invitations are sent to{" "}
                      <span className="text-white font-medium">{email}</span> and{" "}
                      <span className="text-white font-medium">vermaadarsh1024@gmail.com</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#141414] border border-white/10 text-xs text-left space-y-2.5 max-w-sm mx-auto font-sans">
                    <div className="flex items-center gap-2 text-white">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>{selectedDateFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8A8A85]">
                      <Clock className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>{selectedSlot.formatted} IST (15 mins)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A8A85]">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-[#8A8A85]" />
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 flex-wrap">
                    <div className="w-full">
                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-sans text-white font-semibold transition-all shadow-md cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-sans text-white transition-all cursor-pointer"
                    >
                      <span>Download .ics file</span>
                    </button>

                    <a
                      href={getDirectMailtoUrl()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-[#8A8A85] hover:text-white transition-all cursor-pointer"
                    >
                      <Mail className="w-3 h-3 text-[#8A8A85]" />
                      <span>Email Adarsh Direct</span>
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("slot");
                        setName("");
                        setEmail("");
                        setProjectBrief("");
                        setBookingError(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-sans text-[#8A8A85] hover:text-white transition-colors cursor-pointer"
                    >
                      Book another slot
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
