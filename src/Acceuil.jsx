import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  Zap, Network, Cpu, ShieldCheck, Database, Search, Activity,
  Terminal, Calculator, FileText, Lock, FileSpreadsheet, Star, ArrowRight, Binary,
  Thermometer, ClipboardList, Gauge, Server, Plug, Wifi, Table
} from "lucide-react";
import { PageContainer, BrandHeader, SectionCard, SectionTitle, ToolsGrid, ToolCard } from "./components/UI";

const Acceuil = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // --- BASE DE DONNÉES DE RECHERCHE (Tous les outils du site) ---
  const allResources = [
    // SIEMENS
    { title: "Calculateur Profinet", category: "Siemens", type: "Outil", link: "/siemens/profinet", icon: Calculator },
    { title: "Sélecteur CPU", category: "Siemens", type: "Outil", link: "/siemens/selector", icon: Cpu },
    { title: "Backup Web Server", category: "Siemens", type: "Procédure", link: "/siemens/backup", icon: Cpu },
    // BELDEN
    { title: "Générateur CLI", category: "Belden", type: "Outil", link: "/belden/cli", icon: Terminal },
    { title: "Topologie Réseau", category: "Belden", type: "Info", link: "/belden/topology", icon: Network },
    { title: "Config VLAN HiOS", category: "Belden", type: "Procédure", link: "/belden/vlan", icon: Network },
    // ETIC
    { title: "Simulateur NAT", category: "Etic", type: "Outil", link: "/etic/nat", icon: Network },
    { title: "Générateur VPN", category: "Etic", type: "Outil", link: "/etic/vpn", icon: Lock },
    // STORMSHIELD
    { title: "Générateur Règles", category: "Stormshield", type: "Outil", link: "/stormshield/rules", icon: FileSpreadsheet },
    { title: "Checklist Durcissement", category: "Stormshield", type: "Audit", link: "/stormshield/hardening", icon: ShieldCheck },
    // INSTRUMENTATION
    { title: "Guide Choix Capteurs", category: "Instrumentation", type: "Guide", link: "/instrumentation/selection-guide", icon: ClipboardList },
    { title: "Convertisseur Unités", category: "Instrumentation", type: "Outil", link: "/instrumentation/converter", icon: ArrowRight },
    { title: "Test Boucle 4-20mA", category: "Instrumentation", type: "Procédure", link: "/instrumentation/loop-check", icon: Activity },
    // BOITE A OUTILS
    { title: "Convertisseur HEX/BIN", category: "Toolbox", type: "Utilitaire", link: "/toolbox/converter", icon: Binary },
    { title: "Calculateur IP / CIDR", category: "Toolbox", type: "Utilitaire", link: "/toolbox/ip", icon: Network },
    { title: "Chute de Tension 24V", category: "Toolbox", type: "Utilitaire", link: "/toolbox/elec", icon: Zap },
    { title: "Mise à l'échelle (Analog)", category: "Toolbox", type: "Utilitaire", link: "/toolbox/scaling", icon: Activity },
    { title: "Puissance Triphasé", category: "Toolbox", type: "Utilitaire", link: "/toolbox/power", icon: Zap },
    { title: "Table PT100", category: "Toolbox", type: "Utilitaire", link: "/toolbox/pt100", icon: Thermometer },
    { title: "Dimensionnement Alim", category: "Toolbox", type: "Utilitaire", link: "/toolbox/psu", icon: Plug },
    // INTERNE (GESCO & SERVICE INFO)
    { title: "Calculateur Marge", category: "Gesco", type: "Bureau", link: "/gesco/margin", icon: Calculator },
    { title: "Plan d'Adressage IP", category: "Service Info", type: "Admin", link: "/service-info/ip-plan", icon: Server },
  ];

  // Filtre dynamique
  const filteredResources = allResources.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- COMPOSANT CARTE UNIVERS ---
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
            logo="/logo.svg"
        />
        
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 text-left max-h-[400px] overflow-y-auto">
                    {filteredResources.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredResources.map((res, idx) => (
                                <Link key={idx} to={res.link} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <div className={`p-2 rounded-lg ${res.type === 'Outil' || res.type === 'Utilitaire' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
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
                        <div className="p-4 text-center text-slate-500 text-sm">Aucun résultat trouvé.</div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* CONTENU PRINCIPAL (Masqué si recherche active pour plus de clarté, optionnel) */}
      <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ${searchQuery ? 'opacity-50 blur-sm pointer-events-none' : ''}`}>
            
            {/* 3. NOS UNIVERS TECHNOLOGIQUES */}
            <div>
                <SectionTitle title="Nos Univers Technologiques" badge="Catalogue" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
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

                    <LargeCard 
                        to="/instrumentation" 
                        title="Instrumentation" 
                        subtitle="Mesure & Capteurs" 
                        icon={Gauge}
                        fromColor="from-indigo-500" 
                        toColor="to-indigo-700" 
                        textColor="text-indigo-100" 
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
                    <ToolCard to="/toolbox/psu" title="Dimensionnement Alim" description="Bilan 24VDC & Ampérage" icon={Plug} color="slate" />
                    <ToolCard to="/toolbox/pt100" title="Sonde PT100" description="Table Température/Ohm" icon={Thermometer} color="slate" />
                </ToolsGrid>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>

            {/* SECTION OUTILS INTERNES */}
            <div>
                <SectionTitle title="Outils Internes" badge="Entreprise" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* BLOC 1 : GESCO */}
                    <SectionCard className="bg-purple-50 dark:bg-slate-800/50 border-purple-100 dark:border-purple-900/30 h-full flex flex-col justify-center">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-purple-600 dark:text-purple-400">
                                <Database size={32} />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Suite GESCO</h4>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                    Modules de gestion commerciale, calculateur de marge et procédures administratives.
                                </p>
                                <Link to="/gesco" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm">
                                    Accéder à GESCO <ArrowRight size={16}/>
                                </Link>
                            </div>
                        </div>
                    </SectionCard>

                    {/* BLOC 2 : SERVICE INFO */}
                    <SectionCard className="bg-sky-50 dark:bg-slate-800/50 border-sky-100 dark:border-sky-900/30 h-full flex flex-col justify-center">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sky-600 dark:text-sky-400">
                                <Server size={32} />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Service Info</h4>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                    Documentation technique interne, plan d'adressage IP Agence et GTC.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <Link to="/service-info/ip-plan" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg font-bold text-sm hover:bg-sky-700 transition-colors shadow-sm">
                                        Plan IP <Network size={16}/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                </div>
            </div>

      </div>

    </PageContainer>
  );
}

export default Acceuil;