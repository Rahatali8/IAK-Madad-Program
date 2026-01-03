"use client";

import {
  Badge,
  User,
  FileText,
  Clock,
  CheckSquare,
  XSquare,
  HelpCircle,
  TrendingUp,
  DollarSign,
  MapPin,
  Shield,
  ClipboardList,
  Send,
  CalendarDays,
  Hash,
} from "lucide-react";
import { formatCNIC } from "@/lib/utils";
import { Request } from "./types";
import { ReactNode } from "react";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) =>
  value ? (
    <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
      <div className="flex-shrink-0 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-1 text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  ) : null;

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
      {icon}
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {children}
    </div>
  </div>
);

export function RequestDetails({ request }: { request: Request }) {
  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">{status}</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
        );
    }
  };
  return (
    <div className="space-y-6 p-1">
      <Section
        title="Applicant Information"
        icon={<User className="h-6 w-6 text-blue-600" />}
      >
        <InfoRow
          icon={<User className="h-5 w-5" />}
          label="Applicant Name"
          value={request.name}
        />
        <InfoRow
          icon={<Hash className="h-5 w-5" />}
          label="CNIC"
          value={formatCNIC(request.cnic)}
        />
        <InfoRow
          icon={<MapPin className="h-5 w-5" />}
          label="Current Address"
          value={request.currentAddress || "-"}
        />
        <InfoRow
          icon={<DollarSign className="h-5 w-5" />}
          label="Monthly Salary"
          value={
            request.amount ? `PKR ${request.amount.toLocaleString()}` : null
          }
        />
      </Section>

      <Section
        title="Request Details"
        icon={<FileText className="h-6 w-6 text-blue-600" />}
      >
        <InfoRow
          icon={<HelpCircle className="h-5 w-5" />}
          label="Request Type"
          value={request.request_type}
        />
        <InfoRow
          icon={<TrendingUp className="h-5 w-5" />}
          label="Status"
          value={statusBadge(request.status)}
        />
        <InfoRow
          icon={<CalendarDays className="h-5 w-5" />}
          label="Submitted"
          value={new Date(request.created_at).toLocaleDateString()}
        />
        <InfoRow
          icon={<FileText className="h-5 w-5" />}
          label="Reason"
          value={request.reason}
        />
        {request.rejection_reason && (
          <InfoRow
            icon={<XSquare className="h-5 w-5 text-red-500" />}
            label="Rejection Reason"
            value={request.rejection_reason}
          />
        )}
      </Section>

      <Section
        title="Verification & Survey"
        icon={<Shield className="h-6 w-6 text-blue-600" />}
      >
        <InfoRow
          icon={<CheckSquare className="h-5 w-5" />}
          label="Verification Complete"
          value={request.verification_complete ? "Yes" : "No"}
        />
        <InfoRow
          icon={<Send className="h-5 w-5" />}
          label="Forwarded to Survey"
          value={request.forwardedToSurvey ? "Yes" : "No"}
        />
        <InfoRow
          icon={<ClipboardList className="h-5 w-5" />}
          label="Survey Status"
          value={request.surveyStatus || "-"}
        />
        <InfoRow
          icon={<FileText className="h-5 w-5" />}
          label="Survey Recommendation"
          value={request.surveyRecommendation || "-"}
        />
        <InfoRow
          icon={<FileText className="h-5 w-5" />}
          label="Survey Report"
          value={request.surveyReport || "-"}
        />
        <InfoRow
          icon={<Send className="h-5 w-5" />}
          label="Sent to Admin"
          value={request.sentToAdmin ? "Yes" : "No"}
        />
      </Section>
    </div>
  );
}
