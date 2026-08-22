"use client";

import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import GitHubStats from "../components/sections/GitHubStats";
import type { OpenSourceContribution } from "../../data";

interface OpenSourceExperienceProps {
  contributions: OpenSourceContribution[];
}

export default function OpenSourceExperience({ contributions }: OpenSourceExperienceProps) {
  const mergedPullRequests = contributions.reduce(
    (total, contribution) => total + contribution.mergedPullRequests,
    0,
  );

  return (
    <section
      data-section="open-source"
      className="relative z-10 border-y px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-5 border-b pb-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] md:items-end md:gap-12" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--color-accent)" }}>
              Open source
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: "var(--color-text)" }}>
              Upstream contributions
            </h2>
          </div>
          <p className="text-sm leading-7 sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
            {mergedPullRequests} merged pull requests across Learning Unlimited, Kiwix, and the Palisadoes Foundation.
          </p>
        </header>

        <div className="border-b py-7 sm:py-9" style={{ borderColor: "var(--color-border)" }}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
              GitHub activity
            </h3>
            <a
              href="https://github.com/nishantharkut"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--color-accent-hover)]"
              style={{ color: "var(--color-accent)" }}
            >
              Open GitHub
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
          <div data-github-contribution-graph className="overflow-hidden">
            <GitHubStats username="nishantharkut" showTitle={false} compact />
          </div>
        </div>

        <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
          {contributions.map((contribution) => (
            <article
              key={contribution.repository}
              data-open-source-entry
              className="grid gap-4 border-t py-7 first:border-t-0 sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:gap-7"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[4px] border bg-white"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Image
                    data-open-source-logo
                    src={contribution.logo}
                    alt={`${contribution.organization} logo`}
                    fill
                    sizes="40px"
                    className="object-contain p-0.5"
                    loading="eager"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {contribution.organization}
                  </h3>
                  <p className="mt-1 break-words text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {contribution.repository}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {contribution.evidence}
                </p>
                <p className="mt-2 text-sm leading-6 sm:text-base sm:leading-7" style={{ color: "var(--color-text-secondary)" }}>
                  {contribution.summary}
                </p>
              </div>

              <div className="sm:pt-0.5">
                <a
                  href={contribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--color-accent-hover)]"
                  style={{ color: "var(--color-accent)" }}
                >
                  Merged PRs
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
