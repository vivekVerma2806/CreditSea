"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

export default function CollectionModule() {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/collection/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching loans", err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/dashboard/collection/payments`, 
      { loanId: selectedLoanId, utr, amount: Number(amount) }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedLoanId(null);
      setUtr("");
      setAmount("");
      fetchLoans();
      alert("Payment recorded successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error recording payment");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Collection Module</h1>
      
      {/* Payment Form Modal - simplified as inline for now */}
      {selectedLoanId && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Record Payment</h2>
          <form onSubmit={handlePayment} className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">UTR Number</label>
              <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={utr} onChange={(e) => setUtr(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input type="number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Record</button>
              <button type="button" onClick={() => setSelectedLoanId(null)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PAN</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Due</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loans.map((loan: any) => {
              const balance = loan.totalRepayment - loan.amountPaid;
              return (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{loan.borrowerId?.pan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{Math.round(loan.totalRepayment).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">₹{Math.round(loan.amountPaid).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">₹{Math.round(balance).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => setSelectedLoanId(loan._id)} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-medium text-sm">Add Payment</button>
                  </td>
                </tr>
              )
            })}
            {loans.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No active loans requiring collection.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
