import ChatWidget from "@/components/ChatWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  Activity,
  ArrowRight,
  Award,
  Building,
  Building2,
  CheckCircle,
  ChevronDown,
  Code,
  Download,
  ExternalLink,
  Eye,
  Github,
  Globe,
  Heart,
  Home,
  Layers,
  Layout,
  Linkedin,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  Phone,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  Twitter,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// Business types (defined locally since they extend the backend declarations)
interface Listing {
  id: bigint;
  title: string;
  description: string;
  category: string;
  price: string;
  techTags: string[];
  status: string;
  featured: boolean;
}
interface ServicePackage {
  id: bigint;
  name: string;
  description: string;
  price: string;
  features: string[];
  popular: boolean;
}
interface Inquiry {
  id: bigint;
  clientName: string;
  email: string;
  phone: string;
  message: string;
  serviceType: string;
  status: string;
  notes: string;
  timestamp: bigint;
}
interface UserActivity {
  id: bigint;
  principalText: string;
  action: string;
  detail: string;
  timestamp: bigint;
}
interface SearchTermCount {
  term: string;
  count: bigint;
}
interface BusinessActor {
  getListings(): Promise<Listing[]>;
  getPackages(): Promise<ServicePackage[]>;
  submitInquiry(
    name: string,
    email: string,
    phone: string,
    message: string,
    serviceType: string,
  ): Promise<bigint>;
  getMyInquiries(): Promise<Inquiry[]>;
  getAllInquiries(): Promise<Inquiry[]>;
  updateInquiryStatus(
    id: bigint,
    status: string,
    notes: string,
  ): Promise<boolean>;
  getInsights(): Promise<[bigint, bigint, bigint, bigint]>;
  updateListing(l: Listing): Promise<boolean>;
  deleteListing(id: bigint): Promise<boolean>;
  updatePackage(p: ServicePackage): Promise<boolean>;
  isCallerAdmin(): Promise<boolean>;
  logActivity(action: string, detail: string): Promise<void>;
  getActivityLog(): Promise<UserActivity[]>;
  getSearchTerms(): Promise<SearchTermCount[]>;
}

// ── Static image imports (required for build pipeline) ──────────────────────
import profilePhoto from "/assets/img-20260121-wa0214-019d3e4e-36ce-728e-b593-0d2034a1fbff.jpg";
import businessCard from "/assets/img_20260329_205345-019d3f24-afe3-739e-9cda-957beb0b02fd.png";

// Marketplace listing images
import listingCorporate from "/assets/generated/listing-corporate.dim_800x500.jpg";
import listingEcommerce from "/assets/generated/listing-ecommerce.dim_800x500.jpg";
import listingEducation from "/assets/generated/listing-education.dim_800x500.jpg";
import listingPortfolio from "/assets/generated/listing-portfolio.dim_800x500.jpg";
import listingRealestate from "/assets/generated/listing-realestate.dim_800x500.jpg";
import listingRestaurant from "/assets/generated/listing-restaurant.dim_800x500.jpg";

// ── Constants ────────────────────────────────────────────────────────────────
const NAVY = "#0a1628";
const GOLD = "#d4af37";
const _GOLD_LIGHT = "#f0d060";

// ── ErrorBoundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App error caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "#0a1628",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              color: "#d4af37",
              fontSize: "1.5rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Something went wrong. Please refresh the page.
          </h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#d4af37",
              color: "#0a1628",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 2rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const EXPERIENCE = [
  {
    title: "Credit Manager",
    company: "Cris Financial Ltd",
    period: "Jul 2023 – Present",
    bullets: [
      "Underwriting LAP & NANO loans ensuring compliance with credit policies.",
      "Prepared MIS reports including login fee reconciliation, sanctioned analysis, and reject analysis.",
      "PD's / recommendations & Sanctions.",
      "Income analysis & Bureau analysis.",
      "Vendor Management.",
      "Technical and RCU invoice checking and payments.",
      "Coordination with CPA team operations.",
      "Improved loan approval turnaround by 20% through optimized underwriting processes.",
      "Reduced data errors by 15% via enhanced MIS reporting and reconciliation.",
      "Operations: CERSAI, Physical files checking.",
    ],
  },
  {
    title: "Process Associate",
    company: "Spandana Sphoorthy Financial Ltd",
    period: "Jan 2023 – Jul 2023",
    bullets: [
      "Performed backend operations including data entry and KYC verification.",
      "Ensured accuracy and compliance in daily processing tasks.",
      "Streamlined KYC verification process reducing turnaround time by 10%.",
    ],
  },
  {
    title: "Operations Executive",
    company: "Tata AIG General Insurance",
    period: "Jan 2022 – Jan 2023",
    bullets: [
      "Booked and processed general insurance policies accurately.",
      "Executed data entry tasks to maintain seamless policy administration.",
      "Enhanced policy booking accuracy by implementing quality checks, reducing errors by 12%.",
    ],
  },
];

const EDUCATION = [
  { degree: "S.S.C", institution: "MHV High School", year: "July 2016" },
  {
    degree: "Intermediate",
    institution: "HMV Junior College",
    year: "April 2018",
  },
  {
    degree: "B.Com (Computers)",
    institution: "HMV Degree College, Osmania University",
    year: "Oct 2021",
  },
];

const SKILLS = [
  "Software Testing (Manual)",
  "MS Excel",
  "MS Office",
  "MS Word",
  "MS PowerPoint",
  "Project Presentations",
  "LAP Underwriting",
  "Credit MIS Reporting",
  "KYC Verification",
  "Data Entry",
  "CERSAI",
  "CPA Processing",
  "Website Design & Development",
  "Data Analysis",
];

const LISTING_IMAGES: Record<string, string> = {
  Corporate: listingCorporate,
  "E-Commerce": listingEcommerce,
  Restaurant: listingRestaurant,
  "Real Estate": listingRealestate,
  Education: listingEducation,
  Portfolio: listingPortfolio,
};

const DEFAULT_LISTINGS: Listing[] = [
  {
    id: 1n,
    title: "Corporate Business Website",
    description:
      "Professional corporate site with services, team, and contact sections.",
    category: "Corporate",
    price: "₹15,000",
    techTags: ["React", "Tailwind", "Node.js"],
    status: "available",
    featured: true,
  },
  {
    id: 2n,
    title: "E-Commerce Store",
    description:
      "Full-featured online store with cart, payments, and product management.",
    category: "E-Commerce",
    price: "₹25,000",
    techTags: ["Next.js", "Stripe", "MongoDB"],
    status: "available",
    featured: true,
  },
  {
    id: 3n,
    title: "Restaurant & Food Portal",
    description:
      "Menu showcase, online ordering, and table reservation system.",
    category: "Restaurant",
    price: "₹18,000",
    techTags: ["React", "Firebase", "Razorpay"],
    status: "available",
    featured: false,
  },
  {
    id: 4n,
    title: "Real Estate Listings",
    description:
      "Property showcase with filters, map integration, and lead capture.",
    category: "Real Estate",
    price: "₹22,000",
    techTags: ["Vue.js", "Google Maps", "MySQL"],
    status: "available",
    featured: true,
  },
  {
    id: 5n,
    title: "Education & LMS Platform",
    description:
      "Course catalog, student portal, and online learning management system.",
    category: "Education",
    price: "₹30,000",
    techTags: ["React", "Node.js", "PostgreSQL"],
    status: "available",
    featured: false,
  },
  {
    id: 6n,
    title: "Personal Portfolio Website",
    description:
      "Stunning personal portfolio with projects, resume, and contact form.",
    category: "Portfolio",
    price: "₹8,000",
    techTags: ["React", "Tailwind", "Framer Motion"],
    status: "available",
    featured: false,
  },
];

