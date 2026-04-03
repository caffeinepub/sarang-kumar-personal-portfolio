import type { backendInterface as FullBackend, Listing } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MarketplacePageProps {
  onNavigate: (page: "contact") => void;
}

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: 1n,
    title: "Premium E-Commerce Store",
    description:
      "Fully-featured WooCommerce store with Stripe payments, inventory management, and SEO optimization. Ready to launch.",
    category: "E-Commerce",
    price: "₹45,000",
    techTags: ["WordPress", "WooCommerce", "Stripe"],
    status: "available",
    featured: true,
  },
  {
    id: 2n,
    title: "Corporate Website Package",
    description:
      "Professional 10-page corporate site with CMS, contact forms, Google Maps integration, and mobile-first design.",
    category: "Corporate",
    price: "₹28,000",
    techTags: ["React", "Tailwind", "Node.js"],
    status: "available",
    featured: false,
  },
  {
    id: 3n,
    title: "Real Estate Portal",
    description:
      "Property listing platform with advanced search filters, map view, lead capture forms, and agent dashboard.",
    category: "Real Estate",
    price: "₹65,000",
    techTags: ["Next.js", "MongoDB", "Maps API"],
    status: "available",
    featured: true,
  },
  {
    id: 4n,
    title: "Restaurant & Food Delivery",
    description:
      "Online ordering system with menu management, delivery tracking, and loyalty points. Integrated payment gateway.",
    category: "Food & Beverage",
    price: "₹38,000",
    techTags: ["React", "Firebase", "Stripe"],
    status: "available",
    featured: false,
  },
  {
    id: 5n,
    title: "Business Analytics Dashboard",
    description:
      "Data visualization dashboard with Tableau-style charts, KPI tracking, user roles, and automated PDF reports.",
    category: "SaaS",
    price: "₹72,000",
    techTags: ["React", "Tableau", "Node.js"],
    status: "available",
    featured: true,
  },
  {
    id: 6n,
    title: "Education Platform",
    description:
      "Course platform with video hosting, quizzes, certificates, student progress tracking, and payment integration.",
    category: "EdTech",
    price: "₹55,000",
    techTags: ["Next.js", "MongoDB", "Stripe"],
    status: "available",
    featured: false,
  },
];

const CATEGORIES = [
  "All",
  "E-Commerce",
  "Corporate",
  "Real Estate",
  "Food & Beverage",
  "SaaS",
  "EdTech",
];

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { actor, isFetching } = useActor();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(
    undefined as any,
  );

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return SAMPLE_LISTINGS;
      try {
        const result = await (actor as unknown as FullBackend).getListings();
        return result.length > 0 ? result : SAMPLE_LISTINGS;
      } catch {
        return SAMPLE_LISTINGS;
      }
    },
    enabled: true,
  });

  // Debounced search tracking
  useEffect(() => {
    if (!searchTerm.trim()) return;
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      if (actor && searchTerm.trim()) {
        (actor as unknown as FullBackend)
          .logActivity("search", searchTerm)
          .catch(() => {});
      }
    }, 500);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchTerm, actor]);

  const allListings = listings ?? SAMPLE_LISTINGS;
  const filtered = allListings.filter((l) => {
    const matchSearch =
      !searchTerm ||
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      activeCategory === "All" || l.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="marketplace.section"
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Website <span className="gold-text">Marketplace</span>
        </h1>
        <p className="text-muted-foreground">
          Ready-made and custom website solutions for every business need
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search websites, categories, technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary border-border"
            data-ocid="marketplace.search_input"
          />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{filtered.length} results</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-border/60 hover:border-primary/40"
            }`}
            data-ocid="marketplace.tab"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {isLoading || isFetching ? (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="marketplace.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <Skeleton key={k} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="marketplace.empty_state"
        >
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">
            No listings found for &ldquo;{searchTerm}&rdquo;
          </p>
          <p className="text-sm mt-1">
            Try a different search or browse all categories
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing, idx) => (
            <div
              key={Number(listing.id)}
              className="card-hover rounded-xl bg-card border border-border/60 overflow-hidden flex flex-col group"
              data-ocid={`marketplace.item.${idx + 1}`}
            >
              {listing.featured && (
                <div className="px-4 py-1.5 gold-gradient">
                  <span className="text-xs font-semibold text-primary-foreground">
                    ⭐ Featured
                  </span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                  <Badge className="shrink-0 bg-primary/10 text-primary border-primary/20">
                    {listing.price}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {listing.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {listing.techTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="w-full btn-gold"
                  onClick={() => onNavigate("contact")}
                  data-ocid="marketplace.primary_button"
                >
                  Inquire Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
