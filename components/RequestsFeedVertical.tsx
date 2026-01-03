import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RequestsFeedVertical() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function fetchRequests() {
      const res = await fetch("/api/admin/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 className="text-5xl font-bold text-[#1B0073] text-center m-10">The Request <span className="text-[#00A5E0]">Streamline</span></h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {requests.map((r: any) => (
        <div
          key={r.id}
          onClick={() => router.push('/login')}
          className="cursor-pointer"
        >
          <Card
            className="relative w-full min-h-[320px] bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-xl rounded-3xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <Image
                  src={"/user-male.png"}
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-blue-900 text-xl truncate">
                  {r.user?.fullName || "-"}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {r.user?.address || "-"}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-md ${r.status === "approved"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : r.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : r.status === "rejected"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
              >
                {r.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-blue-800">Type:</span> {r.type}
            </div>
            <div className="text-sm text-gray-600 mb-2 line-clamp-3 leading-relaxed">
              <span className="font-semibold text-blue-800">Description:</span> {r.description || "-"}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="text-xs text-gray-500 font-medium">
                {new Date(r.submittedAt).toLocaleDateString()}
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
              >
                Join Us to Donate
              </button>
            </div>
          </Card>
        </div>
      ))}
      </div>
    </div>
  );
}
