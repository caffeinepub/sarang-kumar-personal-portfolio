import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface Listing {
    id: bigint;
    title: string;
    description: string;
    category: string;
    price: string;
    techTags: string[];
    status: string;
    featured: boolean;
}
export interface ServicePackage {
    id: bigint;
    name: string;
    description: string;
    price: string;
    features: string[];
    popular: boolean;
}
export interface Inquiry {
    id: bigint;
    caller: Principal;
    clientName: string;
    email: string;
    phone: string;
    message: string;
    serviceType: string;
    status: string;
    notes: string;
    timestamp: bigint;
}
export interface UserActivity {
    id: bigint;
    principal: Principal;
    principalText: string;
    action: string;
    detail: string;
    timestamp: bigint;
}
export interface SearchTermCount {
    term: string;
    count: bigint;
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    getListings(): Promise<Listing[]>;
    addListing(l: Listing): Promise<bigint>;
    updateListing(l: Listing): Promise<boolean>;
    deleteListing(id: bigint): Promise<boolean>;
    getPackages(): Promise<ServicePackage[]>;
    updatePackage(p: ServicePackage): Promise<boolean>;
    submitInquiry(clientName: string, email: string, phone: string, message: string, serviceType: string): Promise<bigint>;
    getMyInquiries(): Promise<Inquiry[]>;
    getAllInquiries(): Promise<Inquiry[]>;
    updateInquiryStatus(id: bigint, status: string, notes: string): Promise<boolean>;
    getInsights(): Promise<[bigint, bigint, bigint, bigint]>;
    logActivity(action: string, detail: string): Promise<void>;
    getActivityLog(): Promise<UserActivity[]>;
    getSearchTerms(): Promise<SearchTermCount[]>;
}
