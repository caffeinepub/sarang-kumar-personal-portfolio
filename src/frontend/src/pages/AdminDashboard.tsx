import type { backendInterface as FullBackend } from "@/backend.d";
import type {
  Inquiry,
  Listing,
  SearchTermCount,
  UserActivity,
} from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Bell,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ── Color maps ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  login: "bg-primary/10 text-primary border-primary/20",
  search: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  inquiry: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  visit: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const ACTIVITY_DOT: Record<string, string> = {
  login: "bg-primary",
  visit: "bg-cyan-400",
  search: "bg-purple-400",
  inquiry: "bg-orange-400",
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function relativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function dateLabel(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

// ── Mock data (shown when real data is empty) ────────────────────────────────
const MOCK_SERVICE_DATA = [
  { type: "Web Design", count: 8 },
  { type: "E-commerce", count: 5 },
  { type: "Interior", count: 4 },
  { type: "SEO", count: 3 },
  { type: "Branding", count: 2 },
];

const MOCK_STATUS_DATA = [
  { status: "new", count: 6, fill: "oklch(0.6 0.12 200)" },
  { status: "in-progress", count: 3, fill: "oklch(0.75 0.15 85)" },
  { status: "completed", count: 4, fill: "oklch(0.65 0.14 160)" },
];

function buildMockActivityDays() {
  const days: { date: string; events: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      events: Math.floor(Math.random() * 18) + 2,
    });
  }
  return days;
}

