import { Button } from "@/components/ui/button";
import { Briefcase, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { DarkModeToggle } from "./DarkModeToggle";

type Page =
  | "home"
  | "marketplace"
  | "services"
  | "case-studies"
  | "quote"
  | "contact";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "marketplace", label: "Marketplace" },
  { id: "services", label: "Services" },
  { id: "case-studies", label: "Case Studies" },
  { id: "quote", label: "Quote" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/60 navy-glass"
      data-ocid="navbar.section"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
          data-ocid="navbar.link"
        >
          <div className="w-8 h-8 rounded-md gold-gradient flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-foreground">SK</span>{" "}
            <span className="gold-text">Web Solutions</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentPage === link.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-ocid="navbar.link"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <Button
            size="sm"
            className="hidden md:flex btn-gold"
            onClick={() => onNavigate("contact")}
            data-ocid="navbar.primary_button"
          >
            Get a Quote
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentPage === link.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="navbar.link"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
