import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const QUICK_REPLIES = [
  "What services do you offer?",
  "How much does a website cost?",
  "How do I contact Sarang?",
  "What is your tech stack?",
];

export function SKAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi! I'm SK Assistant 👋 I can help you learn about SK Web Solutions services, pricing, tech stack, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { actor } = useActor();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const knowledgeBase: Record<string, string> = {
    default:
      "I'm SK Assistant for SK Web Solutions. I can help with services, pricing, tech stack, case studies, and contact info. Ask me anything!",
    services:
      "We offer: Web Development, Interior Design Services, E-Commerce Solutions, Custom Applications, and SEO Optimization. Packages start from ₹15,000 for Starter to ₹75,000+ for Enterprise projects.",
    price:
      "Pricing starts at ₹15,000 (Starter: 5-page website), ₹35,000 (Professional: full-featured), ₹75,000+ (Enterprise: custom apps). Use our Quote Calculator for an exact estimate!",
    contact:
      "Contact Sarang Kumar at sarangkumar408@gmail.com. LinkedIn: linkedin.com/in/sarang-kumar-854214257. Based in Hyderabad, India.",
    tech: "Our tech stack: React, Next.js, WordPress, Tailwind CSS, Node.js, Tableau, MongoDB, Stripe, Vue.js, Firebase. We pick the right tool for every project.",
    timeline:
      "Timelines: 1-2 weeks (Starter), 3-4 weeks (Professional), 6-8 weeks (Enterprise). Complex projects may vary.",
    interior:
      "Our Interior Design services include residential and commercial space planning, 3D visualization, material selection, and complete project management. Packages start from ₹20,000.",
    casestudies:
      "RetailMax: E-commerce redesign → 40% speed boost, 3x conversions. EduLearn: Online platform → 10k+ students. PropertyHub: Real estate portal → 60% more leads.",
    portfolio:
      "Sarang Kumar is a Web Designer & Developer based in Hyderabad with 3+ years experience, 50+ projects delivered, and 40+ happy clients.",
    hyderabad:
      "Yes! We're based in Hyderabad and serve clients locally and across India. We understand the Hyderabad business ecosystem well.",
  };

  function getLocalResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("service") || q.includes("offer") || q.includes("what do"))
      return knowledgeBase.services;
    if (
      q.includes("price") ||
      q.includes("cost") ||
      q.includes("budget") ||
      q.includes("how much")
    )
      return knowledgeBase.price;
    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("phone") ||
      q.includes("reach")
    )
      return knowledgeBase.contact;
    if (
      q.includes("tech") ||
      q.includes("stack") ||
      q.includes("language") ||
      q.includes("framework")
    )
      return knowledgeBase.tech;
    if (
      q.includes("time") ||
      q.includes("timeline") ||
      q.includes("how long") ||
      q.includes("duration")
    )
      return knowledgeBase.timeline;
    if (
      q.includes("interior") ||
      q.includes("design") ||
      q.includes("room") ||
      q.includes("home")
    )
      return knowledgeBase.interior;
    if (
      q.includes("case") ||
      q.includes("project") ||
      q.includes("example") ||
      q.includes("work")
    )
      return knowledgeBase.casestudies;
    if (
      q.includes("portfolio") ||
      q.includes("sarang") ||
      q.includes("about") ||
      q.includes("who")
    )
      return knowledgeBase.portfolio;
    if (
      q.includes("hyderabad") ||
      q.includes("location") ||
      q.includes("where")
    )
      return knowledgeBase.hyderabad;
    return knowledgeBase.default;
  }

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      let response = "";
      if (actor) {
        try {
          response =
            (await (actor as any).askAgent?.(text)) ?? getLocalResponse(text);
        } catch {
          response = getLocalResponse(text);
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        response = getLocalResponse(text);
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Sorry, I had trouble with that. Try again or contact us directly at sarangkumar408@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-4 md:right-6 w-80 md:w-96 rounded-xl overflow-hidden z-50"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 0 30px oklch(0.78 0.14 85 / 0.15)",
          }}
        >
          <div className="bg-navy-mid border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gold-gradient">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-primary-foreground">
                    SK Assistant
                  </p>
                  <p className="text-xs text-primary-foreground/70">
                    Online · SK Web Solutions
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                data-ocid="assistant.close_button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-3 space-y-3 bg-background">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary border border-border rounded-xl px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="px-3 py-2 bg-background border-t border-border flex flex-wrap gap-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {/* Input */}
            <div className="flex gap-2 p-3 bg-background border-t border-border">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && sendMessage(input)
                }
                placeholder="Ask me anything..."
                className="flex-1 text-sm bg-secondary border-border"
                disabled={loading}
                data-ocid="assistant.input"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="btn-gold shrink-0"
                data-ocid="assistant.submit_button"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-gold animate-pulse-gold hover:scale-110 transition-transform duration-200"
        data-ocid="assistant.open_modal_button"
        aria-label="Open SK Assistant"
      >
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        )}
      </button>
    </>
  );
}