const MOCK_ACTIVITY_DAYS = buildMockActivityDays();

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div
      className={`rounded-xl bg-card border p-5 flex items-start gap-4 ${accent}`}
    >
      <div className={`p-2.5 rounded-lg ${accent.replace("border", "bg")}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs mb-0.5 truncate">{label}</p>
        <p className="font-display text-3xl font-bold gold-text">{value}</p>
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────────────
function OverviewTab({
  insights,
  inquiries,
  activityLog,
  searchTerms,
}: {
  insights: [bigint, bigint, bigint, bigint] | null | undefined;
  inquiries: Inquiry[] | undefined;
  activityLog: UserActivity[] | undefined;
  searchTerms: SearchTermCount[] | undefined;
}) {
  // ── Derived chart data ──────────────────────────────────────────────────
  const serviceBarData = useMemo(() => {
    if (!inquiries || inquiries.length === 0) return MOCK_SERVICE_DATA;
    const counts: Record<string, number> = {};
    for (const inq of inquiries) {
      counts[inq.serviceType] = (counts[inq.serviceType] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [inquiries]);

  const statusDonutData = useMemo(() => {
    if (!inquiries || inquiries.length === 0) return MOCK_STATUS_DATA;
    const counts: Record<string, number> = {};
    for (const inq of inquiries) {
      counts[inq.status] = (counts[inq.status] || 0) + 1;
    }
    return [
      {
        status: "new",
        count: counts.new || 0,
        fill: "oklch(0.6 0.12 200)",
      },
      {
        status: "in-progress",
        count: counts["in-progress"] || 0,
        fill: "oklch(0.75 0.15 85)",
      },
      {
        status: "completed",
        count: counts.completed || 0,
        fill: "oklch(0.65 0.14 160)",
      },
    ];
  }, [inquiries]);

  const activityLineData = useMemo(() => {
    if (!activityLog || activityLog.length === 0) return MOCK_ACTIVITY_DAYS;
    // Group by date (last 14 days)
    const dateMap: Record<string, number> = {};
    for (const ev of activityLog) {
      const d = dateLabel(ev.timestamp);
      dateMap[d] = (dateMap[d] || 0) + 1;
    }
    // Build last 14 days array
    const days: { date: string; events: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      days.push({ date: key, events: dateMap[key] || 0 });
    }
    return days;
  }, [activityLog]);

  const maxSearchCount = useMemo(() => {
    if (!searchTerms || searchTerms.length === 0) return 1;
    return Math.max(...searchTerms.map((s) => Number(s.count)));
  }, [searchTerms]);

  // ── Chart configs ───────────────────────────────────────────────────────
  const barConfig: ChartConfig = {
    count: { label: "Inquiries", color: "oklch(0.78 0.14 85)" },
  };

  const lineConfig: ChartConfig = {
    events: { label: "Events", color: "oklch(0.78 0.14 85)" },
  };

  const donutConfig: ChartConfig = {
    new: { label: "New", color: "oklch(0.6 0.12 200)" },
    "in-progress": { label: "In Progress", color: "oklch(0.75 0.15 85)" },
    completed: { label: "Completed", color: "oklch(0.65 0.14 160)" },
  };

  return (
    <div className="space-y-6">
      {/* Row 1 — KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Listings"
          value={insights ? Number(insights[0]) : "—"}
          icon={Package}
          accent="border-blue-500/20 text-blue-400"
        />
        <KpiCard
          label="Total Inquiries"
          value={insights ? Number(insights[2]) : "—"}
          icon={MessageSquare}
          accent="border-primary/20 text-primary"
        />
        <KpiCard
          label="New Inquiries"
          value={insights ? Number(insights[3]) : "—"}
          icon={Bell}
          accent="border-orange-500/20 text-orange-400"
        />
        <KpiCard
          label="Activity Events"
          value={activityLog?.length ?? "—"}
          icon={Activity}
          accent="border-purple-500/20 text-purple-400"
        />
      </div>

      {/* Row 2 — Bar + Donut */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="rounded-xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Inquiries by Service Type</h3>
          </div>
          <ChartContainer config={barConfig} className="h-52">
            <BarChart
              data={serviceBarData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/40"
              />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Donut chart */}
        <div className="rounded-xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Inquiry Status Breakdown</h3>
          </div>
          <ChartContainer config={donutConfig} className="h-52">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent nameKey="status" hideLabel={true} />
                }
              />
              <Pie
                data={statusDonutData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {statusDonutData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="status"
                    payload={statusDonutData.map((d) => ({
                      value: d.status,
                      color: d.fill,
                      dataKey: d.status,
                    }))}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* Row 3 — Line chart */}
      <div className="rounded-xl bg-card border border-border/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">
            Activity Over Time (Last 14 Days)
          </h3>
        </div>
        <ChartContainer config={lineConfig} className="h-52">
          <LineChart
            data={activityLineData}
            margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border/40"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="events"
              stroke="var(--color-events)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-events)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Row 4 — Recent Inquiries + Activity Feed */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Inquiries */}
        <div className="rounded-xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Recent Inquiries</h3>
          </div>
          <div className="space-y-3">
            {(inquiries ?? []).length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="admin.empty_state"
              >
                No inquiries yet
              </p>
            ) : (
              (inquiries ?? []).slice(0, 5).map((inq, idx) => (
                <div
                  key={Number(inq.id)}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/50 border border-border/40"
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {inq.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {inq.serviceType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`text-xs ${STATUS_COLORS[inq.status] || "bg-muted"}`}
                    >
                      {inq.status}
                    </Badge>
                    {inq.phone && (
                      <a
                        href={`https://wa.me/91${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hello ${inq.clientName}, thank you for reaching out to SK Web Solutions! We received your inquiry about ${inq.serviceType}. - SK Web Solutions`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-500 hover:bg-green-500/10"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent("Re: Your Inquiry - SK Web Solutions")}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-500 hover:bg-blue-500/10"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed Timeline */}
        <div className="rounded-xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Activity Feed</h3>
          </div>
          <div className="space-y-0">
            {(activityLog ?? []).length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="admin.empty_state"
              >
                No activity yet
              </p>
            ) : (
              <div className="relative pl-5">
                {/* Vertical line */}
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border/60" />
                <div className="space-y-3">
                  {(activityLog ?? []).slice(0, 10).map((ev) => (
                    <div key={Number(ev.id)} className="relative">
                      {/* Dot */}
                      <div
                        className={`absolute -left-3.5 top-1 h-2.5 w-2.5 rounded-full border-2 border-background ${
                          ACTIVITY_DOT[ev.action] || "bg-muted-foreground"
                        }`}
                      />
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              className={`text-[10px] h-4 px-1.5 ${STATUS_COLORS[ev.action] || "bg-muted"}`}
                            >
                              {ev.action}
                            </Badge>
                            {ev.detail && (
                              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {ev.detail}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                          {relativeTime(ev.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 5 — Top Search Terms */}
      {((searchTerms ?? []).length > 0 || true) && (
        <div className="rounded-xl bg-card border border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Top Search Terms</h3>
          </div>
          {(searchTerms ?? []).length === 0 ? (
            <p
              className="text-sm text-muted-foreground py-2"
              data-ocid="admin.empty_state"
            >
              No searches recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {(searchTerms ?? []).slice(0, 8).map((st, idx) => (
                <div
                  key={st.term}
                  className="space-y-1"
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{st.term}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 tabular-nums">
                      {Number(st.count)}
                    </Badge>
                  </div>
                  <Progress
                    value={(Number(st.count) / maxSearchCount) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { actor } = useActor();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // ---- Queries ----
  const { data: insights } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () =>
      actor ? (actor as unknown as FullBackend).getInsights() : null,
    enabled: !!actor,
  });

  const { data: listings, isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: ["admin-listings"],
    queryFn: async () =>
      actor ? (actor as unknown as FullBackend).getListings() : [],
    enabled: !!actor,
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["admin-inquiries"],
    queryFn: async () =>
      actor ? (actor as unknown as FullBackend).getAllInquiries() : [],
    enabled: !!actor,
  });

  const { data: activityLog } = useQuery<UserActivity[]>({
    queryKey: ["admin-activity"],
    queryFn: async () =>
      actor ? (actor as unknown as FullBackend).getActivityLog() : [],
    enabled: !!actor,
  });

  const { data: searchTerms } = useQuery<SearchTermCount[]>({
    queryKey: ["admin-search-terms"],
    queryFn: async () =>
      actor ? (actor as unknown as FullBackend).getSearchTerms() : [],
    enabled: !!actor,
  });

  // ---- Listing Mutations ----
  const [listingModal, setListingModal] = useState<{
    open: boolean;
    listing: Listing | null;
  }>({
    open: false,
    listing: null,
  });

  const [listingForm, setListingForm] = useState<Omit<Listing, "id">>({
    title: "",
    description: "",
    category: "",
    price: "",
    techTags: [],
    status: "available",
    featured: false,
  });

  function openListingModal(listing: Listing | null) {
    setListingModal({ open: true, listing });
    if (listing) {
      setListingForm({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        price: listing.price,
        techTags: listing.techTags,
        status: listing.status,
        featured: listing.featured,
      });
    } else {
      setListingForm({
        title: "",
        description: "",
        category: "",
        price: "",
        techTags: [],
        status: "available",
        featured: false,
      });
    }
  }

  const saveListing = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (listingModal.listing) {
        await (actor as unknown as FullBackend).updateListing({
          ...listingModal.listing,
          ...listingForm,
        });
      } else {
        await (actor as unknown as FullBackend).addListing({
          id: 0n,
          ...listingForm,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setListingModal({ open: false, listing: null });
      toast.success("Listing saved!");
    },
    onError: () => toast.error("Failed to save listing"),
  });

  const deleteListing = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await (actor as unknown as FullBackend).deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Listing deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  // ---- Inquiry Mutation ----
  const updateInquiry = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: { id: bigint; status: string; notes: string }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as unknown as FullBackend).updateInquiryStatus(
        id,
        status,
        notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry updated");
    },
    onError: () => toast.error("Failed to update inquiry"),
  });

  const [inquiryNotes, setInquiryNotes] = useState<Record<string, string>>({});

  // ---- Inquiry summary counts ----
  const inquiryCounts = useMemo(() => {
    const list = inquiries ?? [];
    return {
      total: list.length,
      new: list.filter((i) => i.status === "new").length,
      inProgress: list.filter((i) => i.status === "in-progress").length,
      completed: list.filter((i) => i.status === "completed").length,
    };
  }, [inquiries]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="admin.section"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            SK Web Solutions — Management Portal
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clear}
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          data-ocid="admin.secondary_button"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        data-ocid="admin.section"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 bg-secondary">
          {[
            { id: "overview", icon: BarChart3, label: "Overview" },
            { id: "listings", icon: Package, label: "Listings" },
            { id: "packages", icon: Package, label: "Packages" },
            { id: "inquiries", icon: MessageSquare, label: "Inquiries" },
            { id: "activity", icon: Activity, label: "Activity" },
            { id: "users", icon: Users, label: "Users" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-1.5 text-xs"
              data-ocid="admin.tab"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" data-ocid="admin.panel">
          <OverviewTab
            insights={insights as [bigint, bigint, bigint, bigint] | null}
            inquiries={inquiries}
            activityLog={activityLog}
            searchTerms={searchTerms}
          />
        </TabsContent>

        {/* Listings */}
        <TabsContent value="listings" data-ocid="admin.panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Website Listings</h2>
            <Button
              size="sm"
              className="btn-gold gap-2"
              onClick={() => openListingModal(null)}
              data-ocid="admin.primary_button"
            >
              <Plus className="h-4 w-4" /> Add Listing
            </Button>
          </div>
          {listingsLoading ? (
            <Skeleton className="h-64" data-ocid="admin.loading_state" />
          ) : (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(listings ?? []).map((l) => (
                    <TableRow key={Number(l.id)} data-ocid="admin.row">
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {l.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-primary font-semibold">
                        {l.price}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            l.status === "available"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-muted"
                          }`}
                        >
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openListingModal(l)}
                            data-ocid="admin.edit_button"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteListing.mutate(l.id)}
                            data-ocid="admin.delete_button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(listings ?? []).length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                        data-ocid="admin.empty_state"
                      >
                        No listings yet. Add your first one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Packages */}
        <TabsContent value="packages" data-ocid="admin.panel">
          <h2 className="font-semibold mb-4">Service Packages</h2>
          <p className="text-muted-foreground text-sm">
            Packages are managed via the backend canister. Current packages are
            displayed on the Services page.
          </p>
        </TabsContent>

        {/* Inquiries */}
        <TabsContent value="inquiries" data-ocid="admin.panel">
          {/* Summary pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border/60 text-xs font-medium">
              <span className="text-muted-foreground">Total</span>
              <span className="ml-1 font-bold">{inquiryCounts.total}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
              New
              <span className="ml-1 font-bold">{inquiryCounts.new}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-400">
              In Progress
              <span className="ml-1 font-bold">{inquiryCounts.inProgress}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
              Completed
              <span className="ml-1 font-bold">{inquiryCounts.completed}</span>
            </div>
          </div>

          <h2 className="font-semibold mb-4">Client Inquiries</h2>
          {inquiriesLoading ? (
            <Skeleton className="h-64" data-ocid="admin.loading_state" />
          ) : (
            <div className="space-y-4">
              {(inquiries ?? []).length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  No inquiries yet.
                </div>
              ) : (
                (inquiries ?? []).map((inq, idx) => (
                  <div
                    key={Number(inq.id)}
                    className="rounded-xl border border-border/60 bg-card p-5"
                    data-ocid={`admin.item.${idx + 1}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-semibold">{inq.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {inq.email} · {inq.serviceType}
                          {inq.phone && <span> · 📱 {inq.phone}</span>}
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${STATUS_COLORS[inq.status] || "bg-muted"}`}
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {inq.message}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Select
                        defaultValue={inq.status}
                        onValueChange={(val) =>
                          updateInquiry.mutate({
                            id: inq.id,
                            status: val,
                            notes: inquiryNotes[String(inq.id)] || inq.notes,
                          })
                        }
                      >
                        <SelectTrigger
                          className="w-36 h-8 text-xs"
                          data-ocid="admin.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Add note..."
                        className="flex-1 h-8 text-xs"
                        value={inquiryNotes[String(inq.id)] || ""}
                        onChange={(e) =>
                          setInquiryNotes((p) => ({
                            ...p,
                            [String(inq.id)]: e.target.value,
                          }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>

                    {/* Reply buttons */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
                      {inq.phone && (
                        <a
                          href={`https://wa.me/91${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${inq.clientName}, thank you for reaching out to SK Web Solutions! We received your inquiry about ${inq.serviceType}. We'll get back to you shortly. - SK Web Solutions Team`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="admin.secondary_button"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1.5 text-green-500 border-green-500/30 hover:bg-green-500/10"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp Reply
                          </Button>
                        </a>
                      )}
                      <a
                        href={`mailto:${inq.email}?subject=${encodeURIComponent(
                          "Re: Your Inquiry - SK Web Solutions",
                        )}&body=${encodeURIComponent(
                          `Hello ${inq.clientName},\n\nThank you for reaching out to SK Web Solutions!\n\nWe received your inquiry about ${inq.serviceType} and wanted to follow up.\n\n${
                            inq.message
                              ? `Your message: "${inq.message}"\n\n`
                              : ""
                          }We'd love to discuss your requirements further. Please feel free to reply to this email or call us.\n\nBest regards,\nSarang Kumar\nSK Web Solutions\nHyderabad, India\n📧 mrsergio569@gmail.com`,
                        )}`}
                        data-ocid="admin.secondary_button"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
                        >
                          <Mail className="w-3 h-3" />
                          Email Reply
                        </Button>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" data-ocid="admin.panel">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Visual timeline */}
            <div>
              <h2 className="font-semibold mb-4">Live Timeline</h2>
              <div className="rounded-xl bg-card border border-border/60 p-4">
                {(activityLog ?? []).length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground py-4 text-center"
                    data-ocid="admin.empty_state"
                  >
                    No activity yet.
                  </p>
                ) : (
                  <div className="relative pl-5">
                    <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border/60" />
                    <div className="space-y-4">
                      {(activityLog ?? []).slice(0, 15).map((ev) => (
                        <div key={Number(ev.id)} className="relative">
                          <div
                            className={`absolute -left-3.5 top-1 h-2.5 w-2.5 rounded-full border-2 border-background ${
                              ACTIVITY_DOT[ev.action] || "bg-muted-foreground"
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge
                                className={`text-[10px] h-4 px-1.5 ${
                                  STATUS_COLORS[ev.action] || "bg-muted"
                                }`}
                              >
                                {ev.action}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {relativeTime(ev.timestamp)}
                              </span>
                            </div>
                            {ev.detail && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {ev.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity table */}
            <div className="md:col-span-2">
              <h2 className="font-semibold mb-4">Recent Activity</h2>
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activityLog ?? []).slice(0, 50).map((ev) => (
                      <TableRow key={Number(ev.id)} data-ocid="admin.row">
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(ev.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              STATUS_COLORS[ev.action] || "bg-muted"
                            }`}
                          >
                            {ev.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {ev.principalText.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {ev.detail}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(activityLog ?? []).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-8"
                          data-ocid="admin.empty_state"
                        >
                          No activity logged yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Top searches in activity tab */}
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-3">Top Searches</h3>
                <div className="space-y-2">
                  {(searchTerms ?? []).slice(0, 10).map((st, idx) => (
                    <div
                      key={st.term}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/60"
                      data-ocid={`admin.item.${idx + 1}`}
                    >
                      <span className="text-sm font-medium">{st.term}</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {Number(st.count)}
                      </Badge>
                    </div>
                  ))}
                  {(searchTerms ?? []).length === 0 && (
                    <div
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-ocid="admin.empty_state"
                    >
                      No searches yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" data-ocid="admin.panel">
          <h2 className="font-semibold mb-4">User Management</h2>
          <div className="rounded-xl bg-card border border-border/60 p-6">
            <p className="text-muted-foreground text-sm">
              User management is handled via the Authorization component. Role
              assignments and access control are configured through the backend
              canister.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/15">
              <p className="text-sm font-medium text-primary">
                Admin Principal
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Access is controlled by Internet Identity. Your principal is
                auto-recognized as admin.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Listing Modal */}
      <Dialog
        open={listingModal.open}
        onOpenChange={(o) => setListingModal({ open: o, listing: null })}
      >
        <DialogContent
          className="bg-card border-border max-w-lg"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {listingModal.listing ? "Edit Listing" : "Add New Listing"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                value={listingForm.title}
                onChange={(e) =>
                  setListingForm((p) => ({ ...p, title: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={listingForm.description}
                onChange={(e) =>
                  setListingForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-secondary border-border resize-none"
                rows={3}
                data-ocid="admin.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Input
                  value={listingForm.category}
                  onChange={(e) =>
                    setListingForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Price</Label>
                <Input
                  value={listingForm.price}
                  onChange={(e) =>
                    setListingForm((p) => ({ ...p, price: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="admin.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tech Tags (comma separated)</Label>
              <Input
                value={listingForm.techTags.join(", ")}
                onChange={(e) =>
                  setListingForm((p) => ({
                    ...p,
                    techTags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                className="bg-secondary border-border"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setListingModal({ open: false, listing: null })}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="btn-gold"
              onClick={() => saveListing.mutate()}
              disabled={saveListing.isPending}
              data-ocid="admin.save_button"
            >
              {saveListing.isPending ? "Saving..." : "Save Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
