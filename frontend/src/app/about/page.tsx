"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Award, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 mb-16">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              About <span className="text-blue-600">CreditSea</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are on a mission to democratize credit access in India. Through cutting-edge technology and a commitment to customer centricity, we make borrowing simple, quick, and completely transparent.
            </p>
          </div>
        </section>

        {/* Lending Partner Highlight */}
        <section className="max-w-5xl mx-auto px-4 mb-20 text-center">
          <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 max-w-3xl mx-auto shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Lending Partner</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              CreditSea operates as a technology platform connecting borrowers with licensed financial institutions. Our primary lending partner is:
            </p>
            <p className="text-xl font-bold text-blue-700 mb-1">
              Meghdoot Mercantile Private Limited
            </p>
            <p className="text-sm text-gray-500 font-medium">
              An RBI registered Non-Banking Financial Company (NBFC)
            </p>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3">Instant Evaluation</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced Business Rule Engine (BRE) processes details in real-time, matching you with the perfect loan configurations in seconds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3">Transparent Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                Zero hidden charges, zero prepayment penalties. What you see on our interactive calculators is exactly what you repay.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950 mb-3">Beginner Friendly</h3>
              <p className="text-gray-600 leading-relaxed">
                We simplify complex financial jargon so that even first-time borrowers can choose their loan terms with complete confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-5xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-b border-gray-100">
            <div>
              <p className="text-4xl font-extrabold text-blue-600 mb-1">₹500Cr+</p>
              <p className="text-sm font-semibold text-gray-500 uppercase">Disbursed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 mb-1">2 Lakhs+</p>
              <p className="text-sm font-semibold text-gray-500 uppercase">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 mb-1">10 Minutes</p>
              <p className="text-sm font-semibold text-gray-500 uppercase">Average Setup Time</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 mb-1">98.5%</p>
              <p className="text-sm font-semibold text-gray-500 uppercase">Satisfaction Rate</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
