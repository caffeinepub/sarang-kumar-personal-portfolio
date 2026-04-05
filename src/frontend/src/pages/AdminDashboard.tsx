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
  Dialog,
  DialogContent,
  DialogFooter,
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
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  login: "bg-primary/10 text-primary border-primary/20",
  search: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  inquiry: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  visit: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Listings",
                value: insights ? Number(insights[0]) : "—",
              },
              {
                label: "Available",
                value: insights ? Number(insights[1]) : "—",
              },
              {
                label: "Total Inquiries",
                value: insights ? Number(insights[2]) : "—",
              },
              {
                label: "New Inquiries",
                value: insights ? Number(insights[3]) : "—",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl bg-card border border-border/60 p-5"
              >
                <p className="text-muted-foreground text-xs mb-1">
                  {kpi.label}
                </p>
                <p className="font-display text-3xl font-bold gold-text">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-card border border-border/60 p-5">
            <h3 className="font-semibold mb-3">Activity Events</h3>
            <p className="font-display text-3xl font-bold gold-text">
              {activityLog?.length ?? "—"}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Total logged events
            </p>
          </div>
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
                          className={`text-xs ${l.status === "available" ? "bg-green-500/10 text-green-400" : "bg-muted"}`}
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
                          `Hello ${inq.clientName},\n\nThank you for reaching out to SK Web Solutions!\n\nWe received your inquiry about ${inq.serviceType} and wanted to follow up.\n\n${inq.message ? `Your message: "${inq.message}"\n\n` : ""}We'd love to discuss your requirements further. Please feel free to reply to this email or call us.\n\nBest regards,\nSarang Kumar\nSK Web Solutions\nHyderabad, India\n📧 mrsergio569@gmail.com`,
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
                            className={`text-xs ${STATUS_COLORS[ev.action] || "bg-muted"}`}
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
            </div>
            <div>
              <h2 className="font-semibold mb-4">Top Searches</h2>
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
