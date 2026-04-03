import type {
  backendInterface as FullBackend,
  ServicePackage,
} from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, Star } from "lucide-react";

interface ServicesPageProps {
  onNavigate: (page: "quote" | "contact") => void;
}

const SAMPLE_PACKAGES: ServicePackage[] = [
  {
    id: 1n,
    name: "Starter",
    description:
      "Perfect for small businesses and personal brands looking to establish an online presence.",
    price: "₹15,000",
    features: [
      "Up to 5 Pages",
      "Mobile Responsive Design",
      "Contact Form Integration",
      "Basic SEO Setup",
      "1 Month Support",
      "Google Analytics Setup",
    ],
    popular: false,
  },
  {
    id: 2n,
    name: "Professional",
    description:
      "Ideal for growing businesses that need a powerful, feature-rich digital presence.",
    price: "₹35,000",
    features: [
      "Up to 15 Pages",
      "Custom UI/UX Design",
      "CMS / Admin Panel",
      "Advanced SEO Package",
      "Payment Gateway",
      "Social Media Integration",
      "3 Months Support",
      "Performance Optimization",
    ],
    popular: true,
  },
  {
    id: 3n,
    name: "Enterprise",
    description:
      "For large organizations needing custom, scalable solutions with ongoing management.",
    price: "₹75,000+",
    features: [
      "Unlimited Pages",
      "Custom Web Application",
      "Advanced Admin Dashboard",
      "Multi-user Roles",
      "Custom Animations",
      "Complete SEO Strategy",
      "Priority Support (6 months)",
      "Monthly Analytics Reports",
      "Cloud Hosting Setup",
    ],
    popular: false,
  },
];

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { actor } = useActor();

  const { data: packages, isLoading } = useQuery<ServicePackage[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PACKAGES;
      try {
        const result = await (actor as unknown as FullBackend).getPackages();
        return result.length > 0 ? result : SAMPLE_PACKAGES;
      } catch {
        return SAMPLE_PACKAGES;
      }
    },
    enabled: true,
  });

  const allPackages = packages ?? SAMPLE_PACKAGES;

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
      data-ocid="services.section"
    >
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Service <span className="gold-text">Packages</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Transparent pricing with no hidden fees. Choose the package that fits
          your business goals.
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid md:grid-cols-3 gap-6"
          data-ocid="services.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {allPackages.map((pkg, idx) => (
            <div
              key={Number(pkg.id)}
              className={`relative rounded-xl border flex flex-col card-hover ${
                pkg.popular
                  ? "border-primary bg-primary/5 shadow-gold"
                  : "border-border/60 bg-card"
              }`}
              data-ocid={`services.item.${idx + 1}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gold-gradient text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              <div className="p-7 flex-1 flex flex-col">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold mb-1">
                    {pkg.name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="font-display text-3xl font-bold gold-text">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    /project
                  </span>
                </div>
                <ul className="space-y-3 flex-1 mb-7">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={
                    pkg.popular
                      ? "btn-gold w-full"
                      : "w-full border-primary/40 text-primary hover:bg-primary/10"
                  }
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => onNavigate("quote")}
                  data-ocid="services.primary_button"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process */}
      <div className="mt-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
          Our Process
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discovery",
              desc: "We understand your goals, target audience, and business requirements in detail.",
            },
            {
              step: "02",
              title: "Design",
              desc: "Custom UI/UX wireframes and visual designs crafted for maximum impact.",
            },
            {
              step: "03",
              title: "Development",
              desc: "Built with modern technologies, fully tested, and optimized for performance.",
            },
            {
              step: "04",
              title: "Launch & Support",
              desc: "Go live with confidence. Ongoing support and maintenance included.",
            },
          ].map((step) => (
            <div
              key={step.step}
              className="text-center p-6 rounded-xl bg-card border border-border/60"
            >
              <div className="font-display text-4xl font-bold gold-text mb-3">
                {step.step}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
