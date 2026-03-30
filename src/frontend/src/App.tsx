import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Gamepad2,
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Star,
  Trash2,
  Twitter,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ───────────────────────────── DATA ──────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Knowledge Cards", href: "#knowledge-cards" },
  { label: "Contact", href: "#contact" },
];

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
  {
    degree: "S.S.C",
    institution: "MHV High School",
    year: "July 2016",
  },
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
];

const LANGUAGES = ["Hindi", "English", "Telugu", "Marathi"];

const PROJECT_BULLETS = [
  "Conducted manual testing of software applications, identifying defects and ensuring alignment with functional specifications.",
  "Developed and executed detailed test cases and test scripts based on project requirements.",
  "Collaborated with developers and product managers to reproduce and troubleshoot reported issues.",
  "Reported and documented bugs and defects in the issue tracking system.",
  "Participated in test case reviews and defect prioritization sessions.",
  "Verified and validated software functionality, usability, and performance across environments.",
  "Ensured adherence to testing best practices and company standards.",
];

const PERSONAL = [
  { label: "Date of Birth", value: "23rd October 1999", icon: Calendar },
  { label: "Marital Status", value: "Single", icon: Heart },
  { label: "Religion", value: "Hindu", icon: Star },
  { label: "Nationality", value: "Indian", icon: Globe },
  {
    label: "Languages",
    value: "Hindi, English, Telugu, Marathi",
    icon: MessageCircle,
  },
  { label: "Location", value: "Hyderabad, Telangana (18 years)", icon: MapPin },
  {
    label: "Hobbies",
    value: "Playing Cricket, Learning New Things",
    icon: Gamepad2,
  },
  { label: "Strengths", value: "Quick Learner, Positive Mindset", icon: Zap },
];

const KNOWLEDGE_CARDS = [
  {
    src: "/assets/img-20260121-wa0213-019d3e56-8e5a-7430-9ba2-71b049351a93.jpg",
    caption: "BIG TV - Press ID Card",
  },
  {
    src: "/assets/img-20250802-wa0007-019d3e56-919e-776d-aa61-89a35cdad628.jpg",
    caption: "Criss Financial - Achievement Recognition",
  },
  {
    src: "/assets/img_20260329_205345-019d3e56-9328-7078-b1eb-9964f2c96628.png",
    caption: "SK Website Designer & Developer",
  },
  {
    src: "/assets/screenshot_2026-03-29-18-47-37-63_40deb401b9ffe8e1df2f1cc5ba480b12-019d3e56-96ce-73ae-8d5a-5537290ae5d2.jpg",
    caption: "SK Parcel Delivery Hub",
  },
  {
    src: "/assets/img_20260211_200622-019d3e56-986c-756f-a5a5-ab587d96e762.png",
    caption: "CIBIL Analysis in NBFC",
  },
  {
    src: "/assets/img_20260212_222126-019d3e56-9967-731f-b968-c7e78071264e.png",
    caption: "5 C's of Credit in NBFC",
  },
  {
    src: "/assets/img_20260212_225324-019d3e56-99d8-7089-9579-62bd28746718.png",
    caption: "Credit Underwriting: Smart Lending",
  },
  {
    src: "/assets/chatgpt_image_feb_15_2026_08_50_34_pm-019d3e56-9a42-71c8-b2b8-972c2a6f68f7.png",
    caption: "Do's & Don'ts for Credit Manager in NBFC",
  },
];

// ─────────────────────────── HELPERS ─────────────────────────────
function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

function isAchievementBullet(bullet: string) {
  return bullet.includes("%");
}

