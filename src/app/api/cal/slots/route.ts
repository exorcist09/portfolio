import { NextResponse } from "next/server";
import { fetchCalSlots } from "@/lib/cal";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const today = new Date();
    const defaultStart = today.toISOString().split("T")[0];
    const defaultEnd = new Date(today.getTime() + 14 * 86400000)
      .toISOString()
      .split("T")[0];

    const start = searchParams.get("start") || defaultStart;
    const end = searchParams.get("end") || defaultEnd;

    const slots = await fetchCalSlots(start, end);

    return NextResponse.json({
      success: true,
      slots,
    });
  } catch (error: any) {
    console.error("[Slots API Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
