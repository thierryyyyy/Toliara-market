import { useState, useMemo, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Camera, ChevronDown } from 'lucide-react';
import { siteContent } from '@/content/site-content';


interface HeaderCustomProps {
  items?: {
    title?: string;
    label?: string;
    to?: string;
    href?: string;
    hidden?: boolean;
  }[];
  config?: { name?: string; [key: string]: any };
}

export default function HeaderCustom(props: HeaderCustomProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const items = useMemo(() => {
    const provided = Array.isArray(props.items) ? props.items : [];
    if (provided.length > 0) return provided;
    return [{ title: "Accueil", to: "/" }];
  }, [props.items]);

  const visibleItems = items.filter((item: any) => !item.hidden);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <span
              className="text-2xl font-bold"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-heading)",
              }}
            >
              {props.config?.name || siteContent.brand.name}
            </span>
          </Link>

          {/* Category dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background
                         text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Articles
              <ChevronDown strokeWidth={1.5} className="h-4 w-4" />
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-2">
                {siteContent.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/catalog?category=${cat.slug}`}
                    onClick={() => setShowCategories(false)}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex items-center"
          >
            <div className="relative w-full">
              <Search
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des articles"
                className="w-full pl-9 pr-10 py-2 border border-border rounded-xl bg-background
                           text-sm text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <Camera strokeWidth={1.5} className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              to="/auth"
              className="hidden md:block px-4 py-1.5 rounded-xl border border-border text-sm font-medium
                         text-foreground hover:bg-muted transition-colors whitespace-nowrap"
            >
              S'inscrire | Se connecter
            </Link>
            <Link
              to="/sell"
              className="hidden md:block px-4 py-1.5 rounded-xl text-sm font-medium text-primary-foreground
                         bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Vends tes articles
            </Link>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X strokeWidth={1.5} className="h-5 w-5" />
              ) : (
                <Menu strokeWidth={1.5} className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="hidden md:block border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {siteContent.categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog?category=${cat.slug}`}
                className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  location.search.includes(cat.slug)
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-primary"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des articles"
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl bg-background
                           text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </form>
          {siteContent.categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog?category=${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm text-foreground py-1.5 hover:text-primary"
            >
              {cat.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {visibleItems.map((item: any) => (
              <Link
                key={item.to}
                to={item.to || item.href || "/"}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-foreground hover:text-primary"
              >
                {item.title || item.label}
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="text-center px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground"
            >
              S'inscrire | Se connecter
            </Link>
            <Link
              to="/sell"
              onClick={() => setIsMenuOpen(false)}
              className="text-center px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground bg-primary"
            >
              Vends tes articles
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
