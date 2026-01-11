"use client";

import {
  UserIcon,
  Target,
  Mail,
  FileTextIcon,
  House,
  Code,
  Braces,
  Parentheses,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dock, DockIcon } from "@/components/magicui/dock";
import useScrollRestoration from "@/hooks/useScrollRestoration";

export default function About() {
  useScrollRestoration();

  const skills = [
    { src: "/img/java.png", alt: "Java", tag: "Java", link: "#" },
    { src: "/img/python.webp", alt: "Python", tag: "Python", link: "#" },
    { src: "/img/cplusplus.png", alt: "C++", tag: "C++", link: "#" },
    { src: "/img/html.png", alt: "HTML", tag: "HTML", link: "#" },
    {
      src: "/img/javascript.png",
      alt: "JavaScript",
      tag: "JavaScript",
      link: "#",
    },
    {
      src: "/img/typescript.png",
      alt: "TypeScript",
      tag: "TypeScript",
      link: "#",
    },
    { src: "/img/css.png", alt: "CSS", tag: "CSS", link: "#" },
    { src: "/img/react.png", alt: "React", tag: "React", link: "#" },
    { src: "/img/nodejs.png", alt: "Node.js", tag: "Node.js", link: "#" },
    {
      src: "/img/express.png",
      alt: "Express.js",
      tag: "Express.js",
      link: "#",
    },
    { src: "/img/mongodb.png", alt: "MongoDB", tag: "MongoDB", link: "#" },
    { src: "/img/mysql.png", alt: "MySQL", tag: "MySQL", link: "#" },
    { src: "/img/nextjs.png", alt: "Next.js", tag: "Next.js", link: "#" },
    { src: "/img/redux.png", alt: "Redux", tag: "Redux", link: "#" },
    { src: "/img/zustand.jpeg", alt: "Zustand", tag: "Zustand", link: "#" },
    {
      src: "/img/tailwind.png",
      alt: "TailwindCSS",
      tag: "TailwindCSS",
      link: "#",
    },
    {
      src: "/img/bootstrap.png",
      alt: "Bootstrap",
      tag: "BootStrap",
      link: "#",
    },
    {
      src: "/img/springboot.png",
      alt: "SpringBoot",
      tag: "SpringBoot",
      link: "#",
    },
    { src: "/img/npm.png", alt: "npm", tag: "npm", link: "#" },
    { src: "/img/postman.png", alt: "Postman", tag: "Postman", link: "#" },
    { src: "/img/vscode.png", alt: "VsCode", tag: "Vscode", link: "#" },
    { src: "/img/git.png", alt: "Git", tag: "Git", link: "#" },
    { src: "/img/GitHub.png", alt: "GitHub", tag: "GitHub", link: "#" },
    { src: "/img/linux.jpeg", alt: "Linux", tag: "Linux", link: "#" },
    { src: "/img/numpy.png", alt: "Numpy", tag: "Numpy", link: "#" },
    { src: "/img/pandas.png", alt: "Pandas", tag: "Pandas", link: "#" },
    { src: "/img/pytorch.png", alt: "Pytorch", tag: "Pytorch", link: "#" },
    { src: "/img/sklearn.png", alt: "SKLearn", tag: "SKLearn", link: "#" },
  ];

    const experience = [
    { src: "/img/java.png", alt: "Java", tag: "Java", link: "#" },
    { src: "/img/python.webp", alt: "Python", tag: "Python", link: "#" },
    { src: "/img/cplusplus.png", alt: "C++", tag: "C++", link: "#" },
    { src: "/img/html.png", alt: "HTML", tag: "HTML", link: "#" },
    {
      src: "/img/javascript.png",
      alt: "JavaScript",
      tag: "JavaScript",
      link: "#",
    },
    {
      src: "/img/typescript.png",
      alt: "TypeScript",
      tag: "TypeScript",
      link: "#",
    },
    { src: "/img/css.png", alt: "CSS", tag: "CSS", link: "#" },
    { src: "/img/react.png", alt: "React", tag: "React", link: "#" },
    { src: "/img/nodejs.png", alt: "Node.js", tag: "Node.js", link: "#" },
    {
      src: "/img/express.png",
      alt: "Express.js",
      tag: "Express.js",
      link: "#",
    },
    { src: "/img/mongodb.png", alt: "MongoDB", tag: "MongoDB", link: "#" },
    { src: "/img/mysql.png", alt: "MySQL", tag: "MySQL", link: "#" },
    { src: "/img/nextjs.png", alt: "Next.js", tag: "Next.js", link: "#" },
    { src: "/img/redux.png", alt: "Redux", tag: "Redux", link: "#" },
    { src: "/img/zustand.jpeg", alt: "Zustand", tag: "Zustand", link: "#" },
    {
      src: "/img/tailwind.png",
      alt: "TailwindCSS",
      tag: "TailwindCSS",
      link: "#",
    },
    {
      src: "/img/bootstrap.png",
      alt: "Bootstrap",
      tag: "BootStrap",
      link: "#",
    },
    {
      src: "/img/springboot.png",
      alt: "SpringBoot",
      tag: "SpringBoot",
      link: "#",
    },
    { src: "/img/npm.png", alt: "npm", tag: "npm", link: "#" },
    { src: "/img/postman.png", alt: "Postman", tag: "Postman", link: "#" },
    { src: "/img/vscode.png", alt: "VsCode", tag: "Vscode", link: "#" },
    { src: "/img/git.png", alt: "Git", tag: "Git", link: "#" },
    { src: "/img/GitHub.png", alt: "GitHub", tag: "GitHub", link: "#" },
    { src: "/img/linux.jpeg", alt: "Linux", tag: "Linux", link: "#" },
    { src: "/img/numpy.png", alt: "Numpy", tag: "Numpy", link: "#" },
    { src: "/img/pandas.png", alt: "Pandas", tag: "Pandas", link: "#" },
    { src: "/img/pytorch.png", alt: "Pytorch", tag: "Pytorch", link: "#" },
    { src: "/img/sklearn.png", alt: "SKLearn", tag: "SKLearn", link: "#" },
  ];

  const layout = [2, 2, 3, 4, , 4, 3, 2, 2];

  let skillIndex = 0;

  return (
    <div className="min-h-screen bg-white text-black relative ">
      {/* Background icons */}
      <div className="absolute top-20 right-20 z-10">
        <Code className="w-32 h-32 text-gray-200/40" />
      </div>
      {/* <div className="absolute bottom-40 left-20 z-10">
        <Parentheses className="w-24 h-24 text-gray-200/40" />
      </div> */}
      {/* <div className="absolute top-1/2 right-1/5 z-10">
        <Braces className="w-40 h-40 text-gray-200/40" />
      </div> */}
      {/* <div className="absolute bottom-20 right-32 z-10">
        <Code className="w-36 h-36 text-gray-200/40" />
      </div> */}
      <div className="absolute top-40 left-1/12 z-10">
        <Braces className="w-28 h-28 text-gray-200/40 " />
      </div>

      {/* Header (unchanged) */}
      <div className="flex items-center justify-center w-full pt-10 px-4 sm:px-0">
        <div className="flex items-center justify-center w-full sm:w-[80%] bg-white/50 backdrop-blur-sm">
          <header className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6">
            <div
              className="text-xl sm:text-2xl font-black uppercase mb-2 sm:mb-0"
              style={{ fontFamily: "var(--font-dela-gothic)" }}
            >
              Adarsh Verma
            </div>
          </header>
        </div>
      </div>

      {/* Main Content - responsive improvements */}
      <main className="px-6 sm:px-12 md:px-24 py-16 max-w-full mx-auto z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 lg:justify-around">
          {/* Left: About Me */}
          <div className="lg:w-3/5 lg:mr-12 max-w-full">
            <h1 className="flex items-center justify-center text-4xl sm:text-5xl md:text-6xl mb-6 sm:mb-8 text-center lg:text-left">
              About Me
            </h1>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg font-medium text-justify px-4 sm:px-8 lg:px-0 max-w-full">
              <p>
                Hello! I&apos;m Adarsh Verma, a dedicated Full Stack Developer
                specializing in Backend Development. I am passionate about
                crafting robust, scalable, and user-focused web applications
                that prioritize performance and seamless user experiences.
              </p>
              <p>
                I am currently pursuing a{" "}
                <b>Bachelor&apos;s degree </b>from
                <b>
                  {" "}
                  Indian Institute of Information Technology, Jabalpur (IIITJ)
                </b>
                , with an expected graduation in 2026. During my studies, I&apos;m
                developing a strong foundation in systems thinking,
                problem-solving, and the integration of modern technologies.
              </p>
              <p>
                Beyond web development, I have a deep interest in emerging
                fields such as<b> Artificial Intelligence (AI)</b>,{" "}
                <b> Machine Learning (ML)</b>.
                I continuously explore these areas to innovate and create
                impactful, future-ready digital solutions. Combining creativity
                with technical expertise, I strive to develop applications that
                not only meet todays demands but also anticipate the challenges
                of tomorrow, driving meaningful change across industries.
              </p>

              {/* Resume Button */}
              <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
                <a
                  href="\docs\AdarshVerma_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-button px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 bg-white hover:bg-gray-100 transition-colors border border-gray-300 text-sm sm:text-base"
                >
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="w-4 h-4" />
                    <span>Resume</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Skills */}
          <div className="lg:w-2/5 lg:ml-12 max-w-full">
            <h1 className="flex items-center justify-center text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[0.9] mb-8 sm:mb-10 text-center lg:text-left ">
              Skills
            </h1>
            {/* Custom Brick Layout */}
            <div className="lg:space-y-3 lg:animate-fade-in-up lg:scrollbar-thumb-gray-300 lg:scrollbar-track-gray-100 lg:mr-20">
              {/* Mobile view: right to left scroll in 4-row group */}

              <div
                className="block lg:hidden overflow-x-auto no-scrollbar mb-24"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex gap-4 min-w-max px-2">
                  {
                    // Group skills into columns of 4
                    Array.from({ length: Math.ceil(skills.length / 4) }).map(
                      (_, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-2">
                          {skills
                            .slice(colIdx * 4, colIdx * 4 + 4)
                            .map((skill, rowIdx) => (
                              <a
                                key={`${colIdx}-${rowIdx}`}
                                href={skill.link}
                                className="rounded-button sm:px-6 md:px-10 sm:py-3 bg-white border border-gray-300 text-sm sm:text-sm px-4 py-4 rounded-full font-medium shadow-sm flex items-center gap-1 transition-all whitespace-nowrap"
                              >
                                <Image
                                  src={skill.src}
                                  alt={skill.alt}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4"
                                />
                                {skill.tag}
                              </a>
                            ))}
                        </div>
                      )
                    )
                  }
                </div>
              </div>

              {/* Desktop view (unchanged) */}
              <div className="hidden lg:block space-y-3">
                {layout.map((count, i) => (
                  <div key={i} className="flex justify-center gap-2 min-w-max">
                    {Array(count)
                      .fill(0)
                      .map((_, j) => {
                        const skill = skills[skillIndex++ % skills.length];
                        return (
                          <a
                            key={j}
                            href={skill.link}
                            className="rounded-button sm:px-6 md:px-10 sm:py-3 bg-white border border-gray-300 text-sm sm:text-sm px-4 py-4 rounded-full font-medium shadow-sm flex items-center cursor-default gap-1 transition-all whitespace-nowrap"
                          >
                            <Image
                              src={skill.src}
                              alt={skill.alt}
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                            {skill.tag}
                          </a>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dock (unchanged) */}
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
                  className="group transition-transform duration-300"
                >
                  <DockIcon isActive={true}>
                    <UserIcon className="h-5 w-5" />
                  </DockIcon>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>About</p>
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
