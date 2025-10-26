import {
  UserIcon,
  Code,
  Parentheses,
  Braces,
  GithubIcon,
  Linkedin,
  House,
  Target,
  Mail,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

import Link from "next/link";

import { Dock, DockIcon } from "../components/magicui/dock";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Clouds */}
      <div className="absolute top-20 right-20">
        <Code className="w-32 h-32 text-gray-200" />
      </div>
      <div className="absolute bottom-40 left-20">
        <Parentheses className="w-24 h-24 text-gray-200 sm:hidden " />
      </div>
      <div className="absolute top-1/2 right-1/5">
        <Braces className="w-40 h-40 text-gray-200" />
      </div>
      <div className="absolute bottom-20 right-32">
        <Code className="w-36 h-36 text-gray-200 sm:hidden" />
      </div>
      <div className="absolute top-40 left-1/4">
        <Braces className="w-28 h-28 text-gray-200" />
      </div>

      <div className="flex items-center justify-center w-full pt-6 px-4 sm:px-0">
        <div className=" flex items-center justify-center w-full sm:w-[80%]  bg-white/50 backdrop-blur-sm">
          <header className="flex  flex-col sm:flex-row justify-between items-center p-4 sm:p-6">
            <div
              className=" text-xl sm:text-2xl font-black uppercase mb-2 sm:mb-0 "
              style={{ fontFamily: "var(--font-dela-gothic)" }}
            >
              Adarsh Verma
            </div>
          </header>
        </div>
      </div>

      {/* Main Hero Content - Styled like the image */}
      <main className=" grid-cols-1 md:grid-cols-5 flex items-center justify-center px-6 sm:px-12 md:px-24 lg:px-32 min-h-[80vh] relative pt-10 sm:pt-0">
        {/* Hero Text - Left-aligned like in the image - Taking 3 columns */}
        <div className="md:col-span-3">
          <p
            className="text-lg sm:text-xl mb-1 sm:mb-1 text-gray-500"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            What I do is,
          </p>

          <h1 className="text-4xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.9] mb-4 sm:mb-6">
            Development
            <br />
            Design
            <br />
            AI/ML
          </h1>
          <p
            className="text-lg sm:text-xl mb-8 sm:mb-10"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <span className="text-gray-500">and more and more code ...</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex gap-4">
              <Link
                href="https://github.com/exorcist09"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300">
                  <GithubIcon className="h-5 w-5" />
                </div>
              </Link>

              <Link
                href="https://linkedin.com/in/adarsh-verma-exorcist09"
                target="_blank"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300">
                  <Linkedin className="h-5 w-5" />
                </div>
              </Link>
              <Link href="https://leetcode.com/exorcist09" target="_blank">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors border border-gray-300">
                  <Image
                    src="/img/leetcode.svg"
                    alt="leetcode"
                    className="h-5 w-5"
                    width={500} height={300}
                  />
                </div>
              </Link>
            </div>

            <Link
              href="/projects"
              className="inline-block rounded-button px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 bg-white hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2">
                <span>Projects</span>
              </div>
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-button px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 bg-white hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2">
                <span>Get in Touch</span>
              </div>
            </Link>
            <a
              href="\docs\AdarshVerma_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-button px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 bg-white hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2">
                <span>Resume</span>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Dock at the bottom */}
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Dock className="gap-8 backdrop-blur-md bg-white dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 shadow-lg rounded-xl px-4 py-2 flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="group transition-transform duration-300 "
                >
                  <DockIcon isActive={true}>
                    <House className="h-5 w-5" />
                  </DockIcon>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/about"
                  className="group transition-transform duration-300 hover:scale-150"
                >
                  <DockIcon>
                    <UserIcon className="h-5 w-5" />
                  </DockIcon>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>About / Skills</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/projects"
                  className="group transition-transform duration-300 hover:scale-150"
                >
                  <DockIcon>
                    <Target className="h-5 w-5" />
                  </DockIcon>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Projects</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/contact"
                  className="group transition-transform duration-300 hover:scale-150"
                >
                  <DockIcon>
                    <Mail className="h-5 w-5" />
                  </DockIcon>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Dock>
      </div>
    </div>
  );
}
