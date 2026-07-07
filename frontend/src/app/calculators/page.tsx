"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoanCalculator from "@/components/LoanCalculator";
import { HelpCircle } from "lucide-react";

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Financial Calculators</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plan your finances accurately. Estimate your EMI and repayment timeline instantly with our beginner-friendly tools.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <LoanCalculator />
          </div>

          {/* Additional Help Section */}
          <div className="max-w-4xl mx-auto mt-20 p-8 bg-[#fdfdfd] border border-gray-100 rounded-3xl text-left shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              How we calculate interest
            </h3>
            <p className="text-[#333] leading-relaxed mb-4">
              All personal and credit builder loans offered via CreditSea are computed using a <strong>Simple Interest method</strong>. This means the interest cost is determined solely on the base principal amount of the loan, the tenure of the loan (in days), and the annual percentage rate (APR).
            </p>
            <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm inline-block text-gray-700">
              Interest = (Principal × Rate × Days) ÷ 365
            </div>
            <p className="text-sm text-gray-500 mt-4">
              For example: A loan of ₹1,00,000 at 12% p.a. for a period of 365 days would accrue a simple interest fee of exactly (₹1,00,000 × 0.12 × 365) ÷ 365 = ₹12,000. Your total repayment amount is ₹1,12,000.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
