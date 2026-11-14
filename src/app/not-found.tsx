import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-[#EDEDEA] flex flex-col items-center justify-center px-6 py-12 select-none relative overflow-hidden">
      <div className="space-y-6 text-center max-w-lg mx-auto">
        <span className="text-[11px]  font-mono-custom tracking-[0.2em] uppercase text-[#8A8A85]">
          404
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white font-sans">
          Looks like you're lost
        </h1>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono-custom text-[#8A8A85] hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>return to main page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
