import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "~/components/StatusBadge";

const REPO = "usesend/usesend";
const REPO_URL = `https://github.com/${REPO}`;
const APP_URL = "https://app.usesend.com";

export function SiteFooter() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-2 sm:w-56">
            <Image src="/logo-squircle.png" alt="useSend" width={24} height={24} />
            <span className="text-primary font-mono">useSend</span>
          </div>

          <div className="sm:ml-auto flex items-start gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Product</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="https://docs.usesend.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      Docs
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Contact</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="mailto:hey@usesend.com" className="hover:text-foreground">Email</a>
                  </li>
                  <li>
                    <a href="https://x.com/useSend_com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      X (Twitter)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/use-send/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="https://bsky.app/profile/usesend.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      Bluesky
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Company</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-foreground">Terms</Link>
                  </li>
                </ul>
              </div>
            </div>

            <StatusBadge />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground mx-auto text-center">
          © {new Date().getFullYear()} useSend. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

