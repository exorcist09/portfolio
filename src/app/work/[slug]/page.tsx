import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { projectReadmes } from "@/data/projectReadmes";
import ReadmeView from "@/components/readme/ReadmeView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return Object.keys(projectReadmes).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Adarsh Verma",
  };
}

export default async function ProjectReadmePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const fromHome = resolvedSearchParams?.from === "home";
  const normalizedSlug = slug.toLowerCase();
  const project = projectReadmes[normalizedSlug];

  if (!project) {
    notFound();
  }

  return <ReadmeView data={project} fromHome={fromHome} />;
}
