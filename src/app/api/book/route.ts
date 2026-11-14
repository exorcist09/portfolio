import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, time, brief } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    console.log("[Booking Received]:", {
      name,
      email,
      date,
      time,
      brief,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Call booking registered",
      data: { name, email, date, time, brief },
    });
  } catch (error) {
    console.error("[Booking Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
