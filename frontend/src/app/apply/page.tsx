"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/api";

export default function ApplyFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Profile State
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employmentMode, setEmploymentMode] = useState("Salaried");

  // Step 2: Upload State
  const [salarySlip, setSalarySlip] = useState<File | null>(null);

  // Step 3: Config State
  const [amount, setAmount] = useState(5000);
  const [tenure, setTenure] = useState(30);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const headers = {
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_URL}/api/borrower/profile`,
        { pan, dob, monthlySalary: Number(monthlySalary), employmentMode },
        { headers }
      );
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error submitting profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salarySlip) {
      setError("Please select a file to upload");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("salarySlip", salarySlip);
      await axios.post(`${API_URL}/api/borrower/upload-slip`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_URL}/api/borrower/loan`,
        { amount: Number(amount), tenure: Number(tenure) },
        { headers }
      );
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error submitting loan");
    } finally {
      setLoading(false);
    }
  };

  // Calculations for Step 3
  const interestRate = 0.12;
  const simpleInterest = (amount * interestRate * tenure) / 365;
  const totalRepayment = amount + simpleInterest;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12">
      <div className="max-w-3xl w-full mx-auto px-4">
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {["Details", "Upload", "Configure", "Complete"].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step > i ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${step > i ? "text-blue-600" : "text-gray-500"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details & Eligibility</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                  <input type="text" required pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Format: ABCDE1234F" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 uppercase" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input type="date" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Salary (₹)</label>
                  <input type="number" required min="1000" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="e.g. 50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employment Mode</label>
                  <select className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500" value={employmentMode} onChange={(e) => setEmploymentMode(e.target.value)}>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="mt-8 w-full py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-70">
                {loading ? "Checking Eligibility..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Salary Slip</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" required accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && setSalarySlip(e.target.files[0])} />
                <div className="text-gray-500">
                  {salarySlip ? (
                    <span className="font-semibold text-blue-600">{salarySlip.name}</span>
                  ) : (
                    <>
                      <p className="font-medium text-lg">Click or drag file to this area to upload</p>
                      <p className="text-sm mt-2">Support for PDF, JPG, PNG (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
              <button type="submit" disabled={loading} className="mt-8 w-full py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-70">
                {loading ? "Uploading..." : "Upload & Continue"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleLoanSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure Loan</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                    <span className="font-bold text-blue-600">₹{amount.toLocaleString()}</span>
                  </div>
                  <input type="range" min="50000" max="500000" step="10000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹50K</span>
                    <span>₹5L</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Tenure (Days)</label>
                    <span className="font-bold text-blue-600">{tenure} Days</span>
                  </div>
                  <input type="range" min="30" max="365" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>30 Days</span>
                    <span>365 Days</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-800 mb-4">Repayment Summary (12% p.a.)</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-medium text-gray-900">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-medium text-gray-900">₹{Math.round(simpleInterest).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-blue-200 flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total Repayment</span>
                    <span className="text-blue-600">₹{Math.round(totalRepayment).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-8 w-full py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-70">
                {loading ? "Submitting..." : "Apply Now"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your loan application has been successfully submitted and is currently under review by our Sanction team.
              </p>
              <button onClick={() => router.push("/")} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition">
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
