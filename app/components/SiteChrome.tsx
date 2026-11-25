// PHG portal: shared header/footer pulled from the main website (PORTAL-001). Drop into the portal's Next.js app (App Router server components).
// Source of truth: https://prestigehomeguard.com/wp-json/phg/v1/chrome  (read-only public JSON: nav, cta, phones, footer_html). No new dependencies.
// Falls back to a static copy if the feed is unreachable, so the login page never breaks.


const FEED = 'https://prestigehomeguard.com/wp-json/phg/v1/chrome';
type NavItem = { label: string; url: string; children?: NavItem[] };
type Chrome = { nav: NavItem[]; cta: { label: string; url: string }; customer_service: { display: string; tel: string }; logo_white: string; footer_html: string };

async function getChrome(): Promise<Chrome | null> {
  try {
    const r = await fetch(FEED, { next: { revalidate: 300 } }); // refreshes at most every 5 minutes
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

export async function SiteHeader() {
  const c = await getChrome();
  const nav = c?.nav ?? [
    { label: 'Home', url: 'https://prestigehomeguard.com/' },
    { label: 'Plans & Pricing', url: 'https://prestigehomeguard.com/plans-pricing/' },
    { label: 'Whatâ€™s Covered', url: 'https://prestigehomeguard.com/whats-covered-2/' },
    { label: 'Resources', url: 'https://prestigehomeguard.com/resources/' },
    { label: 'Blog', url: 'https://prestigehomeguard.com/blog/' },
    { label: 'Contact Us', url: 'https://prestigehomeguard.com/contact-us/' },
  ];
  const cta = c?.cta ?? { label: 'Get a free quote', url: 'https://prestigehomeguard.com/get-free-quote/' };
  const cs = c?.customer_service ?? { display: '(888) 970-6181', tel: '+18889706181' };
  return (
    <header className="phg-hdr">
      <div className="phg-hdr-top">
        <a href="https://prestigehomeguard.com/" aria-label="Prestige Home Guard home page"><img className="phg-hdr-logo" src="https://prestigehomeguard.com/wp-content/uploads/2025/01/BHG-Logo.png" alt="Prestige Home Guard" width="190" height="56" /></a>
        <div className="phg-hdr-right">
          <a className="phg-hdr-phone" href={`tel:${cs.tel}`}><span>Customer service</span><strong>{cs.display}</strong></a>
          <a className="phg-btn" href={cta.url}>{cta.label}</a>
        </div>
      </div>
      <nav className="phg-hdr-nav" aria-label="Main">
        <ul>{nav.map((n) => (
          <li key={n.label}><a href={n.url}>{n.label}</a>
            {n.children && <ul className="phg-sub">{n.children.map((s) => <li key={s.label}><a href={s.url}>{s.label}</a></li>)}</ul>}
          </li>))}
        </ul>
      </nav>
    </header>
  );
}

export async function SiteFooter() {
  const c = await getChrome();
  if (c?.footer_html) return <div dangerouslySetInnerHTML={{ __html: c.footer_html }} />; // first-party markup from our own WordPress feed
  const y = new Date().getFullYear();
  return <footer className="phg-fallback-footer"><p>Â© {y} Prestige Home Guard. All rights reserved.</p><p><a href="https://prestigehomeguard.com/privacy-policy/">Privacy Policy</a> Â· <a href="https://prestigehomeguard.com/user-agreement/">Terms of Service Agreement</a></p></footer>;
}
