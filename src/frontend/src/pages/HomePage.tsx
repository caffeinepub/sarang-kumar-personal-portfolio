import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code2,
  Cog,
  MapPin,
  Palette,
  ShoppingCart,
  Zap,
} from "lucide-react";

interface HomePageProps {
  onNavigate: (
    page:
      | "marketplace"
      | "services"
      | "case-studies"
      | "quote"
      | "contact"
      | "home",
  ) => void;
}

const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "40+", label: "Happy Clients" },
  { value: "3+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
];

const SERVICES = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Custom React, Next.js, and WordPress sites built for speed and scalability. From landing pages to complex web apps.",
    tags: ["React", "Next.js", "WordPress"],
  },
  {
    icon: Palette,
    title: "Interior Design Services",
    desc: "Transform your space with professional interior design. Residential, commercial, and 3D visualization packages.",
    tags: ["Residential", "Commercial", "3D Design"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    desc: "High-converting online stores with Stripe payments, inventory management, and SEO-optimized product pages.",
    tags: ["Stripe", "WooCommerce", "SEO"],
  },
  {
    icon: Cog,
    title: "Custom Applications",
    desc: "Business automation tools, dashboards, and internal apps. Built with Node.js, MongoDB, and modern APIs.",
    tags: ["Node.js", "MongoDB", "API"],
  },
];

const TECH_STACK = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "WordPress", color: "#21759b" },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "Node.js", color: "#68a063" },
  { name: "Tableau", color: "#e97627" },
  { name: "MongoDB", color: "#4db33d" },
  { name: "Stripe", color: "#635bff" },
  { name: "Vue.js", color: "#42b883" },
  { name: "Firebase", color: "#ffca28" },
];

const CASE_STUDIES_PREVIEW = [
  {
    client: "RetailMax",
    result: "3x Conversion Rate",
    desc: "Full e-commerce redesign with optimized checkout flow",
    img: "/assets/generated/case-study-retailmax.dim_800x500.jpg",
  },
  {
    client: "EduLearn",
    result: "10,000+ Students",
    desc: "Online course platform with live streaming and quizzes",
    img: "/assets/generated/case-study-edulearn.dim_800x500.jpg",
  },
  {
    client: "PropertyHub",
    result: "60% More Leads",
    desc: "Real estate portal with advanced search and map view",
    img: "/assets/generated/case-study-propertyhub.dim_800x500.jpg",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    company: "RetailMax India",
    quote:
      "Sarang transformed our outdated site into a high-converting machine. Sales tripled within 3 months of launch. Exceptional work!",
    initials: "RS",
  },
  {
    name: "Priya Nair",
    company: "EduLearn Academy",
    quote:
      "The platform he built handles thousands of concurrent students flawlessly. Professional, timely, and truly understands business needs.",
    initials: "PN",
  },
  {
    name: "Kiran Reddy",
    company: "PropertyHub Hyderabad",
    quote:
      "Best investment we made. Our lead generation went through the roof and the site is blazing fast. Highly recommend SK Web Solutions.",
    initials: "KR",
  },
];

interface HeroOrb {
  id: string;
  top: string;
  left: string;
  width: number;
  height: number;
  duration: string;
  delay: string;
  animName: string;
}

