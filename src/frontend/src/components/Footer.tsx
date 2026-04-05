import { CheckCircle, ExternalLink, Lock, Shield } from "lucide-react";

interface FooterProps {
  onAdminAccess: () => void;
}

export function Footer({ onAdminAccess }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer
      className="border-t border-border/60 bg-background"
      data-ocid="footer.section"
    >
      {/* Security badges + links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-lg gold-text mb-2">
              SK Web Solutions
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting high-performance digital solutions for modern businesses.
              Based in Hyderabad, India.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary border border-primary/40 px-2 py-1 rounded-full hover:bg-primary/10 transition-colors"
                data-ocid="footer.link"
              >
                AI Demo Production <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Security Badges */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Security & Trust
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>SSL Secured Connection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Contact
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>mrsergio569@gmail.com</p>
              <p>Hyderabad, Telangana, India</p>
              <p className="mt-2">Mon–Fri, 9AM–6PM IST</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
          {/* Admin Access — subtle but visible, for Sarang only */}
          <button
            type="button"
            onClick={onAdminAccess}
            className="text-xs text-muted-foreground/60 hover:text-primary border border-border/40 hover:border-primary/50 px-3 py-1 rounded-full transition-all duration-200 min-h-[36px] min-w-[120px]"
            data-ocid="footer.admin_access"
          >
            🔐 Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
}
