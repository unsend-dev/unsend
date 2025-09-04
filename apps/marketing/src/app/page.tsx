import Image from "next/image";
import Link from "next/link";
import { GitHubStarsButton } from "~/components/GitHubStarsButton";
import { Button } from "@usesend/ui/src/button";
import { FeatureCard } from "~/components/FeatureCard";
import { FeatureCardPlain } from "~/components/FeatureCardPlain";

const REPO = "unsend-dev/unsend";
const REPO_URL = `https://github.com/${REPO}`;
const GET_STARTED_URL = `${REPO_URL}#-getting-started`;

export default function Page() {
  return (
    <main className="min-h-screen bg-sidebar-background text-foreground">
      <TopNav />
      <Hero />
      <TrustedBy />
      <Features />
      <CodeExample />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : undefined}>
      {eyebrow ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h1 className="mt-6 text-center text-2xl sm:text-4xl font-semibold text-primary font-sans">
          The open source email platform for product teams
        </h1>
        <p className="mt-4 text-center text-base sm:text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
          Send product, transactional and marketing emails. Pay only for what
          you send and not for storing contacts. Open source and self-hostable.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="px-6">
            <a href={GET_STARTED_URL} target="_blank" rel="noopener noreferrer">
              Get started
            </a>
          </Button>

          <GitHubStarsButton />
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Open source • Self-host in minutes • Free tier
        </p>

        <div className=" mt-32 mx-auto max-w-5xl">
          <div className="rounded-2xl bg-primary/30 p-1 sm:p-1 border-2 border-primary/30 shadow-sm">
            <Image
              src="/hero-light.png"
              alt="useSend product hero"
              width={3456}
              height={1914}
              className="w-full h-auto rounded-xl block dark:hidden"
              sizes="(min-width: 1024px) 900px, 100vw"
              loading="eager"
              priority={false}
            />
            <Image
              src="/hero-dark.png"
              alt="useSend product hero"
              width={3456}
              height={1914}
              className="w-full h-auto rounded-xl hidden dark:block"
              sizes="(min-width: 1024px) 900px, 100vw"
              loading="eager"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopNav() {
  return (
    <header className="py-4 border-b border-border sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/80">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-squircle.png"
            alt="useSend"
            width={24}
            height={24}
          />
          <span className="text-primary  font-mono text-[16px]">useSend</span>
        </div>
        <nav className="flex items-center gap-4 text-muted-foreground">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={GET_STARTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

function TrustedBy() {
  const featured = [
    {
      quote:
        "Transitioned recently to open source email sender useSend for our 30k and growing newsletter. It's such a great product and amazing oss experience.",
      author: "Marc Seitz",
      company: "papermark.com",
      image:
        "https://pbs.twimg.com/profile_images/1176854646343852032/iYnUXJ-m_400x400.jpg",
    },
    {
      quote:
        "useSend was extremely easy to set up, and I love that it's open source. Koushik has been an absolute awesome person to deal with and helps us with any issues or feedback.",
      author: "Tommerty",
      company: "doras.to",
      image:
        "https://cdn.doras.to/doras/user/83bda65b-8d42-4011-9bf0-ab23402776f2-0.890688178917765.webp",
    },
  ];

  const quick = [
    {
      quote: "don't sleep on useSend",
      author: "shellscape",
      company: "jsx.email",
      image:
        "https://pbs.twimg.com/profile_images/1698447401781022720/b0DZSc_D_400x400.jpg",
    },
    {
      quote: "Thank you for making useSend!",
      author: "Andras Bacsai",
      company: "coolify.io",
      image:
        "https://pbs.twimg.com/profile_images/1884210412524027905/jW4NB4rx_400x400.jpg",
    },
    {
      quote: "I KNOW WHAT TO DO",
      author: "VicVijayakumar",
      company: "onetimefax.com",
      image:
        "https://pbs.twimg.com/profile_images/1665351804685524995/W4BpDx5Z_400x400.jpg",
    },
  ];

  return (
    <section className="py-10 sm:py-20 ">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center tracking-wider text-muted-foreground">
          <span className="">Builders and open source teams like </span>
          <span className="text-primary font-bold">useSend</span>
        </div>

        {/* Top: 2 larger testimonials */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured.map((t) => (
            <figure
              key={t.author + t.company}
              className="rounded-xl border border-primary/30 p-5 h-full"
            >
              <blockquote className="text-sm sm:text-base font-light font-sans  text-muted-foreground">
                {t.quote}
              </blockquote>
              <div className="mt-3 flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={`${t.author} avatar`}
                  width={32}
                  height={32}
                  className=" rounded-md border-2 border-primary/50"
                />
                <figcaption className="text-sm">
                  <span className="font-medium">{t.author}</span>
                  <a
                    href={`https://${t.company}`}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary-light"
                  >
                    {" "}
                    — {t.company}
                  </a>{" "}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        {/* Bottom: 3 multi-line testimonials (same style as top) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quick.map((t) => (
            <figure
              key={t.author + t.company}
              className="rounded-xl border border-primary/30 p-5 h-full"
            >
              <blockquote className="text-sm sm:text-base font-light font-sans leading-relaxed text-muted-foreground">
                {t.quote}
              </blockquote>
              <div className="mt-3 flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={`${t.author} avatar`}
                  width={32}
                  height={32}
                  className=" rounded-md border-2 border-primary/50"
                />
                <figcaption className="text-sm">
                  <span className="font-medium">{t.author}</span>
                  <a
                    href={`https://${t.company}`}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary-light"
                  >
                    {" "}
                    — {t.company}
                  </a>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  // Top: 2 cards (with image area) — Analytics, Editor
  const top = [
    {
      key: "feature-analytics",
      title: "Analytics",
      content:
        "Track deliveries, opens, clicks, bounces and unsubscribes in real time with a simple, searchable log. Filter by domain, status, api key and more and export them. Track which campaigns perform best.",
      imageSrc: "", // add an image like "/analytics.png"
    },
    {
      key: "feature-editor",
      title: "Marketing Email Editor",
      content:
        "Design beautiful campaigns without code using a visual, notion like WYSIWYG editor that works in major email clients. Reuse templates and brand styles, and personalize with variables.",
      imageSrc: "", // add an image like "/editor.png"
    },
  ];

  // Bottom: 3 cards (no images) — Contact Management, Suppression List, SMTP Relay Service
  const bottom = [
    {
      key: "feature-contacts",
      title: "Contact Management",
      content:
        "Manage contacts, lists, and consent in one place. Import and export easily, keep per-list subscription status. Contacts are automatically updated from bounces and complaints.",
    },
    {
      key: "feature-suppression",
      title: "Suppression List",
      content:
        "Prevent accidental sends. Automatically populated from bounces and complaints, and manage via import/export or API. Works with transactional and marketing emails.",
    },
    {
      key: "feature-smtp",
      title: "SMTP Relay Service",
      content:
        "Drop-in SMTP relay that works with any app or framework. Do not get vendor lock-in. Comes in handy with services like Supabase",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-2 text-sm uppercase tracking-wider text-primary">
            Features
          </div>
        </div>

        {/* Top row: 2 side-by-side cards with images */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {top.map((f) => (
            <FeatureCard
              key={f.key}
              title={f.title}
              content={f.content}
              imageSrc={f.imageSrc}
            />
          ))}
        </div>

        {/* Bottom row: 3 cards without images */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bottom.map((f) => (
            <FeatureCardPlain key={f.key} title={f.title} content={f.content} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeExample() {
  const code = `import { Unsend } from "@unsend/sdk";

const unsend = new Unsend({ apiKey: process.env.UNSEND_API_KEY! });

await unsend.emails.send({
  from: "hi@example.com",
  to: "you@company.com",
  subject: "Welcome to useSend",
  template: "welcome", // or html/text
  data: { name: "Ada" },
});`;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-2 text-sm uppercase tracking-wider text-primary">
            Developers
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Typed SDKs and simple APIs, so you can focus on product not
            plumbing.
          </p>
        </div>

        <div className="mt-8 overflow-hidden">
          <div className="px-4 py-2 text-xs text-muted-foreground">
            TypeScript
          </div>
          <pre className="p-4 text-sm overflow-auto">
            <code>{code}</code>
          </pre>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button size="lg" className="px-6">
            <a href={GET_STARTED_URL} target="_blank" rel="noopener noreferrer">
              Read the Getting Started guide
            </a>
          </Button>
          <Button variant="outline" size="lg" className="px-5">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Explore the repository
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-semibold">Start sending with useSend</h3>
          <p className="mt-2 text-muted-foreground">
            Free and open source. Self‑host with Docker or fork and extend.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-6">
              <a
                href={GET_STARTED_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get started on GitHub
              </a>
            </Button>
            <GitHubStarsButton />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Is useSend really open source?",
      a: "Yes. The core is MIT licensed. You can self‑host and modify for your needs.",
    },
    {
      q: "Can I self‑host?",
      a: "Absolutely. Use our Docker Compose to run locally or deploy to your own infra.",
    },
    {
      q: "Do you support both SMTP and API?",
      a: "Yes. Send via SMTP relay or the REST API/TypeScript SDK—whichever fits best.",
    },
    {
      q: "What about analytics and webhooks?",
      a: "Track deliveries, opens, clicks, bounces, and subscribe to events via webhooks.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          center
          eyebrow="FAQ"
          title="Answers to common questions"
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h4 className="font-medium">{f.q}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-squircle.png"
            alt="useSend"
            width={24}
            height={24}
          />
          <span>useSend</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={GET_STARTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Get Started
          </a>
        </div>
      </div>
    </footer>
  );
}

// Minimal inline icons (stroke-based, sleek)
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LayoutIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M12 4v16M3 9h18" />
    </svg>
  );
}

function BarChartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <rect x="7" y="10" width="3" height="7" />
      <rect x="12" y="7" width="3" height="10" />
      <rect x="17" y="12" width="3" height="5" />
    </svg>
  );
}

function ServerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

function CodeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m8 9-4 3 4 3M16 9l4 3-4 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OpenSourceIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7a5 5 0 1 0 3.535 8.535L12 12l-3.535 3.535" />
    </svg>
  );
}