const HERO_ORBS: HeroOrb[] = [
  {
    id: "h-orb-1",
    top: "10%",
    left: "5%",
    width: 80,
    height: 80,
    duration: "12s",
    delay: "0s",
    animName: "float-orb",
  },
  {
    id: "h-orb-2",
    top: "60%",
    left: "2%",
    width: 50,
    height: 50,
    duration: "17s",
    delay: "2s",
    animName: "float-orb-2",
  },
  {
    id: "h-orb-3",
    top: "20%",
    left: "75%",
    width: 120,
    height: 120,
    duration: "20s",
    delay: "1s",
    animName: "float-orb",
  },
  {
    id: "h-orb-4",
    top: "75%",
    left: "85%",
    width: 60,
    height: 60,
    duration: "14s",
    delay: "4s",
    animName: "float-orb-2",
  },
  {
    id: "h-orb-5",
    top: "45%",
    left: "50%",
    width: 40,
    height: 40,
    duration: "9s",
    delay: "0.5s",
    animName: "float-orb",
  },
  {
    id: "h-orb-6",
    top: "85%",
    left: "40%",
    width: 90,
    height: 90,
    duration: "16s",
    delay: "3s",
    animName: "float-orb-2",
  },
  {
    id: "h-orb-7",
    top: "5%",
    left: "40%",
    width: 30,
    height: 30,
    duration: "11s",
    delay: "6s",
    animName: "float-orb",
  },
  {
    id: "h-orb-8",
    top: "35%",
    left: "90%",
    width: 70,
    height: 70,
    duration: "18s",
    delay: "2.5s",
    animName: "float-orb-2",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/sk-hero-bg.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="home.section"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/50" />

        {/* Animated gold orbs */}
        {HERO_ORBS.map((orb) => (
          <div
            key={orb.id}
            style={{
              position: "absolute",
              top: orb.top,
              left: orb.left,
              width: orb.width,
              height: orb.height,
              borderRadius: "50%",
              pointerEvents: "none",
              background:
                "radial-gradient(circle, oklch(0.78 0.14 85 / 0.3), transparent 70%)",
              animation: `${orb.animName} ${orb.duration} ease-in-out ${orb.delay} infinite`,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 border-primary/40 text-primary bg-primary/10 px-3 py-1">
              <MapPin className="h-3 w-3 mr-1" />
              Serving Hyderabad & Beyond
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Crafting <span className="gold-text">High-Performance</span>{" "}
              Digital Solutions
              <br />
              for Modern Businesses
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              From stunning websites to intelligent business tools \u2014 we
              build digital experiences that convert visitors into loyal
              customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="btn-gold gap-2 text-base px-8"
                onClick={() => onNavigate("marketplace")}
                data-ocid="home.primary_button"
              >
                View Our Work <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 gap-2 text-base px-8"
                onClick={() => onNavigate("quote")}
                data-ocid="home.secondary_button"
              >
                Get a Quote <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="border-y border-border/60 bg-navy-mid/40"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold gold-text">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20"
        data-ocid="home.section"
      >
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive digital solutions tailored for Hyderabad businesses
            and beyond
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc) => (
            <button
              type="button"
              key={svc.title}
              className="card-hover rounded-xl p-6 bg-card border border-border/60 cursor-pointer group text-left w-full"
              onClick={() => onNavigate("services")}
              data-ocid="home.card"
            >
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center mb-4">
                <svc.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {svc.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {svc.desc}
              </p>
              <div className="flex flex-wrap gap-1">
                {svc.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Interior Design Banner */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-12"
        data-ocid="home.section"
      >
        <div className="relative rounded-2xl overflow-hidden border border-primary/20">
          <img
            src="/assets/generated/interior-design-banner.dim_1200x600.jpg"
            alt="Interior Design Services"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              <Badge className="mb-3 border-primary/40 text-primary bg-primary/10">
                New Service
              </Badge>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Interior Design <span className="gold-text">Services</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mb-5 leading-relaxed">
                Professional space planning, 3D visualization, and complete
                project management for homes and commercial spaces.
              </p>
              <Button
                className="btn-gold"
                onClick={() => onNavigate("contact")}
                data-ocid="home.secondary_button"
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section
        className="border-y border-border/60 bg-card/30"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Our Tech Stack
            </h2>
            <p className="text-muted-foreground text-sm">
              Modern technologies we master
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-default"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20"
        data-ocid="home.section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Case Studies
            </h2>
            <p className="text-muted-foreground mt-1">
              Real results for real clients
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => onNavigate("case-studies")}
            data-ocid="home.secondary_button"
          >
            View All
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {CASE_STUDIES_PREVIEW.map((cs, i) => (
            <button
              type="button"
              key={cs.client}
              className="card-hover rounded-xl overflow-hidden bg-card border border-border/60 cursor-pointer text-left w-full"
              onClick={() => onNavigate("case-studies")}
              data-ocid={`home.item.${i + 1}`}
            >
              <img
                src={cs.img}
                alt={cs.client}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="font-display font-bold text-lg mb-1">
                  {cs.client}
                </div>
                <div className="text-primary text-sm font-semibold mb-2">
                  {cs.result}
                </div>
                <p className="text-muted-foreground text-sm">{cs.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="border-t border-border/60 bg-card/20"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              What Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="rounded-xl p-6 bg-card border border-border/60 card-hover"
                data-ocid={`home.item.${i + 1}`}
              >
                <div className="text-primary text-4xl font-serif leading-none mb-4">
                  &ldquo;
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
