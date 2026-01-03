import { ReactNode } from "react";

export interface Request {
  id: number;
  name: string;
  cnic: string;
  request_type: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
  amount?: number;
  reason?: string;
  currentAddress?: string;
  rejection_reason?: string | null;
  userId?: number;
  submittedAt?: string;
  verification_complete?: boolean;
  forwardedToSurvey?: boolean;
  surveyStatus?: string;
  surveyStatusNormalized?: string;
  surveyRecommendation?: string | null;
  surveyReport?: string | null;
  surveyAttachments?: any[];
  sentToAdmin?: boolean;
}

export interface Donor {
  id: number;
  name: string;
  email: string;
  cnic: string;
  contact_number?: string | null;
  organization_name?: string | null;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  created_at: string;
}

export interface Analytics {
  impactScore?: number;
  totalDonated?: number;
  acceptedRequests?: number;
  monthlyDonations?: number;
  totalUsers?: ReactNode;
  totalRequests?: number;
  pendingRequests?: number;
  approvedRequests?: number;
  rejectedRequests?: number;
  totalAmount?: number;
  loanRequests?: number;
  microfinanceRequests?: number;
  generalRequests?: number;
}