const DEFAULT_PACKAGES: ServicePackage[] = [
  {
    id: 1n,
    name: "Starter",
    price: "₹8,000",
    description: "Perfect for individuals and small businesses.",
    features: [
      "1–5 Page Website",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form",
      "3 Revisions",
      "1 Month Support",
    ],
    popular: false,
  },
  {
    id: 2n,
    name: "Professional",
    price: "₹18,000",
    description: "Ideal for growing businesses needing more functionality.",
    features: [
      "Up to 10 Pages",
      "Custom Design",
      "Advanced SEO",
      "CMS Integration",
      "E-Commerce Ready",
      "Unlimited Revisions",
      "3 Months Support",
      "Google Analytics",
    ],
    popular: true,
  },
  {
    id: 3n,
    name: "Enterprise",
    price: "₹35,000",
    description: "Full-featured solution for large businesses.",
    features: [
      "Unlimited Pages",
      "Custom Web App",
      "Database Integration",
      "Admin Dashboard",
      "API Integrations",
      "Priority Support 6 Months",
      "Performance Optimization",
      "Security Audit",
    ],
    popular: false,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getListingImage(category: string) {
  return LISTING_IMAGES[category] || listingCorporate;
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    inProgress: "bg-orange-100 text-orange-800",
    closed: "bg-green-100 text-green-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

// ══════════════════════════════════════════════════════════════════════════════
// PERSONAL PORTFOLIO COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function SplashPage({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a2f50 100%)`,
      }}
    >
      {/* Bold heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-4xl font-bold tracking-widest mb-10 uppercase text-center"
        style={{ color: GOLD, letterSpacing: "0.2em" }}
      >
        Web Designer and Developer
      </motion.h1>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative p-8 sm:p-12 max-w-md w-full"
        style={{
          border: `2px solid ${GOLD}`,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Gold corner accents */}
        {[
          ["top-0 left-0", "border-t-4 border-l-4"],
          ["top-0 right-0", "border-t-4 border-r-4"],
          ["bottom-0 left-0", "border-b-4 border-l-4"],
          ["bottom-0 right-0", "border-b-4 border-r-4"],
        ].map(([pos, cls], i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
            key={i}
            className={`absolute ${pos} w-6 h-6 ${cls}`}
            style={{ borderColor: GOLD }}
          />
        ))}

        {/* Square profile photo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-32 h-32 overflow-hidden"
            style={{ border: `3px solid ${GOLD}` }}
          >
            <img
              src={profilePhoto}
              alt="Sarang Kumar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-widest mb-1">
            SARANG KUMAR
          </h2>
          <p className="text-sm mb-6" style={{ color: GOLD }}>
            Credit Manager | Web Designer &amp; Developer
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              "Credit Manager",
              "B.Com Graduate",
              "Hyderabad",
              "4+ Years Experience",
            ].map((b) => (
              <span
                key={b}
                className="px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  color: GOLD,
                  border: `1px solid ${GOLD}`,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            data-ocid="splash.primary_button"
            className="px-8 py-3 font-bold tracking-widest uppercase flex items-center gap-2 mx-auto"
            style={{ background: GOLD, color: NAVY, border: "none" }}
          >
            NEXT <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PortfolioHeader({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header
      className="sticky top-0 z-40 shadow-lg"
      style={{ background: NAVY }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <span
          className="text-xl font-bold"
          style={{ color: GOLD, fontFamily: "PlayfairDisplay, serif" }}
        >
          SK
        </span>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors hover:text-yellow-400"
              style={{
                color: activeSection === l.href.slice(1) ? GOLD : "#cbd5e1",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/sarang-kumar-854214257/"
            target="_blank"
            rel="noreferrer"
            data-ocid="header.link"
            title="LinkedIn"
          >
            <Linkedin
              size={28}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            />
          </a>
          <a
            href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:block text-xs px-3 py-1 rounded"
            style={{
              background: "rgba(212,175,55,0.15)",
              color: GOLD,
              border: `1px solid ${GOLD}`,
            }}
          >
            AI Demo Production
          </a>
          <a
            href="/assets/resume-_mr.sarang-019d3e3e-c529-700a-b7eb-02702da4c6a8.pdf"
            download
            className="hidden sm:flex items-center gap-1 text-xs px-3 py-1 rounded font-medium"
            style={{ background: GOLD, color: NAVY }}
          >
            <Download size={12} /> Resume
          </a>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: GOLD }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: NAVY }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block py-2 text-sm text-slate-300 hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://www.linkedin.com/in/sarang-kumar-854214257/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 mt-2 text-blue-400"
          >
            <Linkedin size={20} /> LinkedIn
          </a>
          <a
            href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 mt-2"
            style={{ color: GOLD }}
          >
            <Globe size={16} /> AI Demo Production
          </a>
        </div>
      )}
    </header>
  );
}

function PortfolioHero() {
  return (
    <section
      id="home"
      className="py-20 px-4"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a2f50 100%)`,
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-40 h-40 md:w-52 md:h-52 flex-shrink-0 overflow-hidden"
          style={{ border: `4px solid ${GOLD}` }}
        >
          <img
            src={profilePhoto}
            alt="Sarang Kumar"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "PlayfairDisplay, serif" }}
          >
            Sarang Kumar
          </h1>
          <p className="text-lg mb-2" style={{ color: GOLD }}>
            Credit Manager | Web Designer &amp; Developer
          </p>
          <p className="text-slate-300 mb-6 max-w-xl">
            Dynamic professional with 4+ years of experience in credit
            management and financial operations, blending analytical excellence
            with modern web development skills.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/assets/resume-_mr.sarang-019d3e3e-c529-700a-b7eb-02702da4c6a8.pdf"
              download
              data-ocid="hero.primary_button"
              className="flex items-center gap-2 px-5 py-2.5 font-semibold"
              style={{ background: GOLD, color: NAVY }}
            >
              <Download size={16} /> Download Resume
            </a>
            <a
              href="#contact"
              data-ocid="hero.secondary_button"
              className="flex items-center gap-2 px-5 py-2.5 font-semibold border"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <h2
        className="text-3xl font-bold"
        style={{ color: NAVY, fontFamily: "PlayfairDisplay, serif" }}
      >
        {title}
      </h2>
      {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
      <div className="w-16 h-1 mx-auto mt-3" style={{ background: GOLD }} />
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="Work Experience"
          subtitle="Professional journey & achievements"
        />
        <div
          className="relative border-l-2 pl-8 space-y-10"
          style={{ borderColor: GOLD }}
        >
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="absolute -left-2.5 w-5 h-5 rounded-full"
                style={{ background: GOLD, top: i === 0 ? "0" : "auto" }}
              />
              <div
                className="p-8 shadow-md"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: NAVY }}>
                      {exp.title}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: GOLD }}>
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: GOLD,
                      border: `1px solid ${GOLD}`,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {exp.bullets.map((b, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
                    <li key={j} className="text-sm text-slate-600">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
            Project Experience
          </h3>
          <div
            className="p-8 shadow-md"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-bold" style={{ color: NAVY }}>
                  Software Tester (Manual)
                </h4>
                <p className="text-sm" style={{ color: GOLD }}>
                  Synoriq — Internship
                </p>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
              <li>Worked as a Manual Tester on live banking software.</li>
              <li>
                Designed and executed test cases for web and mobile banking
                features.
              </li>
              <li>Performed regression, functional, and UAT testing.</li>
              <li>
                Identified and tracked 30+ bugs using Jira, improving software
                quality by 20%.
              </li>
              <li>
                Collaborated with developers to verify bug fixes and ensure
                requirements compliance.
              </li>
              <li>
                Documented test plans, results, and status reports for
                stakeholders.
              </li>
              <li>
                Participated in Agile sprints, contributing to sprint planning
                and retrospectives.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section
      id="education"
      className="py-20 px-6"
      style={{ background: "#f1f5f9" }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="Education" />
        <div className="grid md:grid-cols-3 gap-8">
          {EDUCATION.map((e, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 text-center shadow-md"
              style={{ background: "white", border: `2px solid ${GOLD}` }}
            >
              <div
                className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full text-white font-bold"
                style={{ background: GOLD, color: NAVY }}
              >
                {e.year.slice(-4)}
              </div>
              <h3 className="font-bold" style={{ color: NAVY }}>
                {e.degree}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{e.institution}</p>
              <p className="text-xs mt-2" style={{ color: GOLD }}>
                {e.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="Skills & Languages" />
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {SKILLS.map((s, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="px-4 py-2 text-sm font-medium"
              style={{
                background: "rgba(212,175,55,0.1)",
                color: NAVY,
                border: `1px solid ${GOLD}`,
              }}
            >
              {s}
            </motion.span>
          ))}
        </div>
        <div
          className="p-6 text-center"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <h4 className="font-semibold mb-3" style={{ color: NAVY }}>
            Languages Known
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Hindi", "English", "Telugu", "Marathi"].map((l) => (
              <span
                key={l}
                className="px-3 py-1 text-sm"
                style={{ background: NAVY, color: "white" }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalProfileSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="Personal Profile" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3 text-sm text-slate-700">
            {[
              ["Date of Birth", "23rd October 1999"],
              ["Marital Status", "Single"],
              ["Religion", "Hindu"],
              ["Nationality", "Indian"],
              ["Languages", "Hindi, English, Telugu, Marathi"],
              ["Location", "Hyderabad — 18 years"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span
                  className="font-semibold w-36 flex-shrink-0"
                  style={{ color: NAVY }}
                >
                  {k}:
                </span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: NAVY }}>
                Hobbies
              </h4>
              <div className="flex gap-2">
                {["Cricket", "Learning New Tech"].map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1 text-sm"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: GOLD,
                      border: `1px solid ${GOLD}`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: NAVY }}>
                Strengths
              </h4>
              <div className="flex gap-2">
                {["Quick Learner", "Positive Mindset"].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-sm"
                    style={{ background: "rgba(10,22,40,0.08)", color: NAVY }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-6"
      style={{ background: "#f1f5f9" }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="Contact" subtitle="Get in touch" />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Mail size={24} />,
              label: "Email",
              value: "sarangkumar408@gmail.com",
              href: "mailto:sarangkumar408@gmail.com",
            },
            {
              icon: <Phone size={24} />,
              label: "Phone",
              value: "+91 7095244790",
              href: "tel:+917095244790",
            },
            {
              icon: <MapPin size={24} />,
              label: "Address",
              value: "Hanuman Nagar, Shankarpally, Hyderabad 501203",
              href: "#",
            },
          ].map((c, i) => (
            <motion.a
              // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
              key={i}
              href={c.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              style={{ background: "white", border: `2px solid ${GOLD}` }}
            >
              <div className="mb-3" style={{ color: GOLD }}>
                {c.icon}
              </div>
              <p className="text-xs text-slate-400 mb-1">{c.label}</p>
              <p className="font-medium text-sm" style={{ color: NAVY }}>
                {c.value}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdBanner() {
  return (
    <section className="py-12 px-4" style={{ background: NAVY }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: GOLD, fontFamily: "PlayfairDisplay, serif" }}
          >
            SK Website Designer &amp; Developer
          </h2>
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">
            Transform your business with a professional website. I specialize in
            creating modern, responsive, and high-performance websites tailored
            to your business needs. From simple portfolios to complex web
            applications — delivered with excellence.
          </p>
          <div className="flex flex-col gap-2 text-sm text-slate-300 mb-5">
            <span className="flex items-center gap-2">
              <Phone size={14} style={{ color: GOLD }} /> +91 7095244790
            </span>
            <span className="flex items-center gap-2">
              <Mail size={14} style={{ color: GOLD }} />{" "}
              sarangkumar408@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} style={{ color: GOLD }} /> Hyderabad, Telangana
            </span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold"
            style={{ background: GOLD, color: NAVY }}
          >
            Get In Touch <ArrowRight size={16} />
          </a>
        </div>
        <div className="flex-shrink-0">
          <img
            src={businessCard}
            alt="SK Business Card"
            className="w-64 shadow-xl"
            style={{ border: `2px solid ${GOLD}` }}
          />
        </div>
      </div>
    </section>
  );
}

function PortfolioFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-14 px-6" style={{ background: "#040e1e" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: GOLD }}>
              Sarang Kumar
            </h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Credit Manager | Web Designer &amp; Developer based in Hyderabad,
              India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">Contact</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>sarangkumar408@gmail.com</p>
              <p>+91 7095244790</p>
              <p>Hyderabad, Telangana 501203</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white">Links</h4>
            <div className="space-y-2">
              <a
                href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <a
                href="https://sarangkumarnetwork.my.canva.site/sarang-productions"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm hover:text-yellow-300"
                style={{ color: GOLD }}
              >
                <Globe size={14} /> AI Demo Production
              </a>
              <a
                href="/assets/resume-_mr.sarang-019d3e3e-c529-700a-b7eb-02702da4c6a8.pdf"
                download
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
              >
                <Download size={14} /> Download Resume
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/sarang-kumar-854214257/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin
                size={20}
                className="text-slate-400 hover:text-blue-400"
              />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github size={20} className="text-slate-400 hover:text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter
                size={20}
                className="text-slate-400 hover:text-sky-400"
              />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {year}. Built with{" "}
            <Heart size={12} className="inline text-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function PersonalPortfolioSite() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // biome-ignore lint/correctness/useExhaustiveDependencies: showSplash re-triggers observation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = document.querySelectorAll("section[id]");
    for (const s of sections) {
      observer.observe(s);
    }
    return () => observer.disconnect();
  }, [showSplash]);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashPage key="splash" onNext={() => setShowSplash(false)} />
      ) : (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PortfolioHeader activeSection={activeSection} />
          <PortfolioHero />
          <section className="py-16 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="Career Objective" />
              <blockquote
                className="text-center text-slate-600 italic border-l-4 pl-6 py-2 text-base max-w-2xl mx-auto"
                style={{ borderColor: GOLD }}
              >
                "Seeking a dynamic role that leverages my financial expertise
                and credit management skills to drive organizational growth
                while continuously evolving as a professional."
              </blockquote>
            </div>
          </section>
          <ExperienceSection />
          <EducationSection />
          <SkillsSection />
          <PersonalProfileSection />
          <ContactSection />
          <AdBanner />
          <PortfolioFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BUSINESS SITE: SK WEB SOLUTIONS
// ══════════════════════════════════════════════════════════════════════════════

function BusinessHeader({
  activePage,
  setActivePage,
  isAdmin,
  onLogout,
}: {
  activePage: string;
  setActivePage: (p: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sk-dark-mode") === "true";
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("sk-dark-mode", darkMode.toString());
  }, [darkMode]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pages = [
    { id: "landing", label: "Home" },
    { id: "marketplace", label: "Marketplace" },
    { id: "services", label: "Services" },
    { id: "quote", label: "Get Quote" },
    { id: "contact", label: "Contact" },
    ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];
  return (
    <header
      className="sticky top-0 z-40 shadow-lg"
      style={{
        background: scrolled ? "rgba(10,22,40,0.85)" : NAVY,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled
          ? "0 4px 24px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        borderBottom: scrolled ? `1px solid ${GOLD}30` : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <button
          type="button"
          onClick={() => setActivePage("landing")}
          className="text-xl font-bold"
          style={{ color: GOLD, fontFamily: "PlayfairDisplay, serif" }}
        >
          SK Web Solutions
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {pages.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className="text-sm transition-colors hover:text-yellow-400"
              style={{ color: activePage === p.id ? GOLD : "#cbd5e1" }}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            data-ocid="business.toggle"
            className="p-1.5 rounded-full transition-colors hover:bg-white/10"
            style={{ color: GOLD }}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 text-sm text-slate-300 hover:text-white"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: GOLD }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: NAVY }}>
          {pages.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                setActivePage(p.id);
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-yellow-400"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function InteriorDesignSection({
  setActivePage,
}: { setActivePage: (p: string) => void }) {
  const services = [
    {
      icon: <Home size={28} />,
      title: "Residential Interior Design",
      desc: "Complete home makeovers — living rooms, bedrooms, kitchens — crafted for comfort and elegance.",
      price: "From ₹25,000",
    },
    {
      icon: <Building2 size={28} />,
      title: "Commercial Space Design",
      desc: "Office, retail, and hospitality spaces designed to impress clients and boost productivity.",
      price: "From ₹40,000",
    },
    {
      icon: <Layers size={28} />,
      title: "3D Visualization & Rendering",
      desc: "Photorealistic 3D renders so you see your space before a single wall is touched.",
      price: "From ₹8,000",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Interior Consultation",
      desc: "One-on-one expert sessions to plan layouts, palettes, and materials within your budget.",
      price: "₹2,500 / session",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "#f8fafc" }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Interior Design Services"
          subtitle="Transform spaces with creative, functional, and stunning design solutions"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 32px rgba(212,175,55,0.18)",
              }}
              data-ocid={`interior.item.${i + 1}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div className="p-6 flex-1">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212,175,55,0.12)", color: GOLD }}
                >
                  {s.icon}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: NAVY, fontFamily: "PlayfairDisplay, serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {s.desc}
                </p>
                <p className="text-sm font-bold" style={{ color: GOLD }}>
                  {s.price}
                </p>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setActivePage("contact")}
                  data-ocid={`interior.primary_button.${i + 1}`}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: GOLD, color: NAVY }}
                >
                  Enquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessLanding({
  setActivePage,
}: { setActivePage: (p: string) => void }) {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-28 px-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #1a2f50 100%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "PlayfairDisplay, serif" }}
          >
            Crafting High-Performance{" "}
            <span style={{ color: GOLD }}>Digital Solutions</span> for Modern
            Businesses
          </h1>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Professional web design &amp; development services in Hyderabad.
            From stunning portfolios to full-scale e-commerce platforms.
          </p>
          <p className="flex items-center justify-center gap-1.5 text-slate-400 text-sm mb-6">
            <MapPin size={14} style={{ color: GOLD }} />
            Serving Hyderabad &amp; Beyond
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivePage("marketplace")}
              data-ocid="landing.primary_button"
              className="px-8 py-3 font-bold"
              style={{ background: GOLD, color: NAVY }}
            >
              View Marketplace
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivePage("quote")}
              data-ocid="landing.secondary_button"
              className="px-8 py-3 font-bold border border-white text-white"
              style={{ background: "transparent" }}
            >
              Get a Quote
            </motion.button>
          </div>
        </motion.div>
        {/* Stats */}
        <div className="mt-18 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            ["6+", "Website Templates"],
            ["3", "Service Packages"],
            ["100%", "Custom Built"],
            ["Hyderabad", "Based"],
          ].map(([v, l], i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
              key={i}
              className="p-4"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
            >
              <div className="text-2xl font-bold" style={{ color: GOLD }}>
                {v}
              </div>
              <div className="text-xs text-slate-400 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-6" style={{ background: "#0d1f3c" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: GOLD, fontFamily: "PlayfairDisplay, serif" }}
          >
            Technologies We Master
          </h2>
          <div
            className="w-12 h-0.5 mx-auto mb-8"
            style={{ background: GOLD }}
          />
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { name: "React", color: "#61dafb", bg: "rgba(97,218,251,0.12)" },
              {
                name: "Next.js",
                color: "#ffffff",
                bg: "rgba(255,255,255,0.08)",
              },
              {
                name: "WordPress",
                color: "#21759b",
                bg: "rgba(33,117,155,0.18)",
              },
              {
                name: "Tailwind CSS",
                color: "#38bdf8",
                bg: "rgba(56,189,248,0.12)",
              },
              {
                name: "Node.js",
                color: "#68a063",
                bg: "rgba(104,160,99,0.15)",
              },
              {
                name: "Tableau",
                color: "#e97627",
                bg: "rgba(233,118,39,0.15)",
              },
              { name: "MongoDB", color: "#4db33d", bg: "rgba(77,179,61,0.15)" },
              { name: "Stripe", color: "#635bff", bg: "rgba(99,91,255,0.15)" },
              { name: "Vue.js", color: "#42b883", bg: "rgba(66,184,131,0.15)" },
              {
                name: "Firebase",
                color: "#ffca28",
                bg: "rgba(255,202,40,0.12)",
              },
            ].map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.08 }}
                className="px-4 py-2 text-sm font-semibold rounded-full"
                style={{
                  background: tech.bg,
                  color: tech.color,
                  border: `1px solid ${tech.color}40`,
                }}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 px-6" style={{ background: "#f1f5f9" }}>
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="Case Studies"
            subtitle="Real results for real businesses"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "RetailMax E-Commerce",
                challenge:
                  "Outdated store losing conversions due to slow performance and poor UX",
                solution: "React + Next.js + Stripe",
                results: [
                  "40% increase in conversion rate",
                  "60% faster load time",
                  "2x mobile revenue",
                ],
                icon: <ShoppingCart size={24} />,
              },
              {
                title: "EduLearn LMS",
                challenge:
                  "No online learning platform; students dependent on in-person classes",
                solution: "React + Node.js + PostgreSQL",
                results: [
                  "500+ students enrolled in 30 days",
                  "98% course completion rate",
                  "3x instructor revenue",
                ],
                icon: <Users size={24} />,
              },
              {
                title: "PropertyHub Real Estate",
                challenge:
                  "Manual lead capture causing delayed follow-ups and lost prospects",
                solution: "Vue.js + Google Maps + MySQL",
                results: [
                  "3x more leads generated",
                  "50% reduction in response time",
                  "₹12L+ deals closed",
                ],
                icon: <Building size={24} />,
              },
            ].map((cs, i) => (
              <motion.div
                key={cs.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 30px rgba(212,175,55,0.2)",
                }}
                className="bg-white shadow-md overflow-hidden"
                data-ocid={`casestudies.item.${i + 1}`}
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="p-2" style={{ background: NAVY }}>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div style={{ color: GOLD }}>{cs.icon}</div>
                    <h3 className="font-bold text-white text-sm">{cs.title}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#ef4444" }}
                    >
                      Challenge
                    </p>
                    <p className="text-sm text-slate-600">{cs.challenge}</p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#3b82f6" }}
                    >
                      Solution
                    </p>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>
                      {cs.solution}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#16a34a" }}
                    >
                      Results
                    </p>
                    <ul className="space-y-1">
                      {cs.results.map((r) => (
                        <li
                          key={r}
                          className="flex items-center gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle size={12} style={{ color: GOLD }} /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="What We Offer"
            subtitle="Comprehensive web solutions for every need"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout size={32} />,
                title: "Custom Web Design",
                desc: "Unique, branded designs that reflect your identity and captivate visitors.",
              },
              {
                icon: <Code size={32} />,
                title: "Web Development",
                desc: "Robust, scalable applications built with modern technologies.",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "SEO & Growth",
                desc: "Optimized for search engines to drive organic traffic and leads.",
              },
            ].map((s, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div
                  className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.15)", color: GOLD }}
                >
                  {s.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: NAVY }}>
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interior Design Services */}
      <InteriorDesignSection setActivePage={setActivePage} />

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: NAVY }}>
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Build Your Dream Website?
        </h2>
        <p className="text-slate-300 mb-8">
          Contact us today and get a free consultation.
        </p>
        <Button
          onClick={() => setActivePage("contact")}
          className="px-8 py-3 font-bold"
          style={{ background: GOLD, color: NAVY }}
        >
          Start Your Project
        </Button>
      </section>
    </div>
  );
}

