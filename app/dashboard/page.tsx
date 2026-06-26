/**
 * Pantalla 2 — Dashboard / Panel de oportunidades compatibles. 👤 Persona A.
 *
 * Muestra el perfil activo + lista de OportunidadCompatible (POST /api/match).
 * Incluye el "Simulador de Match": al cambiar el rubro, refresca las ofertas.
 *
 * STUB: render con mocks para no bloquearte. Cambia a fetch real cuando
 * /api/match esté listo. El contrato no cambia.
 */
import { mockOportunidades, mockEmpresa } from "@/lib/mocks";
import { OportunidadCard } from "@/components/dashboard/OportunidadCard";
import { LayoutDashboard, Telescope, FileCheck, BarChart2, Settings, Plus, Search, Bell, HelpCircle, RefreshCcw, ShieldCheck, AlertTriangle, TrendingUp, Filter, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const empresa = mockEmpresa;
  const oportunidades = mockOportunidades;

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] text-[#1e1b19] font-['Hanken_Grotesk']">
      {/* SideNavBar */}
      <aside className="bg-[#fff8f5] border-r border-[#c3c6d5] h-screen w-64 fixed left-0 top-0 flex flex-col py-12 hidden md:flex z-20">
        <div className="px-4 mb-12">
          <h1 className="font-['Libre_Caslon_Text'] text-2xl font-bold text-[#00327d]">
            TenderAlert
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase tracking-wider mt-1">
            Enterprise Procurement
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {/* Dashboard (Active) */}
          <a
            className="flex items-center px-4 py-2 text-[#00327d] font-bold border-l-4 border-[#00327d] bg-[#0047ab]/10 transition-all duration-200 opacity-90"
            href="#"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold">Dashboard</span>
          </a>
          <a
            className="flex items-center px-4 py-2 text-[#434653] hover:bg-[#eee7e3] transition-colors"
            href="#"
          >
            <Telescope className="w-5 h-5 mr-2" />
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold">Opportunities</span>
          </a>
          <a
            className="flex items-center px-4 py-2 text-[#434653] hover:bg-[#eee7e3] transition-colors"
            href="#"
          >
            <FileCheck className="w-5 h-5 mr-2" />
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold">My Tenders</span>
          </a>
          <a
            className="flex items-center px-4 py-2 text-[#434653] hover:bg-[#eee7e3] transition-colors"
            href="#"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold">Analytics</span>
          </a>
          <a
            className="flex items-center px-4 py-2 text-[#434653] hover:bg-[#eee7e3] transition-colors"
            href="#"
          >
            <Settings className="w-5 h-5 mr-2" />
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold">Settings</span>
          </a>
        </nav>
        <div className="px-4 mt-auto">
          <button className="w-full py-4 px-6 bg-[#00327d] text-white rounded-lg font-['Hanken_Grotesk'] text-xs font-semibold flex items-center justify-center hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5 mr-2" />
            New Analysis
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* TopNavBar */}
        <header className="bg-[#fff8f5] border-b border-[#c3c6d5] sticky top-0 z-10 flex justify-between items-center w-full px-12 py-4">
          <div className="flex items-center bg-[#faf2ee] px-4 py-2 rounded-lg border border-[#c3c6d5] w-96 focus-within:ring-2 focus-within:ring-[#00327d]/10">
            <Search className="w-5 h-5 text-[#434653] mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              placeholder="Search opportunities, entities, or IDs..."
              type="text"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button className="text-[#434653] hover:text-[#00327d] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-[#434653] hover:text-[#00327d] transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center pl-6 border-l border-[#c3c6d5]">
              <div className="text-right mr-2 hidden lg:block">
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#1e1b19]">
                  {empresa.representanteLegal || "Alejandro V."}
                </p>
                <p className="text-[10px] font-['Hanken_Grotesk'] text-[#434653] uppercase">
                  Director Ejecutivo
                </p>
              </div>
              <img
                className="w-10 h-10 rounded-full border border-[#c3c6d5] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFaSOAWQkALlPqzwjxxibuE5xs--V4YluzEQ3V7PbkjvaXNrdMH-nv2T_UU_HxN5fWwJlOSHDPbDnl644zpv7Ar5ySBvdJDPBRzNqBJQOJHjpJ7ZMV-r22jOps64lNH_kS7TT_MM36lCwgVlh3PvDQTr4CCv9DLea-U6gPjFEBIcc0U8cJzecS8XhcUoRdh4fQxKxyo0AuHBcYrUJ0oY_sbc0aI5Ftjgv_TLtyW5tKUBbxIxwzqvjR5GUXnuuH8O1bFNiW8fjwBX_W"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-12 max-w-[1280px] mx-auto w-full">
          {/* Header Section */}
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <h2 className="font-['Libre_Caslon_Text'] text-4xl text-[#1e1b19]">
                  Buenos días, Alejandro
                </h2>
                <p className="font-['Hanken_Grotesk'] text-lg text-[#434653]">
                  {empresa.razonSocial}
                </p>
              </div>
              <div className="flex items-center text-[#434653] font-['Hanken_Grotesk'] text-xs font-semibold bg-white border border-[#c3c6d5] px-4 py-2 rounded-lg shrink-0 w-max">
                <RefreshCcw className="w-4 h-4 mr-1" />
                Last sync: Today, 8:30 AM
              </div>
            </div>
          </section>

          {/* KPI Strip */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Readiness Card */}
            <div className="bg-[#00327d] text-white p-6 rounded-xl flex flex-col justify-between col-span-full lg:col-span-1 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold uppercase opacity-90">
                  Business Readiness
                </p>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <h3 className="font-['Libre_Caslon_Text'] text-4xl">87/100</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] font-['Hanken_Grotesk'] bg-white/20 px-1 py-0.5 rounded">SUNAT Activo</span>
                  <span className="text-[10px] font-['Hanken_Grotesk'] bg-white/20 px-1 py-0.5 rounded">RNP Activo</span>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[10px] font-['Hanken_Grotesk'] flex items-center opacity-80">
                    <AlertTriangle className="w-3 h-3 mr-1" /> 
                    Falta Declaración
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Card 1 */}
            <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase">
                  Oportunidades Compatibles
                </p>
                <h3 className="font-['Libre_Caslon_Text'] text-4xl text-[#00327d] mt-2">
                  {oportunidades.length}
                </h3>
              </div>
              <div className="mt-4 flex items-center text-emerald-600 font-['Hanken_Grotesk'] text-xs font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2 desde ayer
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm">
              <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase">
                Ingresos Potenciales
              </p>
              <h3 className="font-['Libre_Caslon_Text'] text-4xl text-[#00327d] mt-2">S/ 15.4M</h3>
              <div className="mt-4 h-1 bg-[#faf2ee] w-full rounded-full overflow-hidden">
                <div className="bg-[#00327d] h-full w-2/3"></div>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm">
              <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase">
                Próximos Cierres
              </p>
              <h3 className="font-['Libre_Caslon_Text'] text-4xl text-[#00327d] mt-2">4</h3>
              <p className="text-sm font-['Hanken_Grotesk'] text-[#434653] mt-4">Vencimiento esta semana</p>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="mb-12 bg-white border border-[#c3c6d5] p-2 rounded-lg flex items-center space-x-4 overflow-x-auto shadow-sm">
            <Filter className="w-5 h-5 text-[#434653] ml-2" />
            <div className="flex space-x-2">
              <button className="px-4 py-1 rounded-full border border-[#c3c6d5] font-['Hanken_Grotesk'] text-xs font-semibold flex items-center hover:bg-[#eee7e3] transition-colors">
                Sector <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <button className="px-4 py-1 rounded-full border border-[#c3c6d5] font-['Hanken_Grotesk'] text-xs font-semibold flex items-center hover:bg-[#eee7e3] transition-colors">
                Monto <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="ml-auto pr-2 shrink-0">
              <button className="text-[#00327d] font-['Hanken_Grotesk'] text-xs font-semibold hover:underline">
                Limpiar filtros
              </button>
            </div>
          </section>

          {/* Main Content Area: Recomendaciones */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Libre_Caslon_Text'] text-2xl text-[#1e1b19]">
                Recomendaciones Prioritarias
              </h3>
              <span className="text-sm font-['Hanken_Grotesk'] text-[#434653] hidden sm:block">
                Ordenado por Índice de Readiness
              </span>
            </div>
            <div className="space-y-6">
              {oportunidades.map((o, idx) => (
                <OportunidadCard key={o.licitacion.id} oportunidad={o} index={idx} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
