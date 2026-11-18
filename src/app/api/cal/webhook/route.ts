import { NextResponse } from "next/server";

/**
 * Cal.com Webhook Handler
 * Documentation: https://cal.com/help/webhooks
 *
 * Supported trigger events:
 * - BOOKING_CREATED: Triggered when a new booking is scheduled
 * - BOOKING_RESCHEDULED: Triggered when a booking is moved
 * - BOOKING_CANCELLED: Triggered when a booking is cancelled
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { triggerEvent, createdAt, payload: bookingData } = payload;

    console.log(`[Cal.com Webhook] Event: ${triggerEvent} received at ${createdAt}`);

    switch (triggerEvent) {
      case "BOOKING_CREATED":
        console.log("[Cal.com Webhook] New booking scheduled:", {
          uid: bookingData?.uid,
          title: bookingData?.title,
          start: bookingData?.startTime,
          attendees: bookingData?.attendees,
          meetLocation: bookingData?.location,
        });
        break;

      case "BOOKING_CANCELLED":
        console.log("[Cal.com Webhook] Booking cancelled:", bookingData?.uid);
        break;

      case "BOOKING_RESCHEDULED":
        console.log("[Cal.com Webhook] Booking rescheduled:", {
          uid: bookingData?.uid,
          newStart: bookingData?.startTime,
        });
        break;

      default:
        console.log(`[Cal.com Webhook] Unhandled event type: ${triggerEvent}`);
    }

    return NextResponse.json({
      status: "success",
      received: true,
      event: triggerEvent,
    });
  } catch (error: any) {
    console.error("[Cal.com Webhook Error]:", error);
    return NextResponse.json(
      { status: "error", message: error?.message || "Invalid webhook payload" },
      { status: 400 }
    );
  }
}
