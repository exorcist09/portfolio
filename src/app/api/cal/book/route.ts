import { NextResponse } from "next/server";
import { createCalBooking } from "@/lib/cal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, start, brief, apiKey } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!start) {
      return NextResponse.json(
        { success: false, error: "Booking start slot is required." },
        { status: 400 }
      );
    }

    const result = await createCalBooking({
      start,
      name,
      email,
      brief,
      overrideKey: apiKey,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: result.booking,
      meetUrl: result.meetUrl,
    });
  } catch (error: any) {
    console.error("[Cal Booking API Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal booking error" },
      { status: 500 }
    );
  }
}
