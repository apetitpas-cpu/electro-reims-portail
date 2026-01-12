import React, { useState } from 'react';
import { Network, Server, Search, Wifi, Shield, ArrowRightLeft } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const IpPlanAgence = () => {
  const [activeTab, setActiveTab] = useState('agence');
  const [search, setSearch] = useState('');

  // --- DONNÉES (À compléter avec vos vraies IPs) ---
  const dataAgence = [
    { id: 1, device: "Routeur FAI", ip: "192.168.1.1", port: "WAN" },
    { id: 2, device: "Switch Cœur", ip: "192.168.1.2", port: "-" },
    { id: 3, device: "Imprimante Bureau", ip: "192.168.1.10", port: "P4" },
    { id: 4, device: "Borne Wifi Accueil", ip: "192.168.1.15", port: "P8" },
    { id: 5, device: "PC Atelier", ip: "192.168.1.20", port: "P12" },
  ];

  const dataGtc = [
    { id: 1, device: "Automate Chaufferie", ip: "10.0.0.10", mask: "255.255.255.0", gw: "10.0.0.1" },
    { id: 2, device: "Supervision (PC)", ip: "10.0.0.11", mask: "255.255.255.0", gw: "10.0.0.1" },
    { id: 3, device: "Centrale CTA", ip: "10.0.0.20", mask: "255.255.255.0", gw: "10.0.0.1" },
    { id: 4, device: "Passerelle Modbus", ip: "10.0.0.250", mask: "255.255.255.0", gw: "10.0.0.1" },
  ];

  // Filtrage
  const filterData = (data) => {
    return data.filter(item => 
      item.device.toLowerCase().includes(search.toLowerCase()) ||
      item.ip.includes(search)
    );
  };

  const currentData = activeTab === 'agence' ? filterData(dataAgence) : filterData(dataGtc);

  return (
    <PageContainer>
      <BrandHeader 
        title="Plan d'Adressage IP" 
        subtitle="Référentiel des IPs Agence et équipements GTC"
        icon={Network}
        enablePrint={true}
      />

      {/* --- BARRE D'OUTILS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Onglets */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('agence')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'agence' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Wifi size={18} /> IP Agence
            </button>
            <button 
                onClick={() => setActiveTab('gtc')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'gtc' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Server size={18} /> IP GTC
            </button>
        </div>

        {/* Recherche */}
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher une IP, un appareil..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
        </div>
      </div>

      {/* --- TABLEAU --- */}
      <SectionCard title={activeTab === 'agence' ? "Réseau Bureautique / Agence" : "Réseau Technique GTC"}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-3">Appareil</th>
                        <th className="px-6 py-3 font-bold text-indigo-600 dark:text-indigo-400">Adresse IP</th>
                        {activeTab === 'agence' ? (
                            <th className="px-6 py-3">Port Switch</th>
                        ) : (
                            <>
                                <th className="px-6 py-3">Masque</th>
                                <th className="px-6 py-3">Gateway</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {currentData.length > 0 ? (
                        currentData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-800 dark:text-white">
                                    {row.device}
                                </td>
                                <td className="px-6 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                    {row.ip}
                                </td>
                                {activeTab === 'agence' ? (
                                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">
                                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold">
                                            {row.port}
                                        </span>
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-6 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                            {row.mask}
                                        </td>
                                        <td className="px-6 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                            {row.gw}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">
                                Aucun résultat trouvé pour "{search}"
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </SectionCard>

    </PageContainer>
  );
};

export default IpPlanAgence;