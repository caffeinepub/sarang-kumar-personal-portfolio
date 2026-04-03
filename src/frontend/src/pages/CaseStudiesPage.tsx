import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap } from "lucide-react";

interface CaseStudiesPageProps {
  onNavigate: (page: "contact") => void;
}

const CASE_STUDIES = [
  {
    id: "retailmax",
    client: "RetailMax India",
    industry: "E-Commerce",
    img: "/assets/generated/case-study-retailmax.dim_800x500.jpg",
    challenge:
      "RetailMax had a legacy PHP website with 8-second load times, a broken checkout process causing 70% cart abandonment, and no mobile optimization in a market where 80% of traffic is mobile.",
    solution:
      "Complete rebuild using Next.js with server-side rendering, Stripe payment integration, progressive web app capabilities, and a headless CMS for easy product management. Implemented Redis caching and CDN delivery.",
    results: [
      { icon: Zap, label: "Page Load", value: "40% faster" },
      { icon: TrendingUp, label: "Conversions", value: "3x increase" },
      { icon: Users, label: "Monthly Users", value: "25,000+" },
    ],
    tags: ["Next.js", "Stripe", "Redis", "CDN", "PWA"],
    duration: "6 Weeks",
  },
  {
    id: "edulearn",
    client: "EduLearn Academy",
    industry: "EdTech",
    img: "/assets/generated/case-study-edulearn.dim_800x500.jpg",
    challenge:
      "EduLearn needed to migrate 200+ courses from a clunky Moodle setup to a modern platform that supports HD video, real-time quizzes, certificates, and a smooth enrollment experience for students across India.",
    solution:
      "Built a custom learning management system with React frontend, Node.js backend, MongoDB database, and Firebase for real-time features. Integrated Razorpay for Indian payment methods and automated certificate generation.",
    results: [
      { icon: Users, label: "Students Enrolled", value: "10,000+" },
      { icon: TrendingUp, label: "Course Completion", value: "78% rate" },
      { icon: Zap, label: "Revenue Growth", value: "220% YoY" },
    ],
    tags: ["React", "Node.js", "MongoDB", "Firebase", "Razorpay"],
    duration: "8 Weeks",
  },
  {
    id: "propertyhub",
    client: "PropertyHub Hyderabad",
    industry: "Real Estate",
    img: "/assets/generated/case-study-propertyhub.dim_800x500.jpg",
    challenge:
      "PropertyHub needed a modern real estate portal to replace their static website. Agents needed tools to manage listings, and buyers needed advanced search, map-based browsing, and direct inquiry capabilities.",
    solution:
      "Developed a full-stack portal with Next.js, Google Maps API integration, PostgreSQL for complex property queries, and a dedicated agent dashboard. Implemented automated email alerts for new matching listings.",
    results: [
      { icon: TrendingUp, label: "Lead Generation", value: "60% more leads" },
      { icon: Users, label: "Active Agents", value: "120+" },
      { icon: Zap, label: "Time on Site", value: "4x increase" },
    ],
    tags: ["Next.js", "Maps API", "PostgreSQL", "Node.js", "Email Automation"],
    duration: "10 Weeks",
  },
];

export function CaseStudiesPage({ onNavigate }: CaseStudiesPageProps) {
  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
      data-ocid="casestudies.section"
    >
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Client <span className="gold-text">Case Studies</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Real challenges, real solutions, and measurable results for businesses
          across Hyderabad and India.
        </p>
      </div>

      <div className="space-y-16">
        {CASE_STUDIES.map((cs, idx) => (
          <div
            key={cs.id}
            className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            data-ocid={`casestudies.item.${idx + 1}`}
          >
            {/* Image */}
            <img
              src={cs.img}
              alt={cs.client}
              className="w-full h-56 md:h-72 object-cover"
              loading="lazy"
            />

            <div className="p-6 md:p-10">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">
                    {cs.client}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {cs.industry}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Duration: {cs.duration}
                    </Badge>
                  </div>
                </div>
                <Button
                  className="btn-gold"
                  onClick={() => onNavigate("contact")}
                  data-ocid="casestudies.primary_button"
                >
                  Start Similar Project
                </Button>
              </div>

              {/* Challenge / Solution / Results */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 rounded-xl bg-secondary/50 border border-border/40">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                    The Challenge
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {cs.challenge}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/50 border border-border/40">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                    Our Solution
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {cs.solution}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {cs.results.map((r) => (
                  <div
                    key={r.label}
                    className="text-center p-4 rounded-xl bg-primary/5 border border-primary/15"
                  >
                    <r.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="font-display font-bold text-lg gold-text">
                      {r.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {cs.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
