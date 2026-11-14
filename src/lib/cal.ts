export const CAL_EVENT_TYPE_ID = parseInt(
  process.env.CAL_EVENT_TYPE_ID || "",
  10
);

export function getCalApiKey(overrideKey?: string): string {
  return (
    overrideKey?.trim() ||
    process.env.CAL_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_CAL_API_KEY?.trim() ||
    ""
  );
}

export interface CalSlotItem {
  start: string; // ISO string, e.g. "2026-11-17T20:00:00.000+05:30"
  formatted: string; // e.g. "08:00 PM"
}

export interface CalSlotsMap {
  [dateString: string]: CalSlotItem[];
}

/**
 * Format ISO string to 12-hour AM/PM in IST
 */
export function formatSlotToTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

/**
 * Fetch real availability slots from Cal.com API v2
 */
export async function fetchCalSlots(
  startStr: string, // "YYYY-MM-DD"
  endStr: string, // "YYYY-MM-DD"
  overrideKey?: string
): Promise<CalSlotsMap> {
  const apiKey = getCalApiKey(overrideKey);
  if (!apiKey) {
    console.warn("Missing CAL_API_KEY, returning empty slots map");
    return {};
  }

  try {
    const url = `https://api.cal.com/v2/slots?eventTypeId=${CAL_EVENT_TYPE_ID}&start=${encodeURIComponent(
      startStr
    )}&end=${encodeURIComponent(endStr)}&timeZone=Asia/Kolkata`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-09-04",
        "Content-Type": "application/json",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.warn(`[Cal.com Slots] HTTP ${res.status}:`, await res.text());
      return {};
    }

    const data = await res.json();
    const rawMap = data?.data || {};
    const slotsMap: CalSlotsMap = {};

    for (const [dateKey, slotList] of Object.entries(rawMap)) {
      if (Array.isArray(slotList)) {
        slotsMap[dateKey] = slotList.map((s: any) => ({
          start: s.start,
          formatted: formatSlotToTime(s.start),
        }));
      }
    }

    return slotsMap;
  } catch (err: any) {
    console.error("[Cal.com Slots Fetch Error]:", err);
    return {};
  }
}

export interface CreateBookingParams {
  start: string; // ISO 8601 string in UTC or offset
  name: string;
  email: string;
  brief?: string;
  overrideKey?: string;
}

export interface CalBookingResult {
  success: boolean;
  booking?: any;
  meetUrl?: string;
  error?: string;
}

/**
 * Create a booking directly via Cal.com API v2
 */
export async function createCalBooking(
  params: CreateBookingParams
): Promise<CalBookingResult> {
  const apiKey = getCalApiKey(params.overrideKey);

  if (!apiKey) {
    return {
      success: false,
      error:
        "Cal.com API key is not configured. Add cal api to env to enable real-time booking.",
    };
  }

  try {
    const payload = {
      eventTypeId: CAL_EVENT_TYPE_ID,
      start: params.start,
      attendee: {
        name: params.name,
        email: params.email,
        timeZone: "Asia/Kolkata",
      },
      metadata: {
        brief: params.brief || "Introductory exploration",
        source: "portfolio-website-ui",
      },
    };

    const res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2026-05-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || (data.status && data.status !== "success")) {
      const errorMsg =
        data?.message ||
        data?.error?.message ||
        data?.error?.details?.message ||
        `Cal.com booking returned HTTP ${res.status}`;

      return {
        success: false,
        error: errorMsg,
      };
    }

    const booking = data.data || data;
    const meetUrl =
      booking.meetingUrl ||
      booking.location ||
      (booking.uid ? `https://app.cal.com/video/${booking.uid}` : "https://meet.google.com/new");

    return {
      success: true,
      booking,
      meetUrl,
    };
  } catch (err: any) {
    console.error("[Cal.com Create Booking Error]:", err);
    return {
      success: false,
      error: err?.message || "Failed to reach Cal.com API",
    };
  }
}
