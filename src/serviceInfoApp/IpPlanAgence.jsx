import React, { useState, useEffect } from 'react';
import { Network, Server, Search, Wifi, Plus, Trash2, Save, X, Edit2, User, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const IpPlanAgence = () => {
  const [activeTab, setActiveTab] = useState('agence');
  const [search, setSearch] = useState('');
  
  // --- STATE DE TRI ---
  const [sortConfig, setSortConfig] = useState({ key: 'ip', direction: 'asc' });

  // --- STATE DES DONNÉES (Avec chargement LocalStorage) ---
  const [dataAgence, setDataAgence] = useState(() => {
    const saved = localStorage.getItem('ip_agence_data');
    return saved ? JSON.parse(saved) : [
        { id: 1, device: "Routeur FAI", ip: "192.168.1.1", port: "WAN", person: "DSI" },
        { id: 2, device: "Switch Cœur", ip: "192.168.1.2", port: "-", person: "DSI" },
        { id: 3, device: "Imprimante Bureau", ip: "192.168.1.10", port: "P4", person: "Compta" },
    ];
  });

  const [dataGtc, setDataGtc] = useState(() => {
    const saved = localStorage.getItem('ip_gtc_data');
    return saved ? JSON.parse(saved) : [
        { id: 1, device: "Automate Chaufferie", ip: "10.0.0.10", mask: "255.255.255.0", gw: "10.0.0.1" },
        { id: 2, device: "Supervision (PC)", ip: "10.0.0.11", mask: "255.255.255.0", gw: "10.0.0.1" },
    ];
  });

  // --- SAUVEGARDE AUTO ---
  useEffect(() => {
    localStorage.setItem('ip_agence_data', JSON.stringify(dataAgence));
  }, [dataAgence]);

  useEffect(() => {
    localStorage.setItem('ip_gtc_data', JSON.stringify(dataGtc));
  }, [dataGtc]);


  // --- ÉDITION ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const handleEdit = (item) => {
    setEditForm({ ...item });
    setIsEditing(true);
  };

  const handleAdd = () => {
    if (activeTab === 'agence') {
        setEditForm({ id: Date.now(), device: "", ip: "", port: "", person: "" });
    } else {
        setEditForm({ id: Date.now(), device: "", ip: "", mask: "255.255.255.0", gw: "" });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.device || !editForm.ip) return alert("Nom et IP obligatoires");

    if (activeTab === 'agence') {
        const exists = dataAgence.find(i => i.id === editForm.id);
        if (exists) {
            setDataAgence(dataAgence.map(i => i.id === editForm.id ? editForm : i));
        } else {
            setDataAgence([...dataAgence, editForm]);
        }
    } else {
        const exists = dataGtc.find(i => i.id === editForm.id);
        if (exists) {
            setDataGtc(dataGtc.map(i => i.id === editForm.id ? editForm : i));
        } else {
            setDataGtc([...dataGtc, editForm]);
        }
    }
    setIsEditing(false);
    setEditForm(null);
  };

  const handleDelete = (id) => {
    if(!window.confirm("Supprimer cette ligne ?")) return;
    if (activeTab === 'agence') {
        setDataAgence(dataAgence.filter(i => i.id !== id));
    } else {
        setDataGtc(dataGtc.filter(i => i.id !== id));
    }
  };


  // --- LOGIQUE DE TRI ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper pour comparer des IPs correctement (numériquement segment par segment)
  const compareIps = (ipA, ipB) => {
    const partsA = ipA.split('.').map(Number);
    const partsB = ipB.split('.').map(Number);
    
    for (let i = 0; i < 4; i++) {
        if (partsA[i] > partsB[i]) return 1;
        if (partsA[i] < partsB[i]) return -1;
    }
    return 0;
  };

  // --- FILTRAGE ET TRI ---
  const currentList = activeTab === 'agence' ? dataAgence : dataGtc;
  
  const processedData = React.useMemo(() => {
    // 1. Filtrage
    let data = currentList.filter(item => 
        item.device.toLowerCase().includes(search.toLowerCase()) ||
        item.ip.includes(search) ||
        (item.person && item.person.toLowerCase().includes(search.toLowerCase()))
    );

    // 2. Tri
    if (sortConfig.key) {
        data.sort((a, b) => {
            const valA = a[sortConfig.key] || "";
            const valB = b[sortConfig.key] || "";

            let comparison = 0;

            // Tri spécial pour les IPs
            if (sortConfig.key === 'ip' || sortConfig.key === 'gw') {
                comparison = compareIps(valA, valB);
            } else {
                // Tri standard alphabétique
                comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }

    return data;
  }, [currentList, search, sortConfig]);


  // Composant En-tête de colonne triable
  const SortableTh = ({ label, field, className="" }) => {
    const isActive = sortConfig.key === field;
    return (
        <th 
            className={`px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none ${className}`}
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                {label}
                <span className="text-slate-400">
                    {isActive ? (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>
                    ) : (
                        <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50"/>
                    )}
                </span>
            </div>
        </th>
    );
  };


  // --- RENDU MODAL ÉDITION ---
  const EditModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                {editForm.id && currentList.find(i => i.id === editForm.id) ? "Modifier" : "Ajouter"} un équipement
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom de l'appareil</label>
                    <input 
                        type="text" className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={editForm.device} onChange={e => setEditForm({...editForm, device: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adresse IP</label>
                    <input 
                        type="text" className="w-full p-2 border rounded font-mono dark:bg-slate-900 dark:border-slate-700 dark:text-indigo-400 text-indigo-600 font-bold"
                        value={editForm.ip} onChange={e => setEditForm({...editForm, ip: e.target.value})}
                    />
                </div>

                {activeTab === 'agence' ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Port Switch</label>
                            <input 
                                type="text" className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={editForm.port} onChange={e => setEditForm({...editForm, port: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Personne / Service</label>
                            <input 
                                type="text" className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={editForm.person} onChange={e => setEditForm({...editForm, person: e.target.value})}
                            />
                        </div>
                    </>
                ) : (
                    <>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Masque</label>
                            <input 
                                type="text" className="w-full p-2 border rounded font-mono dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={editForm.mask} onChange={e => setEditForm({...editForm, mask: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passerelle (Gateway)</label>
                            <input 
                                type="text" className="w-full p-2 border rounded font-mono dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={editForm.gw} onChange={e => setEditForm({...editForm, gw: e.target.value})}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-bold">Annuler</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Save size={16}/> Enregistrer
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <PageContainer>
      <BrandHeader 
        title="Plan d'Adressage IP" 
        subtitle="Référentiel dynamique des IPs Agence et GTC"
        icon={Network}
        enablePrint={true}
      />

      {/* --- BARRE D'OUTILS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 no-print">
        {/* Onglets */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button 
                onClick={() => { setActiveTab('agence'); setSearch(''); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'agence' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Wifi size={18} /> IP Agence
            </button>
            <button 
                onClick={() => { setActiveTab('gtc'); setSearch(''); }}
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
                placeholder="Rechercher une IP, un appareil, une personne..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
        </div>

        {/* Bouton Ajouter */}
        <button 
            onClick={handleAdd}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-colors"
        >
            <Plus size={18}/> Nouveau
        </button>
      </div>

      {/* --- TABLEAU --- */}
      <SectionCard title={activeTab === 'agence' ? "Réseau Bureautique / Agence" : "Réseau Technique GTC"}>
        <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <SortableTh label="Appareil" field="device" />
                        <SortableTh label="Adresse IP" field="ip" className="text-indigo-600 dark:text-indigo-400" />
                        {activeTab === 'agence' ? (
                            <>
                                <SortableTh label="Port Switch" field="port" />
                                <SortableTh label="Personne" field="person" className="text-center" />
                            </>
                        ) : (
                            <>
                                <SortableTh label="Masque" field="mask" />
                                <SortableTh label="Gateway" field="gw" />
                            </>
                        )}
                        <th className="px-6 py-3 text-right no-print w-20">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {processedData.length > 0 ? (
                        processedData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-3 font-medium text-slate-800 dark:text-white">
                                    {row.device}
                                </td>
                                <td className="px-6 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                    {row.ip}
                                </td>
                                {activeTab === 'agence' ? (
                                    <>
                                        <td className="px-6 py-3 text-slate-500 dark:text-slate-400">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {row.port || "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {row.person && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                                    <User size={12}/> {row.person}
                                                </span>
                                            )}
                                        </td>
                                    </>
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
                                
                                {/* ACTIONS */}
                                <td className="px-6 py-3 text-right no-print">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors" title="Modifier">
                                            <Edit2 size={16}/>
                                        </button>
                                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" title="Supprimer">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                                <Search size={32} className="mx-auto mb-2 opacity-20"/>
                                Aucun équipement trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </SectionCard>

      {/* MODAL */}
      {isEditing && editForm && <EditModal />}

    </PageContainer>
  );
};

export default IpPlanAgence;