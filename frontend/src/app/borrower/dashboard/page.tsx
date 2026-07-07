"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Calendar, PlusCircle, CheckCircle, Clock, AlertTriangle, LogOut } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Loan {
  _id: string;
  amount: number;
  tenure: number;
  status: "Pending" | "Approved" | "Rejected" | "Disbursed" | "Closed";
  rejectionReason?: string;
  createdAt: string;
}

export default function BorrowerDashboard() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await axios.get(`${API_URL}/api/borrower/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
      setProfileExists(res.data.profileExists);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [router]);

  // Check if borrower can apply for a new loan:
  // Cannot apply if they have a loan in 'Pending', 'Approved', or 'Disbursed' state
  const hasActiveOrPendingLoan = loans.some(
    (loan) => loan.status === "Pending" || loan.status === "Approved" || loan.status === "Disbursed"
  );

  const getStatusConfig = (status: Loan["status"]) => {
    switch (status) {
      case "Pending":
        return {
          label: "Applied (Under Review)",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Clock,
        };
      case "Approved":
        return {
          label: "Sanctioned (Approved)",
          colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
        };
      case "Disbursed":
        return {
          label: "Active (Funded)",
          colorClass: "bg-green-100 text-green-800 border-green-300",
          icon: CheckCircle,
        };
      case "Closed":
        return {
          label: "Settled (Closed)",
          colorClass: "bg-gray-100 text-gray-700 border-gray-300",
          icon: CheckCircle,
        };
      case "Rejected":
        return {
          label: "Rejected",
          colorClass: "bg-red-50 text-red-700 border-red-200",
          icon: AlertTriangle,
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1c2b4d] tracking-tight">My Borrower Portal</h1>
              <p className="text-gray-500 text-base mt-1">Manage and track your active loan applications</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4 font-medium">Loading your applications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Apply Actions & Help (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Apply for Credit</h2>
                  
                  {hasActiveOrPendingLoan ? (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm leading-relaxed">
                        You have an active or pending loan application under evaluation. You will be eligible to apply for a new loan once your active balance is settled or closed.
                      </div>
                      <button
                        disabled
                        className="w-full py-4 px-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
                      >
                        <PlusCircle className="w-5 h-5" /> Apply New Loan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Need quick cash? Submit a new application form to get started. Verification takes less than 10 minutes.
                      </p>
                      <Link
                        href="/apply"
                        className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200"
                      >
                        <PlusCircle className="w-5 h-5" /> Apply New Loan
                      </Link>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2">Need Assistance?</h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-4">
                    If you have questions about interest rates, document uploads, or payment status, feel free to contact our Collections and Sanction team.
                  </p>
                  <Link href="/contact" className="text-sm font-bold text-blue-600 hover:underline">
                    Get Support &rarr;
                  </Link>
                </div>
              </div>

              {/* Right Column: My Loans Section (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    My Loans
                  </h2>

                  {loans.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-bold text-gray-700 text-lg mb-1">No Loan Applications Yet</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                        You haven't submitted any loan requests. Click "Apply New Loan" to start your application profile.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {loans.map((loan) => {
                        const config = getStatusConfig(loan.status);
                        const StatusIcon = config.icon;

                        return (
                          <div
                            key={loan._id}
                            className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-extrabold text-gray-900">
                                  ₹{loan.amount.toLocaleString()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.colorClass} flex items-center gap-1`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {config.label}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  Applied on: {new Date(loan.createdAt).toLocaleDateString()}
                                </span>
                                <span>
                                  Tenure: <strong>{loan.tenure} days</strong>
                                </span>
                              </div>

                              {loan.status === "Rejected" && loan.rejectionReason && (
                                <div className="mt-2 text-xs bg-red-50 text-red-700 border border-red-100 rounded-lg p-2.5">
                                  <strong>Reason for rejection:</strong> {loan.rejectionReason}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center">
                              {loan.status === "Pending" && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-bold border border-blue-100">
                                  Under Review
                                </span>
                              )}
                              {loan.status === "Approved" && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold border border-emerald-100">
                                  Sanctioned
                                </span>
                              )}
                              {loan.status === "Disbursed" && (
                                <Link
                                  href="/repay"
                                  className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition shadow-md shadow-blue-100"
                                >
                                  Repay Balance
                                </Link>
                              )}
                              {loan.status === "Closed" && (
                                <span className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-xl font-bold border border-gray-150">
                                  Paid Off
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
