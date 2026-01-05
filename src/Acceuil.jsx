import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  Zap, Network, Cpu, ShieldCheck, Database, Search, Activity,
  Terminal, Calculator, FileText, Lock, FileSpreadsheet, Star, ArrowRight, Binary,
  Thermometer
} from "lucide-react";
import { PageContainer, BrandHeader, SectionCard, SectionTitle, ToolsGrid, ToolCard } from "./components/UI";

const Acceuil = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // --- DONNÉES DE RECHERCHE ---
  const allResources = [
    { title: "Calculateur Profinet", category: "Siemens", type: "Outil", link: "/siemens/profinet", icon: Calculator },
    { title: "Sélecteur CPU S7-1500", category: "Siemens", type: "Outil", link: "/siemens/selector", icon: Cpu },
    { title: "Mise à jour Firmware", category: "Siemens", type: "Procédure", link: "/siemens/firmware-update", icon: FileText },
    { title: "Générateur CLI HiOS", category: "Belden", type: "Outil", link: "/belden/cli", icon: Terminal },
    { title: "Topologie MRP", category: "Belden", type: "Outil", link: "/belden/topology", icon: Network },
    { title: "Config MacSec", category: "Belden", type: "Procédure", link: "/belden/macsec", icon: Lock },
    { title: "Simulateur NAT", category: "Etic", type: "Outil", link: "/etic/nat", icon: Network },
    { title: "Générateur VPN", category: "Etic", type: "Outil", link: "/etic/vpn", icon: Lock },
    { title: "Mise en service RAS", category: "Etic", type: "Procédure", link: "/etic/commissioning", icon: FileText },
    { title: "Générateur Règles", category: "Stormshield", type: "Outil", link: "/stormshield/rules", icon: FileSpreadsheet },
    { title: "Audit Hardening", category: "Stormshield", type: "Outil", link: "/stormshield/hardening", icon: ShieldCheck },
    { title: "Calculateur Marge", category: "Gesco", type: "Outil", link: "/gesco/margin", icon: Calculator },
    { title: "Générateur Offre", category: "Gesco", type: "Outil", link: "/gesco/offre", icon: Database },
    { title: "Convertisseur Data", category: "Outils", type: "Outil", link: "/toolbox/converter", icon: Binary },
    { title: "Calculateur IP", category: "Outils", type: "Outil", link: "/toolbox/ip", icon: Network },
    { title: "Chute de Tension", category: "Outils", type: "Outil", link: "/toolbox/elec", icon: Zap },
    { title: "Mise à l'échelle", category: "Outils", type: "Outil", link: "/toolbox/scaling", icon: Activity },
    { title: "Calculateur Puissance", category: "Outils", type: "Outil", link: "/toolbox/power", icon: Zap },
    { title: "Sonde PT100", category: "Outils", type: "Outil", link: "/toolbox/pt100", icon: Thermometer },
  ];

  const filteredResources = allResources.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- COMPOSANT "GRANDE CARTE" ---
  const LargeCard = ({ to, title, subtitle, icon: Icon, fromColor, toColor, textColor }) => (
    <Link to={to} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${fromColor} ${toColor} p-6 text-white shadow-lg transition-transform hover:-translate-y-1`}>
        <div className="relative z-10">
            <div className="mb-4 inline-block rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                <Icon size={28} />
            </div>
            <h3 className="mb-1 text-2xl font-bold">{title}</h3>
            <p className={`${textColor} text-sm font-medium`}>{subtitle}</p>
        </div>
        <Icon className="absolute -bottom-6 -right-6 h-40 w-40 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
    </Link>
  );

  return (
    <PageContainer>
      
      {/* 1. EN-TÊTE + RECHERCHE */}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <BrandHeader 
            title="Portail Technique" 
            subtitle="Outils d'ingénierie, procédures et simulateurs Electro-Reims."
            icon={Zap}
        />
        
        {/* BARRE DE RECHERCHE */}
        <div className="max-w-2xl mx-auto -mt-4 relative z-20">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm font-medium"
                    placeholder="Rechercher un outil, une procédure..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* RÉSULTATS DE RECHERCHE */}
            {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 text-left">
                    {filteredResources.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredResources.map((res, idx) => (
                                <Link key={idx} to={res.link} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <div className={`p-2 rounded-lg ${res.type === 'Outil' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <res.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{res.title}</h4>
                                        <p className="text-xs text-slate-500">{res.category} • {res.type}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-500 text-sm">Aucun résultat.</div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      {!searchQuery && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* 2. ACCÈS RAPIDE */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> Accès Rapide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/siemens/profinet" className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Calculator size={20} /></div>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">SIEMENS</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">Calculateur PN</div>
                        <p className="text-xs text-slate-500">Charge réseau</p>
                    </Link>
                    <Link to="/belden/cli" className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors"><Terminal size={20} /></div>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">BELDEN</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">Générateur CLI</div>
                        <p className="text-xs text-slate-500">Script HiOS</p>
                    </Link>
                    <Link to="/etic/vpn" className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Lock size={20} /></div>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">ETIC</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">Générateur VPN</div>
                        <p className="text-xs text-slate-500">Config IPSec</p>
                    </Link>
                    <Link to="/gesco/margin" className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Calculator size={20} /></div>
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">GESCO</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">Marge & Prix</div>
                        <p className="text-xs text-slate-500">Simulateur</p>
                    </Link>
                </div>
            </div>

            {/* 3. NOS UNIVERS TECHNOLOGIQUES (Grandes Cartes) */}
            <div>
                <SectionTitle title="Nos Univers Technologiques" badge="Catalogue" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    
                    <LargeCard 
                        to="/siemens"
                        title="Siemens"
                        subtitle="Automatisme & Réseaux"
                        icon={Cpu}
                        fromColor="from-teal-500"
                        toColor="to-teal-700"
                        textColor="text-teal-100"
                    />

                    <LargeCard 
                        to="/belden"
                        title="Belden"
                        subtitle="Switching & Cybersécurité"
                        icon={Network}
                        fromColor="from-orange-500"
                        toColor="to-orange-700"
                        textColor="text-orange-100"
                    />

                    <LargeCard 
                        to="/etic"
                        title="Etic Telecom"
                        subtitle="Interconnexion M2M"
                        icon={Network}
                        fromColor="from-emerald-500"
                        toColor="to-emerald-700"
                        textColor="text-emerald-100"
                    />

                    <LargeCard 
                        to="/stormshield"
                        title="Stormshield"
                        subtitle="Sécurité & Firewalls"
                        icon={ShieldCheck}
                        fromColor="from-blue-500"
                        toColor="to-blue-700"
                        textColor="text-blue-100"
                    />

                </div>
            </div>

            {/* SECTION BOITE A OUTILS */}
            <div>
                <SectionTitle title="Utilitaires Techniques" badge="Atelier" />
                <ToolsGrid>
                    <ToolCard to="/toolbox/converter" title="Convertisseur" description="Hex / Bin / Float" icon={Binary} color="slate" />
                    <ToolCard to="/toolbox/ip" title="Calculateur IP" description="Sous-réseaux CIDR" icon={Network} color="slate" />
                    <ToolCard to="/toolbox/elec" title="Chute de Tension" description="Câblage 24V DC" icon={Zap} color="slate" />
                    <ToolCard to="/toolbox/scaling" title="Mise à l'échelle" description="Analogique 0-10V / 4-20mA" icon={Activity} color="slate" />
                    <ToolCard to="/toolbox/power" title="Puissance Elec" description="Triphasé / Loi d'Ohm" icon={Zap} color="slate" />
                    <ToolCard to="/toolbox/pt100" title="Sonde PT100" description="Table Température/Ohm" icon={Thermometer} color="slate" />
                </ToolsGrid>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>

            {/* 4. GESCO FULL WIDTH (ENCART DÉDIÉ) */}
            <SectionCard title="Outils Internes" className="bg-purple-50 dark:bg-slate-800/50 border-purple-100 dark:border-purple-900/30">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-purple-600 dark:text-purple-400">
                        <Database size={32} />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                            Suite GESCO
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            Accédez aux modules de gestion commerciale, au convertisseur de devis et au calculateur de marge unifié pour vos affaires quotidiennes.
                        </p>
                        <Link to="/gesco" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md">
                            Accéder à l'espace GESCO <ArrowRight size={16}/>
                        </Link>
                    </div>

                    <div className="flex gap-3">
                        <Link to="/gesco/offre" className="flex flex-col items-center justify-center w-24 h-24 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform group">
                            <FileSpreadsheet size={24} className="text-slate-400 mb-2 group-hover:text-purple-500 transition-colors" />
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Offres</span>
                        </Link>
                        <Link to="/gesco/margin" className="flex flex-col items-center justify-center w-24 h-24 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform group">
                            <Calculator size={24} className="text-slate-400 mb-2 group-hover:text-purple-500 transition-colors" />
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Marges</span>
                        </Link>
                    </div>

                </div>
            </SectionCard>

        </div>
      )}

    </PageContainer>
  );
}

export default Acceuil;