// ─────────────────────────── COMPONENTS ──────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy uppercase tracking-widest">
        {children}
      </h2>
      <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-serif font-bold text-sm">
              SK
            </div>
            <div className="leading-tight">
              <p className="font-serif font-bold text-navy text-sm tracking-wide">
                SARANG KUMAR
              </p>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Finance Professional
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            data-ocid="header.section"
          >
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-foreground hover:text-gold transition-colors"
                data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/sarang-kumar-854214257/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:bg-[#004182] transition-colors shadow-md"
              title="LinkedIn Profile"
              data-ocid="header.linkedin.link"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <Button
              className="bg-gold hover:bg-gold-hover text-white font-semibold text-sm px-5"
              data-ocid="header.download.button"
              asChild
            >
              <a
                href="/assets/resume-_mr.sarang-019d3e3e-c529-700a-b7eb-02702da4c6a8.pdf"
                download="Sarang_Kumar_Resume.pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-navy"
            onClick={() => setMenuOpen((v) => !v)}
            data-ocid="header.menu.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-sm font-medium text-foreground hover:text-gold py-1"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0A66C2] text-white rounded-lg px-4 py-2 mt-2 font-semibold"
                data-ocid="mobile.linkedin.link"
              >
                <Linkedin className="w-5 h-5" />
                View LinkedIn Profile
              </a>
              <Button
                className="bg-gold hover:bg-gold-hover text-white mt-2"
                data-ocid="mobile.download.button"
                asChild
              >
                <a
                  href="/assets/resume-_mr.sarang-019d3e3e-c529-700a-b7eb-02702da4c6a8.pdf"
                  download="Sarang_Kumar_Resume.pdf"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative bg-navy min-h-screen flex items-center pt-16"
      data-ocid="hero.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center md:justify-start"
        >
          <div className="relative">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-gold overflow-hidden">
              <img
                src="/assets/img-20260121-wa0214-019d3e4e-36ce-728e-b593-0d2034a1fbff.jpg"
                alt="Sarang Kumar"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-gold opacity-20" />
          </div>
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white text-center md:text-left"
        >
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-3">
            Finance Professional
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
            Sarang Kumar
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
            Credit Manager with expertise in LAP & NANO loan underwriting,
            credit MIS reporting, income & bureau analysis, and financial
            operations. Passionate about continuous learning and delivering
            measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              onClick={() => scrollTo("#experience")}
              className="bg-gold hover:bg-gold-hover text-white px-8 py-3 text-base font-semibold"
              data-ocid="hero.learn_more.button"
            >
              Learn More
            </Button>
            <Button
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 px-8 py-3 text-base"
              data-ocid="hero.contact.button"
              onClick={() => scrollTo("#contact")}
            >
              Get In Touch
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6 }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

