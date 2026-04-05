import type { backendInterface as FullBackend } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  CheckCircle,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICE_TYPES = [
  "Web Development",
  "E-Commerce Store",
  "Corporate Website",
  "Custom Application",
  "Interior Design Services",
  "SEO Optimization",
  "Maintenance & Support",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
  serviceType?: string;
}

export function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { actor, isFetching } = useActor();

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    if (!form.serviceType) e.serviceType = "Please select a service";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (!actor) {
      toast.error(
        "Still connecting to the server, please wait a moment and try again.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await (actor as unknown as FullBackend).submitInquiry(
        form.name,
        form.email,
        form.phone,
        form.message,
        form.serviceType,
      );
      (actor as unknown as FullBackend)
        .logActivity("inquiry", form.serviceType)
        .catch(() => {});
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch (err) {
      console.error("Contact form submission error:", err);
      toast.error(
        "Failed to send message. Please email us directly at mrsergio569@gmail.com",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main
        className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center"
        data-ocid="contact.success_state"
      >
        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">
          Message Received!
        </h1>
        <p className="text-muted-foreground">
          Thanks {form.name}! Sarang will respond to {form.email} within 24
          hours.
        </p>
        <Button
          className="mt-6 btn-gold"
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              serviceType: "",
              message: "",
            });
          }}
          data-ocid="contact.secondary_button"
        >
          Send Another Message
        </Button>
      </main>
    );
  }

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 py-16"
      data-ocid="contact.section"
    >
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Get In <span className="gold-text">Touch</span>
        </h1>
        <p className="text-muted-foreground">
          Tell us about your project and we'll get back to you within 24 hours
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact Info */}
        <aside className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border/60">
            <h2 className="font-display font-semibold text-lg mb-5 gold-text">
              Direct Contact
            </h2>
            <div className="space-y-4">
              <a
                href="mailto:mrsergio569@gmail.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>mrsergio569@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Hyderabad, Telangana, India</span>
              </div>
              <a
                href="https://www.linkedin.com/in/sarang-kumar-854214257/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-ocid="contact.link"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Linkedin className="h-4 w-4 text-primary" />
                </div>
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/15">
            <h3 className="font-semibold text-sm mb-3">Response Time</h3>
            <p className="text-muted-foreground text-sm">
              We respond within{" "}
              <strong className="text-primary">24 hours</strong> on business
              days. Urgent? Send a WhatsApp or LinkedIn message.
            </p>
          </div>
        </aside>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 space-y-4"
          noValidate
          data-ocid="contact.section"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">
                Full Name *
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-secondary border-border h-12 md:h-10"
                placeholder="Rajesh Sharma"
                data-ocid="contact.input"
              />
              {errors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="contact.error_state"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="bg-secondary border-border h-12 md:h-10"
                placeholder="rajesh@company.com"
                data-ocid="contact.input"
              />
              {errors.email && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="contact.error_state"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="bg-secondary border-border h-12 md:h-10"
                placeholder="+91 98765 43210"
                data-ocid="contact.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Service Type *</Label>
              <Select
                value={form.serviceType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, serviceType: v }))
                }
              >
                <SelectTrigger
                  className="bg-secondary border-border h-12 md:h-10"
                  data-ocid="contact.select"
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="contact.error_state"
                >
                  {errors.serviceType}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">
              Project Details *
            </Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              className="bg-secondary border-border min-h-[140px] resize-none"
              placeholder="Tell us about your project goals, timeline, and any specific requirements..."
              data-ocid="contact.textarea"
            />
            {errors.message && (
              <p
                className="text-xs text-destructive"
                data-ocid="contact.error_state"
              >
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full btn-gold text-base"
            disabled={submitting || isFetching}
            data-ocid="contact.submit_button"
          >
            {isFetching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting...
              </>
            ) : submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
