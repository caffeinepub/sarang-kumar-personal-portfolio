import { useActor } from "@/hooks/useActor";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: number;
}

const STORAGE_KEY = "skChatHistory";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "agent",
  text: "Hi! I'm SK Assistant \ud83d\udc4b How can I help you today? I can answer questions about our services, pricing, portfolio, and more.",
  timestamp: Date.now(),
};

const QUICK_REPLIES = [
  "Our Services",
  "Pricing",
  "Get a Quote",
  "Case Studies",
  "Tech Stack",
  "Contact Us",
];

const KB: Record<string, string> = {
  services:
    "SK Web Solutions offers: **Website Design & Development**, **E-Commerce Solutions**, **Business Automation**, **Web Portal Development**, **UI/UX Design**, and **SEO & Performance Optimization**. We build custom, fully-responsive websites tailored to your business goals.",
  pricing:
    "Our pricing packages:\n\n\ud83e\udd49 **Starter** \u2014 \u20b915,000 | Basic 5-page site, responsive design, contact form\n\ud83e\udd48 **Professional** \u2014 \u20b935,000 | Up to 15 pages, CMS, SEO setup, animations\n\ud83e\udd47 **Business** \u2014 \u20b975,000 | Full custom site, e-commerce, admin dashboard, integrations\n\ud83d\udc8e **Enterprise** \u2014 Custom quote | Complex portals, automation, API integrations\n\nAll packages include 3 months of support.",
  contact:
    "You can reach Sarang Kumar at:\n\ud83d\udce7 **Email:** sarangkumar408@gmail.com\n\ud83d\udd17 **LinkedIn:** linkedin.com/in/sarang-kumar-854214257\n\ud83c\udf10 **Website:** SK Web Solutions (you're here!)\n\nFill out the Contact form on our site for a free consultation!",
  websiteTypes:
    "We build all types of websites:\n\n\ud83d\uded2 **E-Commerce** \u2014 Online stores with payment gateways\n\ud83c\udfe2 **Corporate** \u2014 Professional business websites\n\ud83d\udcf0 **Blogs & Portfolios** \u2014 Personal branding sites\n\ud83c\udfe5 **Healthcare Portals** \u2014 Patient management systems\n\ud83c\udf93 **EdTech Platforms** \u2014 LMS and course delivery\n\ud83c\udf55 **Restaurant/Food** \u2014 Menu, ordering, reservations\n\ud83d\udcca **Dashboards** \u2014 Admin panels and analytics",
  about:
    "**Sarang Kumar** is a Web Designer & Developer with expertise in building modern, high-performance web applications. He specializes in React, Node.js, and full-stack development. With SK Web Solutions, he provides end-to-end website development services \u2014 from design to deployment. \ud83d\ude80\n\nHe is based in Hyderabad and has worked on diverse projects including e-commerce platforms, business portals, and data-driven dashboards.",
  portfolio:
    "Our portfolio includes:\n\n\u2705 **Restaurant Booking Platform** \u2014 Full-stack reservation and ordering system\n\u2705 **E-Commerce Store** \u2014 Multi-vendor marketplace with payment integration\n\u2705 **Corporate Portal** \u2014 Employee management and analytics dashboard\n\u2705 **Healthcare Management System** \u2014 Patient records and appointment scheduling\n\u2705 **EdTech LMS** \u2014 Course platform with progress tracking\n\u2705 **Real Estate Listings** \u2014 Property search with filters and maps\n\nVisit the Marketplace section to explore available website templates!",
  process:
    "Our development process:\n\n1\ufe0f\u20e3 **Discovery** \u2014 Understanding your business needs and goals\n2\ufe0f\u20e3 **Design** \u2014 Creating wireframes and visual mockups\n3\ufe0f\u20e3 **Development** \u2014 Building with modern technologies\n4\ufe0f\u20e3 **Testing** \u2014 QA across devices and browsers\n5\ufe0f\u20e3 **Launch** \u2014 Deploying to production\n6\ufe0f\u20e3 **Support** \u2014 Ongoing maintenance and updates",
  timeline:
    "Typical timelines:\n\n\u26a1 **Starter Package** \u2014 1-2 weeks\n\ud83d\udd28 **Professional Package** \u2014 3-4 weeks\n\ud83c\udfd7\ufe0f **Business Package** \u2014 6-8 weeks\n\ud83c\udfe2 **Enterprise** \u2014 Custom timeline based on scope\n\nWe provide regular progress updates throughout development.",
  technologies:
    "Technologies we use:\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Vue.js, Angular\n**Backend:** Node.js, Python, Motoko (ICP), Firebase\n**Databases:** PostgreSQL, MongoDB, MySQL, Firebase Firestore\n**Analytics:** Tableau, Google Analytics, Power BI\n**Payments:** Stripe, Razorpay\n**Cloud:** AWS, Google Cloud, Internet Computer (ICP)\n**Tools:** Git, Docker, Figma, VS Code",
  caseStudies:
    "Our proven case studies:\n\n🛒 **RetailMax E-Commerce** — Rebuilt their store with React + Next.js + Stripe. Result: 40% higher conversion rate, 60% faster load time.\n🎓 **EduLearn LMS** — Built a full learning platform with React + Node.js. Result: 500+ students enrolled in 30 days.\n🏠 **PropertyHub Real Estate** — Automated lead capture with Vue.js + Google Maps. Result: 3x more leads, 50% faster response time.\n\nVisit our website to see more examples!",
  quoteCalc:
    "You can get an **instant project estimate** using our Quote Calculator! 🧮\n\nJust click **Get Quote** in the top navigation, then:\n1️⃣ Select your project type (Basic Website, E-Commerce, Web App, or Portfolio)\n2️⃣ Choose the number of pages\n3️⃣ Add optional features like SEO, CMS, API integration, Admin Dashboard, or Mobile App\n\nThe calculator shows your estimated cost in real-time. Base prices start from ₹6,000 for a portfolio up to ₹30,000+ for a full web app.",
};

function getLocalResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("service") || q.includes("offer") || q.includes("provide"))
    return KB.services;
  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("package") ||
    q.includes("plan") ||
    q.includes("fee") ||
    q.includes("charge")
  )
    return KB.pricing;
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("phone") ||
    q.includes("call")
  )
    return KB.contact;
  if (
    q.includes("type") ||
    q.includes("kind") ||
    q.includes("ecommerce") ||
    q.includes("e-commerce") ||
    q.includes("corporate") ||
    q.includes("blog")
  )
    return KB.websiteTypes;
  if (
    q.includes("sarang") ||
    q.includes("about") ||
    q.includes("who") ||
    q.includes("founder") ||
    q.includes("developer")
  )
    return KB.about;
  if (
    q.includes("portfolio") ||
    q.includes("project") ||
    q.includes("work") ||
    q.includes("example")
  )
    return KB.portfolio;
  if (
    q.includes("process") ||
    q.includes("how do") ||
    q.includes("step") ||
    q.includes("work with")
  )
    return KB.process;
  if (
    q.includes("time") ||
    q.includes("long") ||
    q.includes("duration") ||
    q.includes("week") ||
    q.includes("day")
  )
    return KB.timeline;
  if (
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("language") ||
    q.includes("react") ||
    q.includes("framework") ||
    q.includes("tableau") ||
    q.includes("vue") ||
    q.includes("wordpress")
  )
    return KB.technologies;
  if (
    q.includes("case study") ||
    q.includes("case studies") ||
    q.includes("retailmax") ||
    q.includes("edulearn") ||
    q.includes("propertyhub") ||
    q.includes("result") ||
    q.includes("success")
  )
    return KB.caseStudies;
  if (
    q.includes("quote") ||
    q.includes("calculator") ||
    q.includes("estimate") ||
    q.includes("calculate") ||
    q.includes("how much")
  )
    return KB.quoteCalc;
  if (
    q.includes("hi") ||
    q.includes("hello") ||
    q.includes("hey") ||
    q.includes("good")
  )
    return "Hello! \ud83d\udc4b Great to hear from you! I'm SK Assistant, your guide to SK Web Solutions. Ask me about our services, pricing, or anything else \u2014 I'm here to help!";
  if (q.includes("thank"))
    return "You're welcome! \ud83d\ude0a If you have any more questions, feel free to ask. We're always happy to help!";
  return "Thanks for your question! Here's what I can help you with:\n\n\u2022 **Services** \u2014 What we build\n\u2022 **Pricing** \u2014 Package costs\n\u2022 **Portfolio** \u2014 Past projects\n\u2022 **Technologies** \u2014 Tech stack\n\u2022 **Process** \u2014 How we work\n\u2022 **Contact** \u2014 Get in touch\n\nOr reach us directly at sarangkumar408@gmail.com for a free consultation! \ud83d\ude80";
}

function loadHistory(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ChatMessage[];
  } catch {
    // ignore
  }
  return [WELCOME_MESSAGE];
}

