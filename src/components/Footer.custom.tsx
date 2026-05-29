import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { siteContent } from '@/content/site-content';

interface FooterCustomProps {
  config?: { name?: string; [key: string]: any };
}

export default function FooterCustom(props: FooterCustomProps) {
  const siteName = props.config?.name || siteContent.brand.name;

  return (
    <footer className="bg-card border-t border-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="block mb-3">
              <span
                className="text-xl font-bold"
                style={{
                  color: "hsl(var(--primary))",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {siteContent.brand.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Facebook
                  strokeWidth={1.5}
                  className="h-4 w-4 text-muted-foreground"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Linkedin
                  strokeWidth={1.5}
                  className="h-4 w-4 text-muted-foreground"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Instagram
                  strokeWidth={1.5}
                  className="h-4 w-4 text-muted-foreground"
                />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {siteContent.footer.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteName}. Tous droits reserves.
          </p>
          <div className="flex flex-wrap gap-4">
            {siteContent.footer.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
