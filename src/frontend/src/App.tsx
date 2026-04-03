import type { backendInterface as FullBackend } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDarkMode } from "./components/DarkModeToggle";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SKAssistant } from "./components/SKAssistant";
import { useActor } from "./hooks/useActor";
import {
  InternetIdentityProvider,
  useInternetIdentity,
} from "./hooks/useInternetIdentity";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { PersonalPortfolio } from "./pages/PersonalPortfolio";
import { QuoteCalculatorPage } from "./pages/QuoteCalculatorPage";
import { ServicesPage } from "./pages/ServicesPage";

type Page =
  | "home"
  | "marketplace"
  | "services"
  | "case-studies"
  | "quote"
  | "contact";
type Site = "business" | "portfolio";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AdminAccessModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor } = useActor();
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const checkAdmin = useCallback(async () => {
    if (!actor) return;
    setCheckingAdmin(true);
    try {
      const result = await actor.isCallerAdmin();
      setIsAdmin(result);
      if (result) setShowDashboard(true);
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  }, [actor]);

  useEffect(() => {
    if (identity && actor && !checkingAdmin && isAdmin === null) {
      checkAdmin();
    }
  }, [identity, actor, checkAdmin, checkingAdmin, isAdmin]);

  if (showDashboard && isAdmin) {
    return (
      <div
        className="fixed inset-0 z-50 bg-background overflow-y-auto"
        data-ocid="admin.section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end px-4 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDashboard(false);
                setIsAdmin(null);
                onClose();
              }}
              className="text-muted-foreground"
              data-ocid="admin.close_button"
            >
              ✕ Close Dashboard
            </Button>
          </div>
          <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setIsAdmin(null);
        }
      }}
    >
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <DialogTitle>Admin Access</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Sign in with Internet Identity to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isAdmin === false && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              Access denied. This account doesn’t have admin privileges.
            </div>
          )}
          {isLoggingIn || checkingAdmin ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">
                {isLoggingIn ? "Signing in..." : "Checking permissions..."}
              </span>
            </div>
          ) : !identity ? (
            <Button
              className="w-full btn-gold"
              onClick={login}
              data-ocid="admin.primary_button"
            >
              Sign In with Internet Identity
            </Button>
          ) : isAdmin === null ? (
            <Button
              className="w-full btn-gold"
              onClick={checkAdmin}
              data-ocid="admin.primary_button"
            >
              Verify Admin Access
            </Button>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full text-muted-foreground"
          data-ocid="admin.cancel_button"
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PageTracker({ page, site }: { page: Page; site: Site }) {
  const { actor } = useActor();
  useEffect(() => {
    if (actor) {
      const routeName = site === "portfolio" ? "portfolio" : page;
      (actor as unknown as FullBackend)
        .logActivity("visit", routeName)
        .catch(() => {});
    }
  }, [page, site, actor]);
  return null;
}

function App() {
  useDarkMode(); // initialize dark mode on mount
  const [site, setSite] = useState<Site>("business");
  const [page, setPage] = useState<Page>("home");
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNavigate(p: string) {
    navigate(p as Page);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageTracker page={page} site={site} />

      {/* Site Switcher */}
      <div
        className="flex justify-center py-2 px-4 bg-navy-mid border-b border-border/40"
        data-ocid="switcher.section"
      >
        <div className="flex rounded-full border border-border/60 overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setSite("business");
              setPage("home");
            }}
            className={`px-5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              site === "business"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="switcher.tab"
          >
            SK Web Solutions
          </button>
          <button
            type="button"
            onClick={() => setSite("portfolio")}
            className={`px-5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              site === "portfolio"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="switcher.tab"
          >
            Personal Portfolio
          </button>
        </div>
      </div>

      {/* Business Site */}
      {site === "business" && (
        <>
          <Navbar currentPage={page} onNavigate={navigate} />
          <div className="flex-1">
            {page === "home" && <HomePage onNavigate={handleNavigate as any} />}
            {page === "marketplace" && (
              <MarketplacePage onNavigate={handleNavigate as any} />
            )}
            {page === "services" && (
              <ServicesPage onNavigate={handleNavigate as any} />
            )}
            {page === "case-studies" && (
              <CaseStudiesPage onNavigate={handleNavigate as any} />
            )}
            {page === "quote" && <QuoteCalculatorPage />}
            {page === "contact" && <ContactPage />}
          </div>
          <Footer onAdminAccess={() => setAdminModalOpen(true)} />
        </>
      )}

      {/* Personal Portfolio */}
      {site === "portfolio" && (
        <PersonalPortfolio
          onSwitchToBusiness={() => {
            setSite("business");
            setPage("home");
          }}
        />
      )}

      {/* Floating SK Assistant */}
      <SKAssistant />

      {/* Admin Access Modal */}
      <AdminAccessModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function Root() {
  return (
    <ErrorBoundary>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </InternetIdentityProvider>
    </ErrorBoundary>
  );
}
