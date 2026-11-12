"use client";

export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full select-none pointer-events-none py-2 ${className}`}
      aria-hidden="true"
    >
      {/* 3 slim rows of dots spanning edge-to-edge to touch the plus frame on both sides */}
      <div className="relative h-5 sm:h-6 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
}
