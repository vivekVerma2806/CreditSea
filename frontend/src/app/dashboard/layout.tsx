"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CheckCircle, Send, CreditCard, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole) {
      router.push("/auth/login");
      return;
    }
    if (userRole === "Borrower") {
      router.push("/borrower/dashboard");
      return;
    }
    setRole(userRole);
  }, [router]);

  if (!role) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Sales", "Sanction", "Disbursement", "Collection"] },
    { label: "Sales (Leads)", href: "/dashboard/sales", icon: Users, roles: ["Admin", "Sales"] },
    { label: "Sanction", href: "/dashboard/sanction", icon: CheckCircle, roles: ["Admin", "Sanction"] },
    { label: "Disbursement", href: "/dashboard/disbursement", icon: Send, roles: ["Admin", "Disbursement"] },
    { label: "Collection", href: "/dashboard/collection", icon: CreditCard, roles: ["Admin", "Collection"] },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
              <span className="text-white font-bold text-sm -rotate-45">LMS</span>
            </div>
            <span className="font-bold text-xl text-blue-600">CreditSea</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-4 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {role} Portal
          </div>
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
