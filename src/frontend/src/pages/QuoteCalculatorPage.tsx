import type { backendInterface as FullBackend } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PROJECT_TYPES = [
  { id: "corporate", label: "Corporate Website", base: 25000, icon: "🏢" },
  { id: "ecommerce", label: "E-Commerce Store", base: 40000, icon: "🛒" },
  { id: "portfolio", label: "Portfolio / Personal", base: 12000, icon: "🎨" },
  { id: "custom-app", label: "Custom Application", base: 65000, icon: "⚙️" },
  { id: "interior", label: "Interior Design", base: 20000, icon: "🛋️" },
];

const PAGE_COUNTS = [
  { id: "1-5", label: "1–5 Pages", multiplier: 1 },
  { id: "6-10", label: "6–10 Pages", multiplier: 1.4 },
  { id: "11-20", label: "11–20 Pages", multiplier: 1.8 },
  { id: "20+", label: "20+ Pages", multiplier: 2.4 },
];

const ADDONS = [
  { id: "seo", label: "SEO Optimization", price: 8000, icon: "📈" },
  { id: "cms", label: "CMS / Admin Panel", price: 12000, icon: "🗂️" },
  { id: "payments", label: "Payment Gateway", price: 10000, icon: "💳" },
  { id: "animations", label: "Custom Animations", price: 7000, icon: "✨" },
  { id: "maintenance", label: "Maintenance Package", price: 5000, icon: "🔧" },
];

export function QuoteCalculatorPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedPages, setSelectedPages] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { actor } = useActor();

  const typeObj = PROJECT_TYPES.find((t) => t.id === selectedType);
  const pagesObj = PAGE_COUNTS.find((p) => p.id === selectedPages);
  const basePrice = typeObj ? typeObj.base : 0;
  const pagesMultiplier = pagesObj ? pagesObj.multiplier : 1;
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const totalEstimate = Math.round(basePrice * pagesMultiplier + addonTotal);

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (!contactInfo.name || !contactInfo.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const addonNames = selectedAddons
        .map((id) => ADDONS.find((a) => a.id === id)?.label)
        .join(", ");
      const message = `Quote Calculator Request:\nProject Type: ${typeObj?.label}\nPage Count: ${selectedPages}\nAdd-ons: ${addonNames || "None"}\nEstimate: ₹${totalEstimate.toLocaleString()}\nPhone: ${contactInfo.phone}`;
      if (actor) {
        await (actor as unknown as FullBackend).submitInquiry(
          contactInfo.name,
          contactInfo.email,
          contactInfo.phone,
          message,
          typeObj?.label || "Website",
        );
      }
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try the Contact page.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main
        className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center"
        data-ocid="quote.success_state"
      >
        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">
          Quote Submitted!
        </h1>
        <p className="text-muted-foreground mb-2">
          Your estimate:{" "}
          <span className="text-primary font-bold text-xl">
            ₹{totalEstimate.toLocaleString()}
          </span>
        </p>
        <p className="text-muted-foreground text-sm">
          Sarang will get back to you within 24 hours at {contactInfo.email}.
        </p>
      </main>
    );
  }

  return (
    <main
      className="max-w-2xl mx-auto px-4 sm:px-6 py-16"
      data-ocid="quote.section"
    >
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Project <span className="gold-text">Quote Calculator</span>
        </h1>
        <p className="text-muted-foreground">
          Get an instant estimate for your project
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s < step
                  ? "gold-gradient text-primary-foreground"
                  : s === step
                    ? "border-2 border-primary text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {s < step ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 ${s < step ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
        {/* Live Estimate */}
        {(selectedType || selectedPages) && (
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/15 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Current Estimate
            </p>
            <p className="font-display text-3xl font-bold gold-text">
              ₹{totalEstimate.toLocaleString()}
            </p>
          </div>
        )}

        {/* Step 1: Project Type */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-5">
              What type of project do you need?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PROJECT_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10 shadow-gold-sm"
                      : "border-border/60 bg-secondary hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  data-ocid="quote.toggle"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From ₹{type.base.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Page Count */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-5">
              How many pages do you need?
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PAGE_COUNTS.map((pc) => (
                <button
                  type="button"
                  key={pc.id}
                  onClick={() => setSelectedPages(pc.id)}
                  className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                    selectedPages === pc.id
                      ? "border-primary bg-primary/10 shadow-gold-sm"
                      : "border-border/60 bg-secondary hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  data-ocid="quote.toggle"
                >
                  <div className="font-bold text-lg">{pc.label}</div>
                </button>
              ))}
            </div>
            <h3 className="font-semibold text-sm mb-4">Add-ons (optional)</h3>
            <div className="space-y-2">
              {ADDONS.map((addon) => (
                <button
                  type="button"
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all duration-200 ${
                    selectedAddons.includes(addon.id)
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-secondary hover:border-primary/40"
                  }`}
                  data-ocid="quote.checkbox"
                >
                  <span className="flex items-center gap-2">
                    <span>{addon.icon}</span>
                    <span className="font-medium">{addon.label}</span>
                  </span>
                  <span
                    className={
                      selectedAddons.includes(addon.id)
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    }
                  >
                    +₹{addon.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-2">
              Your estimate is ready!
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              Fill in your details to receive a detailed proposal.
            </p>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Project Type</span>
                <span className="font-medium">{typeObj?.label}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Pages</span>
                <span className="font-medium">{selectedPages}</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span className="font-medium">
                    {selectedAddons.length} selected
                  </span>
                </div>
              )}
              <div className="border-t border-border/60 pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Total Estimate</span>
                <span className="font-display font-bold text-xl gold-text">
                  ₹{totalEstimate.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name *"
                value={contactInfo.name}
                onChange={(e) =>
                  setContactInfo((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                data-ocid="quote.input"
              />
              <input
                type="email"
                placeholder="Your Email *"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                data-ocid="quote.input"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                data-ocid="quote.input"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="border-border/60"
              data-ocid="quote.secondary_button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              className="btn-gold"
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 1 && !selectedType) || (step === 2 && !selectedPages)
              }
              data-ocid="quote.primary_button"
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="btn-gold"
              onClick={handleSubmit}
              disabled={submitting}
              data-ocid="quote.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
