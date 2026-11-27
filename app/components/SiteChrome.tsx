// PHG portal: shared header/footer pulled from the main website (PORTAL-001). App Router server components.
// Source of truth: https://prestigehomeguard.com/wp-json/phg/v1/chrome (read-only public JSON: nav, cta, phones, footer_html).
// Falls back to a static copy if the feed is unreachable, so the login page never breaks.
import { Phone, Menu, ChevronDown } from "lucide-react";

const FEED = "https://prestigehomeguard.com/wp-json/phg/v1/chrome";
const SITE = "https://prestigehomeguard.com/";
const LOGO = "https://prestigehomeguard.com/wp-content/uploads/2026/05/BHG-Logo-1-1.png";
type NavItem = { label: string; url: string; children?: NavItem[] };
type Chrome = { nav: NavItem[]; cta: { label: string; url: string }; customer_service: { display: string; tel: string }; logo_white: string; footer_html: string };

async function getChrome(): Promise<Chrome | null> {
  try {
    const r = await fetch(FEED, { next: { revalidate: 300 } }); // refreshes at most every 5 minutes
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

const FALLBACK_NAV: NavItem[] = [
  { label: "Home", url: SITE },
  { label: "Plans & Pricing", url: `${SITE}plans-pricing/` },
  { label: "What’s Covered", url: `${SITE}whats-covered-2/` },
  { label: "Resources", url: `${SITE}resources/` },
  { label: "Blog", url: `${SITE}blog/` },
  { label: "Contact Us", url: `${SITE}contact-us/` },
];

export async function SiteHeader() {
  const c = await getChrome();
  const nav = c?.nav ?? FALLBACK_NAV;
  const quoteUrl = c?.cta?.url ?? `${SITE}get-free-quote/`;
  const cs = c?.customer_service ?? { display: "(888) 970-6181", tel: "+18889706181" };

  return (
    <header className="phg-hdr">
      <div className="phg-hdr-row">
        <a className="phg-hdr-home" href={SITE} aria-label="Prestige Home Guard home page">
          <img className="phg-hdr-logo" src={LOGO} alt="Prestige Home Guard" width="400" height="107" />
        </a>

        <nav className="phg-hdr-nav" aria-label="Main">
          <ul>
            {nav.map((n) => (
              <li key={n.label}>
                <a href={n.url}>
                  {n.label}
                  {n.children && <ChevronDown size={14} aria-hidden="true" />}
                </a>
                {n.children && (
                  <ul className="phg-sub">
                    {n.children.map((s) => <li key={s.label}><a href={s.url}>{s.label}</a></li>)}
                  </ul>
                )}
              </li>
            ))}
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load closes the menu */}
              <a href="/" className="phg-current">Customer Portal</a>
            </li>
          </ul>
        </nav>

        <div className="phg-hdr-actions">
          <a className="phg-hdr-phone" href={`tel:${cs.tel}`} aria-label={`Call 24/7 customer service at ${cs.display}`}>
            <span className="phg-hdr-phone-icon"><Phone size={18} aria-hidden="true" /></span>
            <span className="phg-hdr-phone-text"><span>24/7 Customer Service</span><strong>{cs.display}</strong></span>
          </a>
          <a className="phg-hdr-cta" href={quoteUrl}>Get a Free Quote</a>

          <details className="phg-hdr-menu">
            <summary aria-label="Website menu"><Menu size={24} aria-hidden="true" /></summary>
            <nav aria-label="Website menu">
              <ul>
                {nav.map((n) => (
                  <li key={n.label}>
                    <a href={n.url}>{n.label}</a>
                    {n.children && (
                      <ul>
                        {n.children.filter((s) => s.url !== n.url).map((s) => <li key={s.label}><a href={s.url}>{s.label}</a></li>)}
                      </ul>
                    )}
                  </li>
                ))}
                <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load closes the menu */}
              <a href="/" className="phg-current">Customer Portal</a>
            </li>
              </ul>
              <a className="phg-hdr-menu-cta" href={quoteUrl}>Get a Free Quote</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const c = await getChrome();
  if (c?.footer_html) return <div dangerouslySetInnerHTML={{ __html: c.footer_html }} />; // first-party markup from our own WordPress feed
  const y = new Date().getFullYear();
  return (
    <footer className="phg-fallback-footer">
      <p>© {y} Prestige Home Guard. All rights reserved.</p>
      <p>
        <a href={`${SITE}privacy-policy/`}>Privacy Policy</a> · <a href={`${SITE}user-agreement/`}>Terms of Service Agreement</a>
      </p>
    </footer>
  );
}