function MarketplacePage({
  setActivePage,
  setPrefilledService,
}: {
  setActivePage: (p: string) => void;
  setPrefilledService: (s: string) => void;
}) {
  const { actor, isFetching } = useActor();
  const [listings, setListings] = useState<Listing[]>(DEFAULT_LISTINGS);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as unknown as BusinessActor)
      .getListings()
      .then((data) => {
        if (data.length > 0) setListings(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  function handleSearchChange(term: string) {
    setSearchTerm(term);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (term.trim()) {
      searchTimerRef.current = setTimeout(() => {
        if (actor)
          (actor as unknown as BusinessActor)
            .logActivity("search", term.trim())
            .catch(() => {});
      }, 500);
    }
  }

  const categories = [
    "All",
    ...Array.from(new Set(listings.map((l) => l.category))),
  ];
  const filtered = listings.filter((l) => {
    const matchesFilter = filter === "All" || l.category === filter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6" style={{ background: "#f1f5f9" }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Website Marketplace"
          subtitle="Ready-to-deploy templates for your industry"
        />
        {/* Search */}
        <div className="flex justify-center mb-5">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim() && actor) {
                  if (searchTimerRef.current)
                    clearTimeout(searchTimerRef.current);
                  (actor as unknown as BusinessActor)
                    .logActivity("search", searchTerm.trim())
                    .catch(() => {});
                }
              }}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white text-sm outline-none focus:border-amber-400 transition-colors"
              data-ocid="marketplace.search_input"
            />
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setFilter(cat)}
              data-ocid="marketplace.tab"
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={
                filter === cat
                  ? { background: GOLD, color: NAVY }
                  : {
                      background: "white",
                      color: NAVY,
                      border: "1px solid #e2e8f0",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l, i) => (
            <motion.div
              key={l.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 30px rgba(212,175,55,0.2)",
              }}
              className="bg-white shadow-md overflow-hidden"
              data-ocid={`marketplace.item.${i + 1}`}
            >
              <div className="relative">
                <img
                  src={getListingImage(l.category)}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
                {l.featured && (
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2 py-1"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    Featured
                  </span>
                )}
                <span
                  className="absolute top-3 right-3 text-xs font-bold px-2 py-1 text-white"
                  style={{ background: NAVY }}
                >
                  {l.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1" style={{ color: NAVY }}>
                  {l.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{l.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {l.techTags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        color: GOLD,
                        border: `1px solid ${GOLD}`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg" style={{ color: GOLD }}>
                    {l.price}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPrefilledService(l.category);
                      setActivePage("contact");
                    }}
                    data-ocid={"marketplace.primary_button"}
                    style={{ background: NAVY, color: "white" }}
                  >
                    Inquire Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage({
  setActivePage,
}: { setActivePage: (p: string) => void }) {
  const { actor, isFetching } = useActor();
  const [packages, setPackages] = useState<ServicePackage[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as unknown as BusinessActor)
      .getPackages()
      .then((data) => {
        if (data.length > 0) setPackages(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          title="Service Packages"
          subtitle="Choose the right plan for your business"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 30px rgba(212,175,55,0.2)",
              }}
              className="relative p-6 shadow-md"
              data-ocid={`services.item.${i + 1}`}
              style={
                pkg.popular
                  ? { border: `2px solid ${GOLD}`, background: "#fefce8" }
                  : { border: "1px solid #e2e8f0" }
              }
            >
              {pkg.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1"
                  style={{ background: GOLD, color: NAVY }}
                >
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-1" style={{ color: NAVY }}>
                {pkg.name}
              </h3>
              <div className="text-3xl font-bold mb-2" style={{ color: GOLD }}>
                {pkg.price}
              </div>
              <p className="text-sm text-slate-500 mb-5">{pkg.description}</p>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((f, j) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
                    key={j}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: GOLD }}
                    />{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setActivePage("contact")}
                data-ocid={`services.primary_button.${i + 1}`}
                className="w-full"
                style={
                  pkg.popular
                    ? { background: GOLD, color: NAVY }
                    : { background: NAVY, color: "white" }
                }
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage({ prefilledService }: { prefilledService: string }) {
  const { actor, isFetching } = useActor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceType: prefilledService || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledService)
      setForm((f) => ({ ...f, serviceType: prefilledService }));
  }, [prefilledService]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (!form.serviceType) e.serviceType = "Please select a service type";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (!actor) {
      toast.error("Still connecting, please wait a moment and try again.");
      return;
    }
    setLoading(true);
    try {
      await (actor as unknown as BusinessActor).submitInquiry(
        form.name,
        form.email,
        form.phone,
        form.message,
        form.serviceType,
      );
      setSubmitted(true);
      (actor as unknown as BusinessActor)
        .logActivity("inquiry", form.serviceType)
        .catch(() => {});
      toast.success("Inquiry submitted! We'll get back to you soon.");
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section
        className="py-20 px-4 text-center"
        style={{ background: "#f1f5f9" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          data-ocid="contact.success_state"
        >
          <CheckCircle
            size={64}
            className="mx-auto mb-4"
            style={{ color: GOLD }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>
            Inquiry Submitted!
          </h2>
          <p className="text-slate-500">We'll contact you within 24 hours.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6" style={{ background: "#f1f5f9" }}>
      <div className="max-w-2xl mx-auto">
        <SectionTitle
          title="Get In Touch"
          subtitle="Tell us about your project"
        />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-md space-y-5"
          data-ocid="contact.modal"
        >
          <div>
            <Label htmlFor="c-name">Full Name *</Label>
            <Input
              id="c-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your full name"
              className="mt-1"
              data-ocid="contact.input"
            />
            {errors.name && (
              <p
                className="text-red-500 text-xs mt-1"
                data-ocid="contact.error_state"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="c-email">Email *</Label>
            <Input
              id="c-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="your@email.com"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="c-phone">Phone *</Label>
            <Input
              id="c-phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+91 XXXXXXXXXX"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="c-service">Service Type *</Label>
            <Select
              value={form.serviceType}
              onValueChange={(v) => setForm((f) => ({ ...f, serviceType: v }))}
            >
              <SelectTrigger className="mt-1" data-ocid="contact.select">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "New Website",
                  "Website Upgrade",
                  "E-Commerce",
                  "Portfolio",
                  "Other",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>
            )}
          </div>
          <div>
            <Label htmlFor="c-message">Message *</Label>
            <Textarea
              id="c-message"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Describe your project..."
              rows={4}
              className="mt-1"
              data-ocid="contact.textarea"
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || isFetching}
            className="w-full font-bold py-3"
            style={{ background: GOLD, color: NAVY }}
            data-ocid="contact.submit_button"
          >
            {isFetching
              ? "Connecting..."
              : loading
                ? "Submitting..."
                : "Submit Inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function ClientPortal() {
  const { actor } = useActor();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    (actor as unknown as BusinessActor)
      .getMyInquiries()
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const statusSteps = ["new", "contacted", "inProgress", "closed"];

  return (
    <section className="py-20 px-6" style={{ background: "#f1f5f9" }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="My Portal" subtitle="Track your inquiry status" />
        {loading ? (
          <p
            className="text-center text-slate-400"
            data-ocid="portal.loading_state"
          >
            Loading inquiries...
          </p>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-10" data-ocid="portal.empty_state">
            <p className="text-slate-400">
              No inquiries found. Submit an inquiry from the Contact page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inq, i) => (
              <div
                key={inq.id.toString()}
                className="bg-white p-6 shadow-sm"
                data-ocid={`portal.item.${i + 1}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: NAVY }}>
                      {inq.serviceType}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {inq.message.slice(0, 100)}
                      {inq.message.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${statusColor(inq.status)}`}
                  >
                    {inq.status}
                  </span>
                </div>
                <div className="flex gap-1">
                  {statusSteps.map((step, j) => (
                    <div
                      key={step}
                      className="flex-1 h-1.5 rounded-full"
                      style={{
                        background:
                          statusSteps.indexOf(inq.status) >= j
                            ? GOLD
                            : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminDashboard() {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState("insights");
  const [insights, setInsights] = useState<
    [bigint, bigint, bigint, bigint] | null
  >(null);
  const [listings, setListings] = useState<Listing[]>(DEFAULT_LISTINGS);
  const [packages, setPackages] = useState<ServicePackage[]>(DEFAULT_PACKAGES);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inqStatus, setInqStatus] = useState("");
  const [inqNotes, setInqNotes] = useState("");
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [editPackage, setEditPackage] = useState<ServicePackage | null>(null);
  const [saving, setSaving] = useState(false);

  const [activityLog, setActivityLog] = useState<UserActivity[]>([]);
  const [searchTerms, setSearchTerms] = useState<SearchTermCount[]>([]);

  useEffect(() => {
    if (!actor) return;
    Promise.all([
      (actor as unknown as BusinessActor).getInsights(),
      (actor as unknown as BusinessActor).getListings(),
      (actor as unknown as BusinessActor).getPackages(),
      (actor as unknown as BusinessActor).getAllInquiries(),
      (actor as unknown as BusinessActor).getActivityLog(),
      (actor as unknown as BusinessActor).getSearchTerms(),
    ])
      .then(([ins, lst, pkg, inq, log, terms]) => {
        setInsights(ins);
        if (lst.length > 0) setListings(lst);
        if (pkg.length > 0) setPackages(pkg);
        setInquiries(inq);
        setActivityLog(log);
        setSearchTerms(terms);
      })
      .catch(() => {});
  }, [actor]);

  async function saveInquiryStatus() {
    if (!actor || !selectedInquiry) return;
    setSaving(true);
    try {
      await (actor as unknown as BusinessActor).updateInquiryStatus(
        selectedInquiry.id,
        inqStatus,
        inqNotes,
      );
      setInquiries((prev) =>
        prev.map((x) =>
          x.id === selectedInquiry.id
            ? { ...x, status: inqStatus, notes: inqNotes }
            : x,
        ),
      );
      setSelectedInquiry(null);
      toast.success("Inquiry updated.");
    } catch {
      toast.error("Failed to update.");
    }
    setSaving(false);
  }

  async function saveListingEdit() {
    if (!actor || !editListing) return;
    setSaving(true);
    try {
      await (actor as unknown as BusinessActor).updateListing(editListing);
      setListings((prev) =>
        prev.map((x) => (x.id === editListing.id ? editListing : x)),
      );
      setEditListing(null);
      toast.success("Listing updated.");
    } catch {
      toast.error("Failed to update.");
    }
    setSaving(false);
  }

  async function deleteListing(id: bigint) {
    if (!actor) return;
    try {
      await (actor as unknown as BusinessActor).deleteListing(id);
      setListings((prev) => prev.filter((x) => x.id !== id));
      toast.success("Listing deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  }

  async function savePackageEdit() {
    if (!actor || !editPackage) return;
    setSaving(true);
    try {
      await (actor as unknown as BusinessActor).updatePackage(editPackage);
      setPackages((prev) =>
        prev.map((x) => (x.id === editPackage.id ? editPackage : x)),
      );
      setEditPackage(null);
      toast.success("Package updated.");
    } catch {
      toast.error("Failed to update.");
    }
    setSaving(false);
  }

  const kpiTiles = insights
    ? [
        {
          label: "Total Listings",
          value: insights[0].toString(),
          icon: <Globe size={24} />,
        },
        {
          label: "Available Listings",
          value: insights[1].toString(),
          icon: <CheckCircle size={24} />,
        },
        {
          label: "Total Inquiries",
          value: insights[2].toString(),
          icon: <Users size={24} />,
        },
        {
          label: "New Inquiries",
          value: insights[3].toString(),
          icon: <Zap size={24} />,
        },
      ]
    : [
        {
          label: "Total Listings",
          value: listings.length.toString(),
          icon: <Globe size={24} />,
        },
        {
          label: "Available",
          value: listings
            .filter((l) => l.status === "available")
            .length.toString(),
          icon: <CheckCircle size={24} />,
        },
        {
          label: "Inquiries",
          value: inquiries.length.toString(),
          icon: <Users size={24} />,
        },
        {
          label: "New",
          value: inquiries.filter((i) => i.status === "new").length.toString(),
          icon: <Zap size={24} />,
        },
      ];

  return (
    <section
      className="py-10 px-4"
      style={{ background: "#f1f5f9", minHeight: "80vh" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: NAVY, fontFamily: "PlayfairDisplay, serif" }}
        >
          Admin Dashboard
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6" style={{ background: NAVY }}>
            {[
              "insights",
              "listings",
              "inquiries",
              "packages",
              "users",
              "activity",
            ].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="capitalize"
                data-ocid={"admin.tab"}
                style={
                  activeTab === t
                    ? { background: GOLD, color: NAVY }
                    : { color: "#cbd5e1" }
                }
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Insights */}
          <TabsContent value="insights">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {kpiTiles.map((kpi, i) => (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6"
                  style={{ background: NAVY }}
                >
                  <div style={{ color: GOLD }} className="mb-2">
                    {kpi.icon}
                  </div>
                  <div className="text-3xl font-bold" style={{ color: GOLD }}>
                    {kpi.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Listings */}
          <TabsContent value="listings">
            <div className="bg-white shadow-sm overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((l, i) => (
                    <TableRow
                      key={l.id.toString()}
                      data-ocid={`admin.listings.row.${i + 1}`}
                    >
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell>{l.category}</TableCell>
                      <TableCell>{l.price}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${l.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {l.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditListing(l)}
                            data-ocid="admin.edit_button"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteListing(l.id)}
                            data-ocid="admin.delete_button"
                          >
                            Del
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Inquiries */}
          <TabsContent value="inquiries">
            <div className="bg-white shadow-sm overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-slate-400 py-8"
                        data-ocid="admin.inquiries.empty_state"
                      >
                        No inquiries yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inquiries.map((inq, i) => (
                      <TableRow
                        key={inq.id.toString()}
                        data-ocid={`admin.inquiries.row.${i + 1}`}
                      >
                        <TableCell>{inq.clientName}</TableCell>
                        <TableCell>{inq.serviceType}</TableCell>
                        <TableCell>{inq.email}</TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${statusColor(inq.status)}`}
                          >
                            {inq.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setInqStatus(inq.status);
                              setInqNotes(inq.notes);
                            }}
                            data-ocid="admin.edit_button"
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Packages */}
          <TabsContent value="packages">
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id.toString()}
                  className="bg-white p-5 shadow-sm"
                  data-ocid={`admin.packages.item.${i + 1}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold" style={{ color: NAVY }}>
                      {pkg.name}
                    </h3>
                    <span className="font-bold" style={{ color: GOLD }}>
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-500 mb-3 space-y-1">
                    {pkg.features.slice(0, 4).map((f, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list with stable order
                      <li key={j}>• {f}</li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditPackage(pkg)}
                    data-ocid={`admin.packages.edit_button.${i + 1}`}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <div className="bg-white p-8 text-center shadow-sm">
              <Users
                size={48}
                className="mx-auto mb-4"
                style={{ color: GOLD }}
              />
              <h3 className="font-bold text-lg mb-2" style={{ color: NAVY }}>
                User Management
              </h3>
              <p className="text-slate-500">
                User management is handled via Internet Identity role
                assignments. Admin roles are assigned through the backend access
                control system.
              </p>
            </div>
          </TabsContent>
          {/* Activity */}
          <TabsContent value="activity">
            <div className="space-y-8">
              {/* Login Summary KPI */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <LogIn size={20} style={{ color: GOLD }} />
                  <h3 className="font-bold text-lg" style={{ color: NAVY }}>
                    Login Summary
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6" style={{ background: NAVY }}>
                    <div style={{ color: GOLD }} className="mb-2">
                      <LogIn size={24} />
                    </div>
                    <div className="text-3xl font-bold" style={{ color: GOLD }}>
                      {
                        new Set(
                          activityLog
                            .filter((a) => a.action === "login")
                            .map((a) => a.principalText),
                        ).size
                      }
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Unique Logged-In Users
                    </div>
                  </div>
                  <div className="p-6" style={{ background: NAVY }}>
                    <div style={{ color: GOLD }} className="mb-2">
                      <Search size={24} />
                    </div>
                    <div className="text-3xl font-bold" style={{ color: GOLD }}>
                      {activityLog.filter((a) => a.action === "search").length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Total Searches
                    </div>
                  </div>
                  <div className="p-6" style={{ background: NAVY }}>
                    <div style={{ color: GOLD }} className="mb-2">
                      <Activity size={24} />
                    </div>
                    <div className="text-3xl font-bold" style={{ color: GOLD }}>
                      {activityLog.filter((a) => a.action === "inquiry").length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Client Inquiries
                    </div>
                  </div>
                  <div className="p-6" style={{ background: NAVY }}>
                    <div style={{ color: GOLD }} className="mb-2">
                      <Eye size={24} />
                    </div>
                    <div className="text-3xl font-bold" style={{ color: GOLD }}>
                      {activityLog.filter((a) => a.action === "visit").length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Total Page Visits
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={20} style={{ color: GOLD }} />
                  <h3 className="font-bold text-lg" style={{ color: NAVY }}>
                    Recent Activity Feed
                  </h3>
                </div>
                <div className="bg-white shadow-sm overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Detail</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLog.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-slate-400 py-8"
                            data-ocid="activity.empty_state"
                          >
                            No activity recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityLog
                          .slice(-50)
                          .reverse()
                          // biome-ignore lint/suspicious/noArrayIndexKey: activity log entries reversed slice
                          .map((entry, i) => {
                            const date = new Date(
                              Number(entry.timestamp) / 1_000_000,
                            );
                            const badgeStyle =
                              entry.action === "login"
                                ? { background: "#dbeafe", color: "#1e40af" }
                                : entry.action === "search"
                                  ? { background: "#fef3c7", color: "#92400e" }
                                  : { background: "#dcfce7", color: "#166534" };
                            return (
                              <TableRow
                                key={entry.id.toString()}
                                data-ocid={`activity.row.${i + 1}`}
                              >
                                <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                  {date.toLocaleString()}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {entry.principalText.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                  <span
                                    className="px-2 py-1 text-xs font-semibold rounded"
                                    style={badgeStyle}
                                  >
                                    {entry.action}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                  {entry.detail || "—"}
                                </TableCell>
                              </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Top Search Terms */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search size={20} style={{ color: GOLD }} />
                  <h3 className="font-bold text-lg" style={{ color: NAVY }}>
                    Top Search Terms
                  </h3>
                </div>
                <div className="bg-white shadow-sm overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Search Term</TableHead>
                        <TableHead>Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchTerms.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-slate-400 py-8"
                            data-ocid="activity.search.empty_state"
                          >
                            No searches recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        [...searchTerms]
                          .sort((a, b) => Number(b.count) - Number(a.count))
                          .slice(0, 20)
                          .map((s, i) => (
                            <TableRow
                              key={s.term}
                              data-ocid={`activity.search.item.${i + 1}`}
                            >
                              <TableCell className="text-slate-400 text-sm">
                                {i + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {s.term}
                              </TableCell>
                              <TableCell>
                                <span
                                  className="px-2 py-1 text-xs font-bold rounded"
                                  style={{
                                    background: "#fef3c7",
                                    color: "#92400e",
                                  }}
                                >
                                  {s.count.toString()}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Listing Dialog */}
      <Dialog
        open={!!editListing}
        onOpenChange={(open) => !open && setEditListing(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="admin.listing.dialog">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          {editListing && (
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={editListing.title}
                  onChange={(e) =>
                    setEditListing({ ...editListing, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={editListing.category}
                  onChange={(e) =>
                    setEditListing({ ...editListing, category: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  value={editListing.price}
                  onChange={(e) =>
                    setEditListing({ ...editListing, price: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editListing.description}
                  onChange={(e) =>
                    setEditListing({
                      ...editListing,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditListing(null)}
                  data-ocid="admin.listing.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveListingEdit}
                  disabled={saving}
                  style={{ background: GOLD, color: NAVY }}
                  data-ocid="admin.listing.save_button"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog
        open={!!editPackage}
        onOpenChange={(open) => !open && setEditPackage(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="admin.package.dialog">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          {editPackage && (
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={editPackage.name}
                  onChange={(e) =>
                    setEditPackage({ ...editPackage, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  value={editPackage.price}
                  onChange={(e) =>
                    setEditPackage({ ...editPackage, price: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editPackage.description}
                  onChange={(e) =>
                    setEditPackage({
                      ...editPackage,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  value={editPackage.features.join("\n")}
                  onChange={(e) =>
                    setEditPackage({
                      ...editPackage,
                      features: e.target.value.split("\n"),
                    })
                  }
                  rows={5}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditPackage(null)}
                  data-ocid="admin.package.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={savePackageEdit}
                  disabled={saving}
                  style={{ background: GOLD, color: NAVY }}
                  data-ocid="admin.package.save_button"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Inquiry Dialog */}
      <Dialog
        open={!!selectedInquiry}
        onOpenChange={(open) => !open && setSelectedInquiry(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="admin.inquiry.dialog">
          <DialogHeader>
            <DialogTitle>Manage Inquiry</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6">
              <div className="text-sm space-y-1">
                <p>
                  <strong>Client:</strong> {selectedInquiry.clientName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedInquiry.email}
                </p>
                <p>
                  <strong>Service:</strong> {selectedInquiry.serviceType}
                </p>
                <p>
                  <strong>Message:</strong> {selectedInquiry.message}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={inqStatus} onValueChange={setInqStatus}>
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin.inquiry.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["new", "contacted", "inProgress", "closed"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={inqNotes}
                  onChange={(e) => setInqNotes(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  data-ocid="admin.inquiry.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveInquiryStatus}
                  disabled={saving}
                  style={{ background: GOLD, color: NAVY }}
                  data-ocid="admin.inquiry.save_button"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BusinessFooter({
  onAdminLogin,
  isAdmin,
}: { onAdminLogin: () => void; isAdmin: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer className="py-14 px-6" style={{ background: "#040e1e" }}>
      <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-8 mb-8">
        <div>
          <h3 className="font-bold text-lg mb-2" style={{ color: GOLD }}>
            SK Web Solutions
          </h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Professional web design &amp; development services in Hyderabad.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 text-white">Contact</h4>
          <div className="space-y-1 text-sm text-slate-400">
            <p>sarangkumar408@gmail.com</p>
            <p>+91 7095244790</p>
            <p>Hyderabad, Telangana</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-6">
        <div className="flex flex-wrap gap-3 justify-center mb-5">
          {[
            { icon: <Lock size={13} />, label: "SSL Secured" },
            { icon: <Shield size={13} />, label: "GDPR Compliant" },
            { icon: <Award size={13} />, label: "Secure & Reliable" },
          ].map((badge) => (
            <span
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full"
              style={{
                border: `1px solid ${GOLD}55`,
                color: GOLD,
                background: "rgba(212,175,55,0.06)",
              }}
            >
              {badge.icon} {badge.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 text-center">
          &copy; {year}. Built with{" "}
          <Heart size={12} className="inline text-red-400" /> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            caffeine.ai
          </a>
        </p>
        {!isAdmin && (
          <p className="text-xs text-slate-700 text-center mt-2">
            <button
              type="button"
              onClick={onAdminLogin}
              className="hover:text-slate-500 transition-colors"
            >
              Admin Access
            </button>
          </p>
        )}
      </div>
    </footer>
  );
}

function QuoteCalculatorPage({
  setActivePage,
}: { setActivePage: (p: string) => void }) {
  const [projectType, setProjectType] = React.useState<string>("");
  const [pages, setPages] = React.useState<string>("");
  const [addOns, setAddOns] = React.useState<string[]>([]);

  const basePrices: Record<string, number> = {
    "Basic Website": 8000,
    "E-Commerce Store": 20000,
    "Web App": 30000,
    Portfolio: 6000,
    "Interior Design": 15000,
  };
  const pageMultipliers: Record<string, number> = {
    "1-5": 1,
    "6-10": 1.5,
    "10+": 2,
  };
  const webAddOnCosts: Record<string, number> = {
    "SEO Setup": 3000,
    CMS: 5000,
    "API Integration": 8000,
    "Admin Dashboard": 10000,
    "Mobile App": 15000,
  };
  const interiorAddOnCosts: Record<string, number> = {
    "3D Rendering": 8000,
    "Furniture Sourcing": 12000,
    "Project Management": 10000,
  };
  const addOnCosts =
    projectType === "Interior Design" ? interiorAddOnCosts : webAddOnCosts;

  const base = basePrices[projectType] || 0;
  const multiplier = pageMultipliers[pages] || 1;
  const addOnTotal = addOns.reduce((sum, a) => sum + (addOnCosts[a] || 0), 0);
  const total = Math.round(base * multiplier) + addOnTotal;

  function toggleAddOn(name: string) {
    setAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  }

  return (
    <section className="py-20 px-6" style={{ background: "#f1f5f9" }}>
      <div className="max-w-3xl mx-auto">
        <SectionTitle
          title="Project Quote Calculator"
          subtitle="Get an instant estimate for your website project"
        />
        <div
          className="bg-white shadow-lg p-8"
          style={{ border: "1px solid #e2e8f0" }}
        >
          {/* Step 1 */}
          <div className="mb-8">
            <h3 className="font-bold mb-1" style={{ color: NAVY }}>
              Step 1: Select Project Type
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              What kind of website do you need?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(basePrices).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setProjectType(type)}
                  data-ocid="quote.toggle"
                  className="p-3 text-sm font-medium border-2 transition-all text-center"
                  style={
                    projectType === type
                      ? {
                          borderColor: GOLD,
                          background: "rgba(212,175,55,0.12)",
                          color: NAVY,
                        }
                      : { borderColor: "#e2e8f0", color: "#64748b" }
                  }
                >
                  {type}
                  <div
                    className="text-xs mt-1 font-bold"
                    style={{ color: GOLD }}
                  >
                    ₹{basePrices[type].toLocaleString("en-IN")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <h3 className="font-bold mb-1" style={{ color: NAVY }}>
              Step 2: Number of Pages
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              How many pages will you need?
            </p>
            <div className="flex gap-3 flex-wrap">
              {Object.keys(pageMultipliers).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPages(p)}
                  data-ocid="quote.toggle"
                  className="px-5 py-3 text-sm font-medium border-2 transition-all"
                  style={
                    pages === p
                      ? {
                          borderColor: GOLD,
                          background: "rgba(212,175,55,0.12)",
                          color: NAVY,
                        }
                      : { borderColor: "#e2e8f0", color: "#64748b" }
                  }
                >
                  {p} pages
                  {pageMultipliers[p] > 1 && (
                    <span className="ml-1 text-xs" style={{ color: GOLD }}>
                      ×{pageMultipliers[p]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <h3 className="font-bold mb-1" style={{ color: NAVY }}>
              Step 3: Add-Ons (Optional)
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Select any additional features you need.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(addOnCosts).map(([name, cost]) => {
                const selected = addOns.includes(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => toggleAddOn(name)}
                    data-ocid="quote.checkbox"
                    className="flex items-center justify-between px-4 py-3 text-sm border-2 transition-all text-left"
                    style={
                      selected
                        ? {
                            borderColor: GOLD,
                            background: "rgba(212,175,55,0.1)",
                            color: NAVY,
                          }
                        : { borderColor: "#e2e8f0", color: "#64748b" }
                    }
                  >
                    <span className="flex items-center gap-2">
                      {selected ? (
                        <CheckCircle size={15} style={{ color: GOLD }} />
                      ) : (
                        <div className="w-4 h-4 border border-slate-300 rounded-sm" />
                      )}
                      {name}
                    </span>
                    <span className="font-bold" style={{ color: GOLD }}>
                      +₹{cost.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price display */}
          <motion.div
            layout
            className="p-6 text-center mb-6"
            style={{ background: NAVY, border: `2px solid ${GOLD}` }}
          >
            <p className="text-slate-400 text-sm mb-1">
              Estimated Project Cost
            </p>
            <div
              className="text-4xl font-bold"
              style={{ color: GOLD, fontFamily: "PlayfairDisplay, serif" }}
            >
              {total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
            </div>
            {total === 0 && (
              <p className="text-slate-500 text-xs mt-2">
                Select project type and pages to see your estimate
              </p>
            )}
            {total > 0 && (
              <p className="text-slate-400 text-xs mt-2">
                *Final price may vary based on specific requirements
              </p>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActivePage("contact")}
            data-ocid="quote.primary_button"
            className="w-full py-3 font-bold text-center"
            style={{ background: GOLD, color: NAVY }}
          >
            Get Started — Contact Us Now
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function BusinessSite() {
  const { login, clear, identity, isInitializing, isLoginError } =
    useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState("landing");
  const [prefilledService, setPrefilledService] = useState("");

  useEffect(() => {
    if (identity) {
      setIsLoggedIn(true);
      if (actor && !isFetching) {
        actor
          .isCallerAdmin()
          .then((adminStatus) => {
            setIsAdmin(adminStatus);
            (actor as unknown as BusinessActor)
              .logActivity("login", "")
              .catch(() => {});
          })
          .catch(() => setIsAdmin(false));
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [identity, actor, isFetching]);

  useEffect(() => {
    if (actor) {
      (actor as unknown as BusinessActor)
        .logActivity("visit", activePage)
        .catch(() => {});
    }
  }, [activePage, actor]);

  function handleLogin() {
    login();
  }
  function handleLogout() {
    clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActivePage("landing");
  }

  if (isInitializing && !isLoginError) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: NAVY }}
      >
        <p style={{ color: GOLD }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BusinessHeader
        activePage={activePage}
        setActivePage={setActivePage}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main>
        {activePage === "landing" && (
          <BusinessLanding setActivePage={setActivePage} />
        )}
        {activePage === "marketplace" && (
          <MarketplacePage
            setActivePage={setActivePage}
            setPrefilledService={setPrefilledService}
          />
        )}
        {activePage === "services" && (
          <ServicesPage setActivePage={setActivePage} />
        )}
        {activePage === "quote" && (
          <QuoteCalculatorPage setActivePage={setActivePage} />
        )}
        {activePage === "contact" && (
          <ContactPage prefilledService={prefilledService} />
        )}
        {activePage === "portal" && isLoggedIn && <ClientPortal />}
        {activePage === "admin" && isAdmin && <AdminDashboard />}
      </main>
      <BusinessFooter onAdminLogin={handleLogin} isAdmin={isAdmin} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP — Site Switcher
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeSite, setActiveSite] = useState<"portfolio" | "business">(
    "business",
  );

  return (
    <ErrorBoundary>
      <>
        <Toaster richColors position="top-right" />
        {/* Top site switcher */}
        <div
          className="sticky top-0 z-50 flex"
          style={{ background: "#020810" }}
        >
          <button
            type="button"
            onClick={() => setActiveSite("business")}
            data-ocid="site-switcher.business.tab"
            className="flex-1 py-2.5 text-sm font-semibold transition-colors"
            style={
              activeSite === "business"
                ? { background: GOLD, color: NAVY }
                : { color: "#94a3b8", background: "transparent" }
            }
          >
            🏢 SK Web Solutions
          </button>
          <button
            type="button"
            onClick={() => setActiveSite("portfolio")}
            data-ocid="site-switcher.portfolio.tab"
            className="flex-1 py-2.5 text-sm font-semibold transition-colors"
            style={
              activeSite === "portfolio"
                ? { background: GOLD, color: NAVY }
                : { color: "#94a3b8", background: "transparent" }
            }
          >
            👤 Personal Portfolio
          </button>
        </div>
        <AnimatePresence mode="wait">
          {activeSite === "portfolio" ? (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PersonalPortfolioSite />
            </motion.div>
          ) : (
            <motion.div
              key="business"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BusinessSite />
            </motion.div>
          )}
        </AnimatePresence>
        <ChatWidget />
      </>
    </ErrorBoundary>
  );
}