function ObjectiveSection() {
  return (
    <section id="objective" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>My Objective</SectionHeading>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-lg text-muted-foreground leading-relaxed"
        >
          Looking for an exciting and dynamic role where I can utilize my skills
          and experience to drive tangible results. Passionate about joining an
          organization that fosters a culture of innovation, continuous
          learning, and personal growth.
        </motion.p>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section
      id="experience"
      className="bg-light-gray py-20"
      data-ocid="experience.section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Work Experience</SectionHeading>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-navy/20" />

          <div className="space-y-10">
            {EXPERIENCE.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
                data-ocid={`experience.item.${i + 1}`}
              >
                {/* Circle marker */}
                <div className="absolute left-3 top-1.5 w-5 h-5 rounded-full bg-navy border-4 border-white shadow" />

                <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-navy text-xl">
                        {job.title}
                      </h3>
                      <p className="text-gold text-sm font-semibold mt-0.5">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs bg-navy/10 text-navy font-medium px-3 py-1 rounded-full whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-2 mt-3">
                    {job.bullets.map((b) =>
                      isAchievementBullet(b) ? (
                        <li
                          key={b}
                          className="flex gap-2 text-sm font-semibold text-navy items-start"
                        >
                          <span className="mt-1 text-gold text-xs flex-shrink-0">
                            ★
                          </span>
                          <span className="bg-gold/10 border border-gold/30 text-navy rounded px-2 py-0.5 leading-snug">
                            {b}
                          </span>
                        </li>
                      ) : (
                        <li
                          key={b}
                          className="flex gap-2 text-sm text-muted-foreground items-start"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                          {b}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectSection() {
  return (
    <section
      id="project"
      className="bg-white py-20"
      data-ocid="project.section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Project</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-light-gray rounded-lg p-8 border border-border"
        >
          <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
            <div>
              <h3 className="font-serif font-bold text-navy text-2xl">
                Software Tester (Manual)
              </h3>
              <p className="text-gold font-semibold mt-1">Synoriq</p>
            </div>
            <Badge className="bg-navy text-white text-xs">Testing</Badge>
          </div>
          <ul className="space-y-2 mt-4">
            {PROJECT_BULLETS.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section
      id="education"
      className="bg-light-gray py-20"
      data-ocid="education.section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Education</SectionHeading>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-ocid={`education.item.${i + 1}`}
            >
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-navy py-4 px-5">
                  <CardTitle className="text-white font-serif text-lg">
                    {edu.degree}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-5 px-5">
                  <p className="font-semibold text-foreground text-sm">
                    {edu.institution}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {edu.year}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="bg-white py-20" data-ocid="skills.section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Skills</SectionHeading>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {SKILLS.map((skill) => (
            <Badge
              key={skill}
              className="bg-navy/5 text-navy border border-navy/20 hover:bg-navy hover:text-white transition-colors text-sm px-4 py-2 rounded-full cursor-default"
            >
              {skill}
            </Badge>
          ))}
        </motion.div>

        <div className="mt-10">
          <h3 className="text-center font-serif font-bold text-navy text-xl mb-4">
            Languages
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {LANGUAGES.map((lang) => (
              <Badge
                key={lang}
                className="bg-gold text-white border-0 text-sm px-4 py-2 rounded-full"
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalSection() {
  return (
    <section
      id="personal"
      className="bg-light-gray py-20"
      data-ocid="personal.section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Personal Profile</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border shadow-md overflow-hidden"
        >
          {/* Card header bar */}
          <div className="bg-navy px-6 py-4 flex items-center gap-3">
            <div className="w-1 h-8 bg-gold rounded-full" />
            <h3 className="font-serif text-white text-xl font-bold tracking-wide">
              Personal Profile
            </h3>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {PERSONAL.map((item, i) => {
              const Icon = item.icon;
              const isAlt = i % 2 !== 0;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-5 px-6 py-4 ${
                    isAlt ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-navy" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-foreground font-semibold text-sm">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type KnowledgeCard = { src: string; caption: string };

function KnowledgeCardsSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<KnowledgeCard[]>([...KNOWLEDGE_CARDS]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % cards.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + cards.length) % cards.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "Escape") closeLightbox();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setCards((prev) => [...prev, { src, caption: file.name }]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const deleteCard = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this card?")) return;
    setCards((prev) => prev.filter((_, i) => i !== index));
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      if (cards.length - 1 === 0) return null;
      if (index < prev) return prev - 1;
      if (index === prev) return Math.min(prev, cards.length - 2);
      return prev;
    });
  };

  return (
    <section
      id="knowledge-cards"
      className="bg-light-gray py-20"
      data-ocid="knowledge_cards.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Knowledge Cards</SectionHeading>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {cards.map((card, i) => (
            <motion.div
              key={`${card.src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-lg overflow-hidden border border-border shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 bg-white"
              onClick={() => openLightbox(i)}
              data-ocid={`knowledge_cards.item.${i + 1}`}
            >
              <button
                onClick={(e) => deleteCard(i, e)}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                data-ocid={`knowledge_cards.delete_button.${i + 1}`}
                type="button"
                title="Delete card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div
                className="bg-gray-50 flex items-center justify-center overflow-hidden"
                style={{ height: "16rem" }}
              >
                <img
                  src={card.src}
                  alt={card.caption}
                  className="max-h-64 w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-navy text-center leading-snug">
                  {card.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload button */}
        <div className="mt-10 flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            data-ocid="knowledge_cards.upload_button"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-navy hover:bg-navy/90 text-white font-semibold px-8 py-3 text-sm gap-2"
            data-ocid="knowledge_cards.primary_button"
          >
            <Upload className="w-4 h-4" />
            Upload Card
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            data-ocid="knowledge_cards.modal"
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gold transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              data-ocid="knowledge_cards.close_button"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              data-ocid="knowledge_cards.pagination_prev"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Image */}
            <div
              className="flex flex-col items-center gap-4 px-16"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={cards[lightboxIndex].src}
                alt={cards[lightboxIndex].caption}
                className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-2xl"
              />
              <p className="text-white/90 text-sm font-medium text-center">
                {cards[lightboxIndex].caption}
              </p>
              <p className="text-white/40 text-xs">
                {lightboxIndex + 1} / {cards.length}
              </p>
            </div>

            {/* Next button */}
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              data-ocid="knowledge_cards.pagination_next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-white py-20"
      data-ocid="contact.section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Contact Me</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-6"
        >
          <a
            href="mailto:Sarangkumar408@gmail.com"
            className="flex flex-col items-center gap-3 p-7 bg-light-gray rounded-lg border border-border hover:border-gold hover:shadow-md transition-all group"
            data-ocid="contact.email.link"
          >
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy transition-colors">
              <Mail className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Email
              </p>
              <p className="text-sm text-foreground font-medium mt-0.5 break-all">
                Sarangkumar408@gmail.com
              </p>
            </div>
          </a>

          <a
            href="tel:+917095244790"
            className="flex flex-col items-center gap-3 p-7 bg-light-gray rounded-lg border border-border hover:border-gold hover:shadow-md transition-all group"
            data-ocid="contact.phone.link"
          >
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy transition-colors">
              <Phone className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Phone
              </p>
              <p className="text-sm text-foreground font-medium mt-0.5">
                +91 7095244790
              </p>
            </div>
          </a>

          <div
            className="flex flex-col items-center gap-3 p-7 bg-light-gray rounded-lg border border-border"
            data-ocid="contact.address.card"
          >
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-navy" />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Location
              </p>
              <p className="text-sm text-foreground font-medium mt-0.5">
                Hanuman Nagar, Shankarpally, Hyderabad – 501203
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-white py-14" data-ocid="footer.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Social */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                data-ocid="footer.github.link"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                data-ocid="footer.linkedin.link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                data-ocid="footer.twitter.link"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>Sarangkumar408@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+91 7095244790</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-gold">
              Site Map
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="hover:text-gold transition-colors"
                    data-ocid={`footer.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© {year} Sarang Kumar. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────── APP ─────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ObjectiveSection />
        <ExperienceSection />
        <ProjectSection />
        <EducationSection />
        <SkillsSection />
        <PersonalSection />
        <KnowledgeCardsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
