"use client";

import { useState } from "react";
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
} from "lucide-react";
import { avatarBase64 } from "@/data/avatarBase64";
import { siteContent } from "@/data/content";

export default function WorkTogetherPage() {
  const router = useRouter();

  // Dynamic calendar month state (defaults to November 2026)
  const [viewDate, setViewDate] = useState(new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: 2026,
    month: 10,
    day: 17,
  });
  const [selectedTime, setSelectedTime] = useState<string>("11:15 AM");
  const [step, setStep] = useState<"slot" | "form" | "confirmed">("slot");

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectBrief, setProjectBrief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // 15-minute introductory call slots
  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:15 PM",
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Dynamic calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Formatted Month Title e.g. "November 2026"
  const monthTitle = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Number of days in current viewing month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // First day of week index (Monday = 0, Sunday = 6)
  const firstDayRaw = new Date(year, month, 1).getDay();
  const emptyDays = (firstDayRaw + 6) % 7;

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Can only go back as far as current month
  const isPrevDisabled = year === 2026 && month <= 10;

  const handleDateClick = (day: number) => {
    setSelectedDate({ year, month, day });
    if (!selectedTime) {
      setSelectedTime("11:15 AM");
    }
  };

  const isDaySelected = (day: number) => {
    return (
      selectedDate.year === year &&
      selectedDate.month === month &&
      selectedDate.day === day
    );
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          date: `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`,
          time: selectedTime,
          brief: projectBrief,
        }),
      });
    } catch (err) {
      console.warn("API booking dispatch warning:", err);
    } finally {
      setIsSubmitting(false);
      setStep("confirmed");
    }
  };

  // Helper to parse slot into JS Date objects
  const getSlotDates = () => {
    const [timePart, meridiem] = selectedTime.split(" ");
    const [hourStr, minuteStr] = (timePart || "11:15").split(":");
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    const start = new Date(selectedDate.year, selectedDate.month, selectedDate.day, hours, minutes, 0);
    const end = new Date(start.getTime() + 15 * 60 * 1000); // 15 mins
    return { start, end };
  };

  // Generate real Google Calendar Event template URL
  const getGoogleCalendarUrl = () => {
    const { start, end } = getSlotDates();
    const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

    const title = `15-Min Intro Call: Adarsh Verma & ${name || "Guest"}`;
    const details = [
      `Introductory Call booked via portfolio`,
      `Attendee: ${name} (${email})`,
      `Host: Adarsh Verma (vermaadarsh1024@gmail.com)`,
      `Project Brief: ${projectBrief || "None specified"}`,
      `Platform: Google Meet`,
    ].join("\n");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatUtc(start)}/${formatUtc(end)}`,
      details,
      location: "Google Meet",
      add: "vermaadarsh1024@gmail.com",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate and download standard .ics calendar invite
  const handleDownloadIcs = () => {
    const { start, end } = getSlotDates();
    const formatIcs = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
    const uid = `intro-${Date.now()}@adarshverma.xyz`;

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
      `DESCRIPTION:Introductory Call with Adarsh Verma\\nAttendee: ${name} (${email})\\nTopic: ${projectBrief || "Introductory exploration"}`,
      "LOCATION:Google Meet",
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
    link.setAttribute("download", `intro-call-adarsh-verma-${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Direct mailto link to Adarsh
  const getDirectMailtoUrl = () => {
    const subject = encodeURIComponent(`15-Min Intro Call: ${name || "Client"} (${selectedDateFormatted} at ${selectedTime})`);
    const body = encodeURIComponent(
      `Hi Adarsh,\n\nI have scheduled an introductory call with you for ${selectedDateFormatted} at ${selectedTime}.\n\nName: ${name}\nEmail: ${email}\nTopic / Brief: ${projectBrief || "Introductory fit"}\n\nLooking forward to speaking with you!`
    );
    return `mailto:vermaadarsh1024@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteContent.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
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

  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] selection:bg-[var(--accent)]/25 selection:text-[var(--accent)] relative flex flex-col items-center justify-center py-10 sm:py-16">
      {/* Extreme Left: Back Button + Heading (pinned out of center space) */}
      <div className="lg:fixed lg:top-14 xl:top-16 lg:left-8 xl:left-12 2xl:left-16 z-40 flex items-center gap-2.5 sm:gap-3 select-none px-5 pt-6 sm:pt-8 lg:p-0 mb-6 lg:mb-0 w-full max-w-[760px] lg:w-auto">
        <Link
          href="/"
          onClick={handleBack}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/15 bg-[#0E0E0E] hover:bg-[#181818] hover:border-white/30 flex items-center justify-center text-[#8A8A85] hover:text-white transition-all cursor-pointer group shrink-0 shadow-sm"
          aria-label="Back to home page"
          title="Back to home"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>

        <h1 className="text-base sm:text-lg font-medium tracking-tight text-[#EDEDEA]">
          Work together
        </h1>
      </div>

      {/* Centered Content: Dead center of the viewport */}
      <main className="w-full max-w-[760px] px-5 sm:px-6">
        {/* Booking Card: External Cal Embed or Interactive Custom Calendar */}
        {siteContent.calUrl ? (
          <div className="rounded-2xl bg-[#0E0E0E] shadow-2xl overflow-hidden min-h-[600px]">
            <iframe
              src={siteContent.calUrl}
              className="w-full h-[600px] border-0"
              title="Schedule a Call"
            />
          </div>
        ) : (
          <div className="w-full rounded-2xl bg-[#0E0E0E] shadow-2xl overflow-hidden text-left">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] min-h-[580px] sm:min-h-[600px]">
              {/* Left Column: Meeting Info & Host Profile */}
              <div className="md:col-span-5 p-6 sm:p-7 space-y-6 flex flex-col justify-between bg-[#0A0A0A] min-h-[580px] sm:min-h-[600px]">
                <div className="space-y-4">
                  {/* Host Badge: Only Adarsh Verma (title removed as requested) */}
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

                  {/* Event Title: 15-Min Introductory Call */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                      15-Min Introductory Call
                    </h2>
                    <p className="text-xs text-[#8A8A85] mt-1 leading-relaxed">
                      A brief intro to meet, understand your project goals, and see if there is a mutual fit.
                    </p>
                  </div>

                  {/* Meta details with grey icons */}
                  <div className="space-y-2.5 pt-2 text-xs text-[#8A8A85] font-sans">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>15 mins</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Video className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>Google Meet (web link provided)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>Auto-detected timezone</span>
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
                        {monthTitle}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={isPrevDisabled}
                          aria-label="Previous month"
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${isPrevDisabled
                            ? "text-white/20 border-white/[0.04] cursor-not-allowed"
                            : "text-[#8A8A85] hover:text-white border-white/10 hover:border-white/20 cursor-pointer"
                            }`}
                        >
                          <ChevronLeft className="w-4 h-4 text-[#8A8A85]" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          aria-label="Next month"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8A85] hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 text-[#8A8A85]" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid with font-sans (Inter) */}
                    <div>
                      {/* Day Names */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {daysOfWeek.map((day) => (
                          <span
                            key={day}
                            className="text-[10px] font-sans text-[#8A8A85] font-semibold py-1"
                          >
                            {day}
                          </span>
                        ))}
                      </div>

                      {/* Date Numbers in font-sans (Inter) */}
                      <div className="grid grid-cols-7 gap-1 text-center font-sans">
                        {/* Empty padding cells for first day alignment */}
                        {Array.from({ length: emptyDays }).map((_, i) => (
                          <div key={`empty-${i}`} className="h-8 sm:h-9" />
                        ))}

                        {/* Day numbers */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = isDaySelected(day);
                          const isPast =
                            year === 2026 && month === 10 && day < 13;

                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={isPast}
                              onClick={() => handleDateClick(day)}
                              className={`h-8 sm:h-9 rounded-lg text-xs font-sans transition-all flex items-center justify-center ${isPast
                                ? "text-white/20 cursor-not-allowed"
                                : isSelected
                                  ? "bg-[var(--accent)] text-white font-bold shadow-md shadow-indigo-950/40"
                                  : "text-[#EDEDEA] hover:bg-white/[0.08] hover:text-white cursor-pointer"
                                }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots Section: 15-minute intervals */}
                    <div className="pt-4 border-t border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-[#8A8A85] uppercase tracking-wider">
                          Available Slots for {selectedShortMonth} {selectedDate.day}
                        </span>
                        <span className="text-[11px] font-sans text-[#8A8A85]">
                          15m each
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-2 rounded-lg text-xs font-sans border transition-all cursor-pointer ${isSelected
                                ? "bg-[var(--accent)] border-[var(--accent-light)] text-white font-semibold shadow-md"
                                : "bg-[#141414] border-white/[0.08] text-[#EDEDEA] hover:border-white/20 hover:bg-[#1A1A1A]"
                                }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next step button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setStep("form")}
                          disabled={!selectedDate || !selectedTime}
                          className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-950/40"
                        >
                          Next: Enter Your Details →
                        </button>
                      </div>
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
                          onClick={() => setStep("slot")}
                          className="text-xs font-sans text-[#8A8A85] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 text-[#8A8A85]" />
                          <span>Back to calendar</span>
                        </button>
                        <span className="text-xs font-sans text-[#EDEDEA]">
                          {selectedShortMonth} {selectedDate.day}, {selectedTime}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-sans text-[#8A8A85]">
                          Your Name *
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
                          Work Email *
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
                          Project Brief or Discussion Topic (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={projectBrief}
                          onChange={(e) => setProjectBrief(e.target.value)}
                          placeholder="E.g., discussing MVP timelines, architecture, or collaboration..."
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
                          <span>Scheduling...</span>
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

                {/* Step 3: Confirmed Screen with grey icons */}
                {step === "confirmed" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-5 flex-1 flex flex-col justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/30">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        You are scheduled!
                      </h3>
                      <p className="text-xs text-[#8A8A85] mt-1 font-sans">
                        A calendar invitation has been sent to{" "}
                        <span className="text-white font-medium">{email}</span>.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#141414] border border-white/10 text-xs text-left space-y-2 max-w-sm mx-auto font-sans">
                      <div className="flex items-center gap-2 text-white">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#8A8A85]" />
                        <span>{selectedDateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8A8A85]">
                        <Clock className="w-3.5 h-3.5 text-[#8A8A85]" />
                        <span>{selectedTime} (15 mins)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8A8A85]">
                        <Video className="w-3.5 h-3.5 text-[#8A8A85]" />
                        <span>Google Meet video call</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 flex-wrap">
                      <a
                        href={getGoogleCalendarUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-xs font-sans text-white font-semibold transition-all shadow-md cursor-pointer"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Add to Google Calendar (Meet)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

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
        )}
      </main>
    </div>
  );
}