function saveHistory(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

function TextLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, idx) => {
        const key = `part-${idx}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        return <span key={key}>{part}</span>;
      })}
    </span>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split("\n");
  const result: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(
      <TextLine key={`tl-${i}-${parts[i].slice(0, 8)}`} text={parts[i]} />,
    );
    if (i < parts.length - 1) result.push(<br key={`br-${i}`} />);
  }
  return <span>{result}</span>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      const t1 = setTimeout(scrollToBottom, 100);
      const t2 = setTimeout(() => inputRef.current?.focus(), 150);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    return undefined;
  }, [open, scrollToBottom]);

  const messagesCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count or typing change
  useEffect(() => {
    scrollToBottom();
  }, [messagesCount, typing, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setTyping(true);

      let responseText = "";
      const start = Date.now();
      try {
        if (actor) {
          responseText = await (
            actor as unknown as Record<string, (q: string) => Promise<string>>
          ).askAgent(trimmed);
        } else {
          responseText = getLocalResponse(trimmed);
        }
      } catch {
        responseText = getLocalResponse(trimmed);
      }

      const elapsed = Date.now() - start;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }
      setTyping(false);

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "agent",
        text: responseText || getLocalResponse(trimmed),
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, agentMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    },
    [messages, actor],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleToggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const showQuickReplies =
    messages.length === 1 && messages[0].id === "welcome";
  const canSend = input.trim().length > 0 && !typing;

  return (
    <div
      style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}
      data-ocid="chat.panel"
    >
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              position: "absolute",
              bottom: "72px",
              right: 0,
              width: "min(380px, calc(100vw - 32px))",
              height: "520px",
              background: "#0a1628",
              borderRadius: "16px",
              border: "1px solid rgba(212,175,55,0.35)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            data-ocid="chat.modal"
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0d1f3c 0%, #1a2f4a 100%)",
                borderBottom: "1px solid rgba(212,175,55,0.25)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot size={18} color="#0a1628" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    background:
                      "linear-gradient(90deg, #d4af37 0%, #f0c040 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  SK Assistant
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(212,175,55,0.7)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      display: "inline-block",
                    }}
                  />
                  Online \u2014 SK Web Solutions
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                data-ocid="chat.close_button"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(212,175,55,0.2) transparent",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  {msg.role === "agent" && (
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={14} color="#0a1628" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 13px",
                      borderRadius:
                        msg.role === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #c9a227 0%, #d4af37 100%)"
                          : "rgba(255,255,255,0.06)",
                      color: msg.role === "user" ? "#0a1628" : "#e2e8f0",
                      fontSize: "13.5px",
                      lineHeight: 1.55,
                      border:
                        msg.role === "agent"
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                    }}
                  >
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              {showQuickReplies && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "4px",
                    paddingLeft: "36px",
                  }}
                >
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      type="button"
                      onClick={() => sendMessage(qr)}
                      data-ocid="chat.button"
                      style={{
                        padding: "5px 11px",
                        borderRadius: "20px",
                        border: "1px solid rgba(212,175,55,0.45)",
                        background: "rgba(212,175,55,0.08)",
                        color: "#d4af37",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                  data-ocid="chat.loading_state"
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#0a1628" />
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={`dot-${i}`}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.15,
                        }}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#d4af37",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: "1px solid rgba(212,175,55,0.15)",
                background: "rgba(10,22,40,0.8)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your question\u2026"
                data-ocid="chat.input"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: "10px",
                  padding: "9px 13px",
                  color: "#e2e8f0",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                data-ocid="chat.submit_button"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: canSend
                    ? "linear-gradient(135deg, #c9a227 0%, #d4af37 100%)"
                    : "rgba(212,175,55,0.2)",
                  border: "none",
                  cursor: canSend ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: canSend ? "#0a1628" : "rgba(212,175,55,0.4)",
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div style={{ position: "relative" }}>
        {!open && (
          <>
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(212,175,55,0.4)",
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(212,175,55,0.3)",
                pointerEvents: "none",
              }}
            />
          </>
        )}
        <motion.button
          type="button"
          onClick={handleToggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          data-ocid="chat.open_modal_button"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: open
              ? "linear-gradient(135deg, #1a2f4a 0%, #0d1f3c 100%)"
              : "linear-gradient(135deg, #c9a227 0%, #d4af37 100%)",
            border: open ? "2px solid rgba(212,175,55,0.5)" : "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 4px 20px rgba(212,175,55,0.4), 0 2px 8px rgba(0,0,0,0.3)",
            position: "relative",
            zIndex: 1,
            color: open ? "#d4af37" : "#0a1628",
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #0a1628",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              color: "white",
              fontWeight: 700,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            AI
          </motion.div>
        )}
      </div>
    </div>
  );
}
