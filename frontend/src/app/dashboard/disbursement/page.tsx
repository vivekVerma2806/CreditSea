"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

export default function DisbursementModule() {
  const [loans, setLoans] = useState([]);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/disbursement/loans`, {
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

  const handleDisburse = async (id: string) => {
    if (!confirm("Are you sure you want to disburse funds for this loan?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/disbursement/loans/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLoans();
    } catch (err) {
      console.error("Error updating loan", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Disbursement Module</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PAN</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loans.map((loan: any) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{loan.borrowerId?.pan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{loan.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(loan.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleDisburse(loan._id)} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-medium text-sm">Disburse Funds</button>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No approved loans ready for disbursement.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
