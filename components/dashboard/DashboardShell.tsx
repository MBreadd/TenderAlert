'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Telescope, FileCheck, Settings, Plus, Search, Bell, HelpCircle, Menu, X } from "lucide-react";
import type { Empresa } from "@/lib/types";
import { getEmpresa } from "@/lib/store/empresa";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const e = getEmpresa();
    if (!e) {
      router.replace("/");
      return;
    }
    setEmpresa(e);
  }, [router]);

  if (!empresa) {
    return (
      <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-32 bg-[#c3c6d5]/20 rounded mx-auto"></div>
          <p className="text-sm text-[#434653]">Cargando panel...</p>
        </div>
      </div>
    );
  }

  // Generar las iniciales del nombre de la empresa para un avatar premium
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Explorador",
      href: "/dashboard/oportunidades",
      icon: Telescope,
    },
    {
      name: "Mis Licitaciones",
      href: "/dashboard/mis-licitaciones",
      icon: FileCheck,
    },
    {
      name: "Configuración",
      href: "/dashboard/configuracion",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] text-[#1e1b19] font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center w-full bg-[#fff8f5] border-b border-[#c3c6d5] px-6 py-4 fixed top-0 left-0 z-50">
        <h1 className="font-serif text-xl font-bold text-[#00327d]">
          TenderAlert
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#434653] hover:text-[#00327d] transition-colors p-1"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`bg-[#fff8f5] border-r border-[#c3c6d5] h-screen w-64 fixed left-0 top-0 flex flex-col py-8 z-40 transition-transform duration-300 transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 mb-8 mt-12 md:mt-0">
          <h1 className="font-serif text-2xl font-bold text-[#00327d] tracking-tight">
            TenderAlert
          </h1>
          <p className="text-[9px] font-bold text-[#434653] uppercase tracking-widest mt-1">
            Enterprise Procurement
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? "text-[#00327d] bg-[#0047ab]/10 font-bold border-l-4 border-[#00327d]"
                    : "text-[#434653] hover:bg-[#eee7e3]/60 hover:text-[#00327d]"
                }`}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Active Workspace details */}
        <div className="px-4 mt-auto pt-4 border-t border-[#c3c6d5]/40">
          <div className="bg-[#faf2ee] p-3 rounded-lg border border-[#c3c6d5]/50 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#00327d] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {getInitials(empresa.razonSocial)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1e1b19] truncate leading-none">
                {empresa.razonSocial}
              </p>
              <p className="text-[9px] text-[#434653] uppercase tracking-tight mt-1 truncate">
                RUC {empresa.ruc}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 pt-[72px] md:pt-0">
        {/* Top Header Navbar - Center Search */}
        <header className="bg-[#fff8f5] border-b border-[#c3c6d5] sticky top-0 z-30 flex justify-between items-center w-full px-6 md:px-12 py-4">
          <div className="flex-1 flex justify-center max-w-full">
            <div className="flex items-center bg-[#faf2ee] px-4 py-2 rounded-xl border border-[#c3c6d5] w-full max-w-lg focus-within:ring-2 focus-within:ring-[#00327d]/10 focus-within:border-[#00327d]/40 transition-all">
              <Search className="w-5 h-5 text-[#434653] mr-2 shrink-0" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-[#1e1b19] placeholder:text-[#737784]"
                placeholder="Buscar licitaciones, entidades o palabras clave..."
                type="text"
                id="header-search-bar"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 pl-4">
            <button className="text-[#434653] hover:text-[#00327d] transition-colors p-1 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
            </button>
            <button className="text-[#434653] hover:text-[#00327d] transition-colors p-1">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-[#c3c6d5]"></div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#00327d] text-white flex items-center justify-center font-bold text-xs select-none">
                {getInitials(empresa.razonSocial)}
              </div>
            </div>
          </div>
        </header>

        {/* Children content area */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
