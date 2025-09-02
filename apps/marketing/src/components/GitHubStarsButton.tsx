"use client";

import { useEffect, useState } from "react";
import { Button } from "@usesend/ui/src/button";

const REPO = "unsend-dev/unsend";
const REPO_URL = `https://github.com/${REPO}`;
const API_URL = `https://api.github.com/repos/${REPO}`;

export function GitHubStarsButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && typeof json.stargazers_count === "number") {
          setStars(json.stargazers_count);
        }
      } catch (err) {
        // ignore network errors; keep placeholder
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatted = stars?.toLocaleString() ?? "—";

  return (
    <Button variant="outline" size="lg" className="px-4 gap-2">
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Star this repo on GitHub"
        className="flex items-center gap-2"
      >
        <GitHubIcon className="h-4 w-4" />
        <span>Star on GitHub</span>
      </a>
    </Button>
  );
}

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.486 2 12.021c0 4.424 2.865 8.175 6.839 9.5.5.093.682-.217.682-.483 0-.237-.009-.864-.014-1.696-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.907-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.027A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.297 2.748-1.027 2.748-1.027.545 1.378.202 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.848-2.337 4.697-4.565 4.945.36.31.68.921.68 1.856 0 1.339-.012 2.418-.012 2.747 0 .268.18.581.688.482C19.138 20.193 22 16.443 22 12.02 22 6.486 17.523 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
