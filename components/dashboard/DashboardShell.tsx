'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Telescope,
  FileCheck,
  BarChart2,
  Settings,
  Plus,
  Search,
  Bell,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { mockEmpresa } from '@/lib/mocks';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/oportunidades', label: 'Oportunidades', icon: Telescope },
  { href: '/dashboard/mis-licitaciones', label: 'Mis Licitaciones', icon: FileCheck },
  { href: '/dashboard/metricas', label: 'Métricas', icon: BarChart2, soon: true },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

interface DashboardShellProps {
  readonly children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] text-[#1e1b19]">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:flex bg-[#fff8f5] border-r border-[#c3c6d5] h-screen w-64 fixed left-0 top-0 flex-col py-8 z-20">
        {/* Brand */}
        <div className="px-6 mb-8">
          <Link href="/dashboard" className="block">
            <h1 className="text-[22px] font-bold text-[#00327d] leading-tight" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              TenderAlert
            </h1>
            <p className="text-[10px] text-[#434653] tracking-[0.12em] uppercase mt-0.5">
              Enterprise Procurement
            </p>
          </Link>
        </div>

        {/* Company badge */}
        <div className="mx-4 mb-6 px-3 py-3 rounded-lg bg-[#f4ece8] border border-[#e9e1dd]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#00327d] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#434653] font-medium truncate">{mockEmpresa.razonSocial}</p>
              <p className="text-[10px] text-[#737784]">RUC {mockEmpresa.ruc}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.soon) {
              return (
                <div
                  key={item.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-[#c3c6d5] cursor-not-allowed"
                >
                  <Icon className="w-4 h-4 mr-3 shrink-0" />
                  <span className="text-xs font-semibold flex-1">{item.label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#eee7e3] text-[#737784] px-1.5 py-0.5 rounded">
                    Pronto
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 text-xs font-semibold group ${
                  isActive
                    ? 'text-[#00327d] bg-[#0047ab]/10 border-l-[3px] border-[#00327d] pl-[9px]'
                    : 'text-[#434653] hover:bg-[#eee7e3] hover:text-[#1e1b19]'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-[#00327d]' : 'text-[#737784] group-hover:text-[#434653]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="px-4 mt-6">
          <button className="flex items-center justify-center w-full px-4 py-3 bg-[#00327d] text-white rounded-xl font-bold shadow hover:bg-[#0047ab] transition-colors text-xs tracking-wide">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Análisis
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────── */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#fff8f5] border-b border-[#c3c6d5] sticky top-0 z-10 flex items-center px-6 py-3.5 gap-4">
          {/* Centered search */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-[#faf2ee] px-3 py-2.5 rounded-lg border border-[#c3c6d5] w-full max-w-sm focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
              <Search className="w-4 h-4 text-[#737784] mr-2 shrink-0" />
              <input
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#737784]"
                placeholder="Buscar licitaciones, entidades..."
                type="text"
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative text-[#434653] hover:text-[#00327d] transition-colors p-1.5 rounded-lg hover:bg-[#f4ece8]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0047ab] rounded-full ring-1 ring-[#fff8f5]" />
            </button>
            <button className="text-[#434653] hover:text-[#00327d] transition-colors p-1.5 rounded-lg hover:bg-[#f4ece8]">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#c3c6d5]">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-semibold text-[#1e1b19] leading-tight">Alejandro V.</p>
                <p className="text-[10px] text-[#434653] uppercase tracking-wider leading-tight">
                  Director Ejecutivo
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00327d] flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
                AV
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
