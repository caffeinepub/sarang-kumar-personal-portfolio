import { Briefcase, Calculator, Home, Phone, ShoppingBag } from "lucide-react";

type Page =
  | "home"
  | "marketplace"
  | "services"
  | "case-studies"
  | "quote"
  | "contact";

interface MobileBottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "marketplace", label: "Market", icon: ShoppingBag },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "quote", label: "Quote", icon: Calculator },
  { id: "contact", label: "Contact", icon: Phone },
];

export function MobileBottomNav({
  currentPage,
  onNavigate,
}: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-ocid="mobile_nav.section"
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 gap-1 py-2 min-h-[56px] text-[10px] font-medium transition-colors duration-200 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`mobile_nav.${item.id}.tab`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
