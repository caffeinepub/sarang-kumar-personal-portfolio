import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  Database,
  ExternalLink,
  Globe,
  Linkedin,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface PersonalPortfolioProps {
  onSwitchToBusiness: () => void;
}

const SKILLS = [
  {
    icon: Globe,
    label: "Website Design & Development",
    desc: "React, Next.js, WordPress \u2014 full-stack web development",
  },
  {
    icon: TrendingUp,
    label: "Data Analysis",
    desc: "Tableau, Excel, business intelligence & reporting",
  },
  {
    icon: Database,
    label: "Credit Management",
    desc: "Financial data management and credit analysis",
  },
  {
    icon: Award,
    label: "Business Automation",
    desc: "Workflow automation, CRM setup, process optimization",
  },
];

const HIGHLIGHTS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "3+", label: "Years Experience" },
  { value: "40+", label: "Happy Clients" },
  { value: "10+", label: "Technologies" },
];

interface OrbConfig {
  id: string;
  top: string;
  left: string;
  width: number;
  height: number;
  animDuration: string;
  animDelay: string;
  animName: string;
}

const PORTFOLIO_ORBS: OrbConfig[] = [
  {
    id: "p-orb-1",
    top: "8%",
    left: "5%",
    width: 90,
    height: 90,
    animDuration: "14s",
    animDelay: "0s",
    animName: "float-orb",
  },
  {
    id: "p-orb-2",
    top: "70%",
    left: "80%",
    width: 70,
    height: 70,
    animDuration: "18s",
    animDelay: "3s",
    animName: "float-orb-2",
  },
  {
    id: "p-orb-3",
    top: "50%",
    left: "10%",
    width: 50,
    height: 50,
    animDuration: "12s",
    animDelay: "1.5s",
    animName: "float-orb",
  },
  {
    id: "p-orb-4",
    top: "20%",
    left: "85%",
    width: 110,
    height: 110,
    animDuration: "20s",
    animDelay: "5s",
    animName: "float-orb-2",
  },
  {
    id: "p-orb-5",
    top: "88%",
    left: "30%",
    width: 60,
    height: 60,
    animDuration: "16s",
    animDelay: "2s",
    animName: "float-orb",
  },
];

export function PersonalPortfolio({
  onSwitchToBusiness,
}: PersonalPortfolioProps) {
  const [showFull, setShowFull] = useState(false);

  return (
    <main className="min-h-screen bg-background" data-ocid="portfolio.section">
      {/* Intro Page */}
      {!showFull ? (
        <div
          className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.11 0.03 255), oklch(0.16 0.03 255) 40%, oklch(0.14 0.04 80) 70%, oklch(0.12 0.025 255))",
            backgroundSize: "300% 300%",
            animation: "gradient-shift 12s ease infinite",
          }}
        >
          {/* Animated floating orbs */}
          {PORTFOLIO_ORBS.map((orb) => (
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
                animation: `${orb.animName} ${orb.animDuration} ease-in-out ${orb.animDelay} infinite`,
              }}
            />
          ))}

          <div className="w-full max-w-md relative z-10">
            {/* Executive Box */}
            <div
              className="relative border-2 border-primary p-8 md:p-10 rounded-sm shadow-gold"
              style={{
                background: "oklch(0.14 0.03 255 / 0.92)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary" />

              {/* Heading */}
              <h1 className="font-display text-xl md:text-2xl font-bold text-center uppercase tracking-widest gold-text mb-7">
                Web Designer and Developer
              </h1>

              {/* Profile Photo */}
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-sm overflow-hidden border-2 border-primary shadow-gold">
                  <img
                    src="/assets/img_20260329_205345-019d3f24-afe3-739e-9cda-957beb0b02fd.png"
                    alt="Sarang Kumar"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Name & Location */}
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  Sarang Kumar
                </h2>
                <p className="text-muted-foreground text-sm">
                  Hyderabad, India
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Web Developer \u00b7 Designer \u00b7 Digital Solutions Expert
                </p>
              </div>

              {/* Tagline */}
              <p className="text-center text-sm text-muted-foreground leading-relaxed mb-7 px-2">
                Building high-performance digital experiences for modern
                businesses. Turning ideas into powerful web solutions.
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-3 mb-7">
                <a
                  href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors"
                  data-ocid="portfolio.link"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
                <a
                  href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors"
                  data-ocid="portfolio.link"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> AI Demo
                </a>
              </div>

              {/* NEXT Button */}
              <Button
                className="w-full btn-gold text-sm tracking-wider uppercase"
                onClick={() => setShowFull(true)}
                data-ocid="portfolio.primary_button"
              >
                View Full Portfolio <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Full Portfolio */}
          {/* Stats */}
          <section className="border-b border-border/60 bg-card/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  <span className="gold-text">Sarang Kumar</span>
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFull(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                  data-ocid="portfolio.secondary_button"
                >
                  \u2190 Back
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div
                    key={h.label}
                    className="text-center p-4 rounded-xl bg-card border border-border/60"
                  >
                    <div className="font-display text-2xl font-bold gold-text">
                      {h.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="font-display text-2xl font-bold mb-4">
                  About Me
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  I\u2019m a passionate Web Designer & Developer based in
                  Hyderabad with 3+ years of experience delivering
                  high-performance digital solutions for businesses across
                  India. I specialize in React, Next.js, and WordPress
                  development with a keen eye for UI/UX design.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Through SK Web Solutions, I\u2019ve helped 40+ clients
                  transform their digital presence \u2014 from startups
                  launching their first website to established businesses
                  scaling their e-commerce operations.
                </p>
                <div className="flex gap-3 mt-6">
                  <a
                    href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                    data-ocid="portfolio.link"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                  <a
                    href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                    data-ocid="portfolio.link"
                  >
                    <ExternalLink className="h-4 w-4" /> AI Demo Production
                  </a>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-sm overflow-hidden border-2 border-primary shadow-gold">
                  <img
                    src="/assets/img_20260329_205345-019d3f24-afe3-739e-9cda-957beb0b02fd.png"
                    alt="Sarang Kumar"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="border-t border-border/60 bg-card/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
              <h2 className="font-display text-2xl font-bold mb-6">
                Core Skills
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {SKILLS.map((skill) => (
                  <div
                    key={skill.label}
                    className="flex gap-4 p-5 rounded-xl bg-card border border-border/60 card-hover"
                  >
                    <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shrink-0">
                      <skill.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">
                        {skill.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Ad Banner */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="relative rounded-xl overflow-hidden border-2 border-primary/60 p-6 md:p-8 bg-card shadow-gold">
              <div className="absolute inset-0 gold-gradient opacity-5" />
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-xl text-primary-foreground">
                    SK
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-2 border-primary/40 text-primary bg-primary/10">
                    Available for Projects
                  </Badge>
                  <h3 className="font-display text-xl font-bold gold-text">
                    SK Website Designer & Developer
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Hyderabad\u2019s trusted web development partner \u2014
                    delivering premium digital solutions since 2022.
                  </p>
                </div>
                <Button
                  className="btn-gold shrink-0"
                  onClick={onSwitchToBusiness}
                  data-ocid="portfolio.primary_button"
                >
                  View Business Site
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/60 py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                \u00a9 {new Date().getFullYear()} Sarang Kumar \u00b7{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Built with caffeine.ai
                </a>
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  data-ocid="portfolio.link"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </main>
  );
}
