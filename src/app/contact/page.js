"use client";

import {
  UserIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  ArrowRightIcon,
  House,
  Target,
  Mail,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code, Parentheses, Braces } from "lucide-react";
import Link from "next/link";

import { Dock, DockIcon } from "@/components/magicui/dock";
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { SquaresExcludeIcon } from "lucide-react";

export default function Contact() {
  // Use the hook to fix scrolling issues
  useScrollRestoration();

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Clouds */}
      <div className="absolute top-20 right-20">
        <Code className="w-32 h-32 text-gray-200" />
      </div>
      <div className="absolute bottom-40 left-20">
        <Parentheses className="w-24 h-24 text-gray-200" />
      </div>
      <div className="absolute top-1/2 right-1/5">
        <Braces className="w-40 h-40 text-gray-200/40" />
      </div>
      <div className="absolute bottom-20 right-32">
        <Code className="w-36 h-36 text-gray-200" />
      </div>
      <div className="absolute top-40 left-1/12">
        <Braces className="w-28 h-28 text-gray-200" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-center w-full pt-10 px-4 sm:px-0">
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

      {/* Main Content */}
      <main className="grid grid-cols-1 px-6 sm:px-12 md:px-24 lg:px-32 min-h-[80vh] relative py-10 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[0.9] mb-12 sm:mb-16">
            Contact Me
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Left side - Contact form */}
            <div className="bg-white/50 backdrop-blur-sm border border-black rounded-lg p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                <SquaresExcludeIcon />
              </h2>

              <form
                className="space-y-6"
                action="https://formsubmit.co/vermaadarsh1024@gmail.com"
                method="POST"
              >
                <input type="text" name="_honey" style={{ display: "none" }} />
                <input
                  type="hidden"
                  name="_next"
                  value={process.env.NEXT_PUBLIC_REDIRECT_URL}
                />

                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    name="message"
                    required
                    className="w-full px-4 py-3 bg-white border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <span>Send Message</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right side - Social links */}
            <div className="space-y-8 ">
              <div className="text-2xl sm:text-3xl mb-8 text-gray-500">
                Let&apos;s
                <br />
                Connect
                <br />
                Here <span className="mt-6">↴</span>
              </div>

              <div className="space-y-6 mb-16">
                {/* GitHub */}
                <a
                  href="https://github.com/exorcist09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <GithubIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">GitHub</h3>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/adarsh-verma-exorcist09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <LinkedinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">LinkedIn</h3>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Gmail */}
                <a
                  href="mailto:vermaadarsh1024@gmail.com"
                  className="flex items-center gap-4 p-4 border border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <MailIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Email</h3>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
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
                  className="group transition-transform duration-300 hover:scale-150"
                >
                  <DockIcon>
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
                  className="group transition-transform duration-300 "
                >
                  <DockIcon isActive={true}>
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
