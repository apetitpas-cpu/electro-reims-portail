import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRightLeft, History, Cpu, AlertTriangle, CheckCircle2, Search, BarChart3, Layers, Box, ShieldCheck, ShieldAlert, Zap, Calculator, Activity, Hash } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const CpuSelector = () => {
  // --- GESTION DES ONGLETS ---
  const [activeTab, setActiveTab] = useState('retrofit'); // 'retrofit' ou 'new'

  // --- STATE RETROFIT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOldCpu, setSelectedOldCpu] = useState(null);
  const [retroFormat, setTargetFormat] = useState('rack');
  const [isSafety, setIsSafety] = useState(false);

  // --- STATE NOUVEAU PROJET ---
  const [newProject, setNewProject] = useState({
    format: 'rack',       // rack, et200sp
    safety: 'no',         // no, yes
    motionType: 'basic',  // basic (Speed/Pos), advanced (Sync/Cam - T-CPU)
    axisCount: 0,         // Nombre d'axes
    ioCount: 64,          // Nombre d'E/S TOR
    anaCount: 4           // Nombre d'E/S Analog
  });

  // --- BASE DE DONNÉES (S7-300 / S7-400) ---
  const LEGACY_CPUS = [
    { ref: "312-1AE14", name: "CPU 312", family: "S7-300", mem: 32, iface: ["MPI"], safety: false },
    { ref: "314-1AG14", name: "CPU 314", family: "S7-300", mem: 128, iface: ["MPI"], safety: false },
    { ref: "314-6EH04", name: "CPU 314C-2 PN/DP", family: "S7-300", mem: 192, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "315-2AH14", name: "CPU 315-2 DP", family: "S7-300", mem: 256, iface: ["MPI/DP", "DP"], safety: false },
    { ref: "315-2EH14", name: "CPU 315-2 PN/DP", family: "S7-300", mem: 384, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "317-2EK14", name: "CPU 317-2 PN/DP", family: "S7-300", mem: 1024, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "319-3EL01", name: "CPU 319-3 PN/DP", family: "S7-300", mem: 2048, iface: ["MPI/DP", "DP", "PN"], safety: false },
    { ref: "315-6FF04", name: "CPU 315F-2 DP", family: "S7-300F", mem: 384, iface: ["MPI/DP", "DP"], safety: true },
    { ref: "315-2FJ14", name: "CPU 315F-2 PN/DP", family: "S7-300F", mem: 512, iface: ["MPI/DP", "PN"], safety: true },
    { ref: "317-6FF04", name: "CPU 317F-2 DP", family: "S7-300F", mem: 1536, iface: ["MPI/DP", "DP"], safety: true },
    { ref: "317-2FK14", name: "CPU 317F-2 PN/DP", family: "S7-300F", mem: 1536, iface: ["MPI/DP", "PN"], safety: true },
    { ref: "319-3FL01", name: "CPU 319F-3 PN/DP", family: "S7-300F", mem: 2560, iface: ["MPI/DP", "DP", "PN"], safety: true },
    { ref: "412-2EK06", name: "CPU 412-2 PN", family: "S7-400", mem: 1000, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "414-3EM06", name: "CPU 414-3 PN/DP", family: "S7-400", mem: 4000, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "416-3ES06", name: "CPU 416-3 PN/DP", family: "S7-400", mem: 16000, iface: ["MPI/DP", "PN"], safety: false },
    { ref: "417-4XT05", name: "CPU 417-4", family: "S7-400", mem: 30000, iface: ["MPI/DP", "DP", "DP"], safety: false },
    { ref: "414-3FM07", name: "CPU 414F-3 PN/DP", family: "S7-400F", mem: 4000, iface: ["MPI/DP", "PN", "IF"], safety: true },
    { ref: "416-2FP07", name: "CPU 416F-2", family: "S7-400F", mem: 8000, iface: ["MPI/DP", "DP"], safety: true },
    { ref: "416-3FS07", name: "CPU 416F-3 PN/DP", family: "S7-400F", mem: 16000, iface: ["MPI/DP", "PN", "IF"], safety: true },
  ];

  // --- GAMME ACTUELLE (S7-1500 Gen 3 & ET 200SP) ---
  const MODERN_CPUS = [
    // RACK STANDARD
    { format: 'rack', safety: false, tech: false, scale: 'small', ref: "6ES7511-1AL03-0AB0", name: "CPU 1511-1 PN", memCode: 150, memData: 1000 },
    { format: 'rack', safety: false, tech: false, scale: 'medium', ref: "6ES7513-1AL03-0AB0", name: "CPU 1513-1 PN", memCode: 300, memData: 1500 },
    { format: 'rack', safety: false, tech: false, scale: 'medium', ref: "6ES7515-2BN03-0AB0", name: "CPU 1515-2 PN", memCode: 500, memData: 3000 },
    { format: 'rack', safety: false, tech: false, scale: 'large', ref: "6ES7516-3AP03-0AB0", name: "CPU 1516-3 PN/DP", memCode: 1000, memData: 5000, hasDP: true },
    { format: 'rack', safety: false, tech: false, scale: 'large', ref: "6ES7517-3BP00-0AB0", name: "CPU 1517-3 PN/DP", memCode: 2000, memData: 8000, hasDP: true },
    { format: 'rack', safety: false, tech: false, scale: 'extra', ref: "6ES7518-4BP00-0AB0", name: "CPU 1518-4 PN/DP", memCode: 6000, memData: 60000, hasDP: true },
    
    // RACK SAFETY
    { format: 'rack', safety: true, tech: false, scale: 'small', ref: "6ES7511-1FL03-0AB0", name: "CPU 1511F-1 PN", memCode: 225, memData: 1000 },
    { format: 'rack', safety: true, tech: false, scale: 'medium', ref: "6ES7513-1FL03-0AB0", name: "CPU 1513F-1 PN", memCode: 450, memData: 1500 },
    { format: 'rack', safety: true, tech: false, scale: 'medium', ref: "6ES7515-2FN03-0AB0", name: "CPU 1515F-2 PN", memCode: 750, memData: 3000 },
    { format: 'rack', safety: true, tech: false, scale: 'large', ref: "6ES7516-3FP03-0AB0", name: "CPU 1516F-3 PN/DP", memCode: 1500, memData: 5000, hasDP: true },
    { format: 'rack', safety: true, tech: false, scale: 'large', ref: "6ES7517-3FP00-0AB0", name: "CPU 1517F-3 PN/DP", memCode: 3000, memData: 8000, hasDP: true },
    { format: 'rack', safety: true, tech: false, scale: 'extra', ref: "6ES7518-4FP00-0AB0", name: "CPU 1518F-4 PN/DP", memCode: 9000, memData: 60000, hasDP: true },

    // RACK TECHNOLOGY (T-CPU)
    { format: 'rack', safety: false, tech: true, scale: 'small', ref: "6ES7511-1TK03-0AB0", name: "CPU 1511T-1 PN", memCode: 225, memData: 1000 },
    { format: 'rack', safety: false, tech: true, scale: 'medium', ref: "6ES7515-2TN03-0AB0", name: "CPU 1515T-2 PN", memCode: 750, memData: 3000 },
    { format: 'rack', safety: false, tech: true, scale: 'large', ref: "6ES7517-3TP00-0AB0", name: "CPU 1517T-3 PN/DP", memCode: 3000, memData: 8000, hasDP: true },

    // RACK TECH + SAFETY (TF-CPU)
    { format: 'rack', safety: true, tech: true, scale: 'small', ref: "6ES7511-1UK03-0AB0", name: "CPU 1511TF-1 PN", memCode: 225, memData: 1000 },
    { format: 'rack', safety: true, tech: true, scale: 'medium', ref: "6ES7515-2UN03-0AB0", name: "CPU 1515TF-2 PN", memCode: 750, memData: 3000 },
    { format: 'rack', safety: true, tech: true, scale: 'large', ref: "6ES7517-3UP00-0AB0", name: "CPU 1517TF-3 PN/DP", memCode: 3000, memData: 8000, hasDP: true },

    // ET 200SP STANDARD
    { format: 'et200sp', safety: false, tech: false, scale: 'small', ref: "6ES7510-1DK03-0AB0", name: "CPU 1510SP-1 PN", memCode: 200, memData: 1000 },
    { format: 'et200sp', safety: false, tech: false, scale: 'medium', ref: "6ES7512-1DM03-0AB0", name: "CPU 1512SP-1 PN", memCode: 400, memData: 2000 },
    { format: 'et200sp', safety: false, tech: false, scale: 'large', ref: "6ES7514-2DN03-0AB0", name: "CPU 1514SP-2 PN", memCode: 600, memData: 3500 },
    
    // ET 200SP SAFETY
    { format: 'et200sp', safety: true, tech: false, scale: 'small', ref: "6ES7510-1SK03-0AB0", name: "CPU 1510SP F-1 PN", memCode: 300, memData: 1000 },
    { format: 'et200sp', safety: true, tech: false, scale: 'medium', ref: "6ES7512-1SM03-0AB0", name: "CPU 1512SP F-1 PN", memCode: 600, memData: 2000 },
    { format: 'et200sp', safety: true, tech: false, scale: 'large', ref: "6ES7514-2SN03-0AB0", name: "CPU 1514SP F-2 PN", memCode: 900, memData: 3500 },

    // ET 200SP TECH
    { format: 'et200sp', safety: false, tech: true, scale: 'large', ref: "6ES7514-2TN03-0AB0", name: "CPU 1514SP T-2 PN", memCode: 900, memData: 3500 },
    { format: 'et200sp', safety: true, tech: true, scale: 'large', ref: "6ES7514-2WN03-0AB0", name: "CPU 1514SP TF-2 PN", memCode: 900, memData: 3500 },
  ];

  // --- LOGIQUE RETROFIT ---
  useEffect(() => {
    if (selectedOldCpu?.safety) setIsSafety(true);
  }, [selectedOldCpu]);

  const retrofitRecommendation = useMemo(() => {
    if (!selectedOldCpu) return null;
    const available = MODERN_CPUS.filter(c => c.format === retroFormat && c.safety === isSafety && c.tech === false);
    let rec = available.find(n => n.memCode >= (selectedOldCpu.mem * 0.6));
    if (!rec) rec = available[available.length - 1];
    
    const warnings = [];
    if (selectedOldCpu.iface.some(i => i.includes("DP")) && !rec?.hasDP) {
        if(retroFormat === 'et200sp') warnings.push("Ajoutez un CM DP (6ES7545-5DA00-0AB0).");
        else warnings.push("Ajoutez un CM 1542-5 (6GK7542-5DX00-0XE0).");
    }
    if (retroFormat === 'et200sp' && selectedOldCpu.mem > 1500) warnings.push("Attention : S7-300/400 puissant vers ET 200SP.");
    if (selectedOldCpu.safety && !isSafety) warnings.push("CRITIQUE : Perte de la sécurité (F-CPU vers Standard).");

    return { ...rec, warnings };
  }, [selectedOldCpu, retroFormat, isSafety]);

  const filteredCpus = searchTerm 
    ? LEGACY_CPUS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.ref.includes(searchTerm))
    : [];

  // --- LOGIQUE NOUVEAU PROJET (ALGORITHME) ---
  const newProjectRecommendation = useMemo(() => {
    const { format, safety, motionType, axisCount, ioCount, anaCount } = newProject;
    
    // 1. Calcul du Scale requis
    let calculatedScale = 'small';
    
    // Règles E/S et Axes
    if (ioCount > 1000 || anaCount > 250 || axisCount > 40) calculatedScale = 'extra';
    else if (ioCount > 300 || anaCount > 60 || axisCount > 20) calculatedScale = 'large';
    else if (ioCount > 100 || anaCount > 16 || axisCount > 6) calculatedScale = 'medium';
    else calculatedScale = 'small';

    // 2. Filtrage
    const isSafetyBool = safety === 'yes';
    const isTechBool = motionType === 'advanced'; // T-CPU obligatoire si Advanced (Cames/Sync)

    let candidates = MODERN_CPUS.filter(c => c.format === format && c.safety === isSafetyBool && c.tech === isTechBool);
    
    // Fallback ET200SP : Tech n'existe qu'en 'large' (1514SP)
    if (isTechBool && candidates.length === 0 && format === 'et200sp') {
        candidates = MODERN_CPUS.filter(c => c.format === format && c.safety === isSafetyBool && c.tech === true);
    }

    // Trouver le candidat correspondant au scale calculé
    // Si on veut 'small' mais qu'on a que 'medium' dispo, on prend 'medium'.
    const scales = ['small', 'medium', 'large', 'extra'];
    let rec = null;
    
    // On cherche à partir du scale calculé, en montant
    for (let i = scales.indexOf(calculatedScale); i < scales.length; i++) {
        rec = candidates.find(c => c.scale === scales[i]);
        if (rec) break;
    }
    
    // Si toujours rien (ex: scale demandé 'extra' mais format 'et200sp'), on prend le plus gros dispo
    if (!rec && candidates.length > 0) rec = candidates[candidates.length - 1];

    // Warnings spécifiques nouveau projet
    const warnings = [];
    if (format === 'et200sp' && calculatedScale === 'extra') {
        warnings.push("Attention : Vos besoins (E/S ou Axes) dépassent les capacités recommandées pour l'ET 200SP. Envisagez le Rack S7-1500.");
    }

    return { ...rec, warnings };
  }, [newProject]);


  return (
    <PageContainer>
      <BrandHeader 
        title="Sélecteur CPU Siemens" 
        subtitle="Assistant S7-1500 & ET 200SP"
        icon={Cpu}
      />

      {/* --- MENU NAVIGATION (TABS) --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl inline-flex border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
                onClick={() => setActiveTab('retrofit')} 
                className={`px-6 py-2 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'retrofit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
                <History size={16} /> Mode Retrofit
            </button>
            <button 
                onClick={() => setActiveTab('new')} 
                className={`px-6 py-2 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'new' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
                <Calculator size={16} /> Guide de Choix
            </button>
        </div>
      </div>

      {/* ================= SECTION 1 : RETROFIT ================= */}
      {activeTab === 'retrofit' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* GAUCHE : RECHERCHE */}
                <div className="lg:col-span-4 space-y-6">
                    <SectionCard title="1. Matériel Existant (Ancien)">
                        <div className="relative mb-6">
                            <FormInput 
                                label="Rechercher une CPU (Ref ou Nom)" 
                                placeholder="Ex: 315F ou 414..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                suffix={<Search size={16}/>}
                            />
                            {searchTerm && filteredCpus.length > 0 && (
                                <div className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                                    {filteredCpus.map(cpu => (
                                        <button key={cpu.ref} onClick={() => { setSelectedOldCpu(cpu); setSearchTerm(""); }} className="w-full text-left p-3 hover:bg-indigo-50 dark:hover:bg-slate-700 text-sm border-b border-slate-100 dark:border-slate-700 flex justify-between">
                                            <span>{cpu.name}</span>
                                            {cpu.safety && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">F</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedOldCpu && (
                            <div className={`p-4 rounded-xl border-2 ${selectedOldCpu.safety ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-100 border-slate-300'}`}>
                                <div className="font-bold text-slate-800 dark:text-slate-900">{selectedOldCpu.name}</div>
                                <div className="text-xs text-slate-500 font-mono">{selectedOldCpu.ref}</div>
                                <div className="text-sm mt-2 font-mono text-slate-600">{selectedOldCpu.mem} Ko (Work)</div>
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* DROITE : RESULTAT */}
                <div className="lg:col-span-8">
                    <SectionCard title="2. Équivalence Recommandée" className="h-full flex flex-col">
                        <div className="flex gap-4 mb-6">
                            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex border border-slate-200 dark:border-slate-700">
                                <button onClick={() => setTargetFormat('rack')} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold transition-all ${retroFormat === 'rack' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}><Layers size={16}/> Rack 1500</button>
                                <button onClick={() => setTargetFormat('et200sp')} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold transition-all ${retroFormat === 'et200sp' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}><Box size={16}/> ET 200SP</button>
                            </div>
                            <button onClick={() => setIsSafety(!isSafety)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${isSafety ? 'bg-yellow-50 border-yellow-400 text-yellow-700 shadow-sm' : 'bg-transparent border-slate-200 text-slate-400'}`}>
                                {isSafety ? <ShieldCheck size={18} className="text-yellow-600" /> : <ShieldAlert size={18} />} {isSafety ? "Safety (F-CPU)" : "Standard"}
                            </button>
                        </div>

                        {retrofitRecommendation ? (
                            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4">
                                <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border ${isSafety ? 'bg-yellow-50 border-yellow-200' : 'bg-indigo-50 border-indigo-200'}`}>
                                    <div className={`p-3 rounded-full text-white shadow-sm ${isSafety ? 'bg-yellow-500' : 'bg-indigo-600'}`}>
                                        {isSafety ? <ShieldCheck size={32} /> : <CheckCircle2 size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{retrofitRecommendation.name}</h3>
                                        <div className="font-mono text-sm opacity-70 mt-1 select-all">{retrofitRecommendation.ref}</div>
                                    </div>
                                </div>
                                
                                <div className="mb-8">
                                    <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-4"><BarChart3 size={18}/> Comparaison Mémoire</h4>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1"><span className="font-bold text-slate-500">{selectedOldCpu.name}</span><span>{selectedOldCpu.mem} Ko</span></div>
                                        <div className="w-full bg-slate-200 rounded-full h-3"><div className="bg-slate-500 h-full" style={{width: '100%'}}></div></div>
                                    </div>
                                    <div className="flex justify-center -my-3 relative z-10"><div className="bg-white p-1 rounded-full border border-slate-200"><ArrowRightLeft size={14} className="text-slate-400 rotate-90"/></div></div>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1"><span className="font-bold text-indigo-600">{retrofitRecommendation.name}</span><span>{retrofitRecommendation.memCode} Ko (Code)</span></div>
                                        <div className="w-full bg-slate-200 rounded-full h-4 flex overflow-hidden">
                                            <div className={`${isSafety ? 'bg-yellow-500' : 'bg-indigo-600'} h-full flex items-center justify-center text-[9px] text-white`} style={{width: `${Math.min(100, (retrofitRecommendation.memCode / selectedOldCpu.mem)*100)}%`, minWidth:'40px'}}>Code</div>
                                            <div className={`${isSafety ? 'bg-yellow-200' : 'bg-indigo-300'} h-full flex items-center justify-center text-[9px]`} style={{width: '30%'}}>Data++</div>
                                        </div>
                                    </div>
                                </div>

                                {retrofitRecommendation.warnings.length > 0 && (
                                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded"><ul className="list-disc list-inside text-xs text-orange-800">{retrofitRecommendation.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></div>
                                )}
                            </div>
                        ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-300"><ArrowRightLeft size={64} className="mb-4 opacity-20"/><p>En attente d'une sélection à gauche...</p></div>}
                    </SectionCard>
                </div>
            </div>
        </div>
      )}

      {/* ================= SECTION 2 : GUIDE CHOIX (Nouveau) ================= */}
      {activeTab === 'new' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* GAUCHE : CRITÈRES */}
                <div className="lg:col-span-4 space-y-6">
                    <SectionCard title="1. Critères du Projet">
                        {/* Format & Safety */}
                        <div className="mb-4">
                            <FormSelect label="Format" value={newProject.format} onChange={(e) => setNewProject({...newProject, format: e.target.value})} options={[{value:'rack', label:'S7-1500 (Rack)'}, {value:'et200sp', label:'ET 200SP (Compact)'}]} />
                            <FormSelect label="Sécurité (Safety)" value={newProject.safety} onChange={(e) => setNewProject({...newProject, safety: e.target.value})} options={[{value:'no', label:'Standard'}, {value:'yes', label:'F-CPU (Safety)'}]} />
                        </div>

                        {/* Motion */}
                        <div className="mb-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase"><Activity size={14}/> Motion Control</div>
                            <div className="grid grid-cols-2 gap-2">
                                <FormSelect label="Type" value={newProject.motionType} onChange={(e) => setNewProject({...newProject, motionType: e.target.value})} options={[{value:'basic', label:'Basic'}, {value:'advanced', label:'Advanced (T)'}]} />
                                <FormInput label="Nb Axes" type="number" value={newProject.axisCount} onChange={(e) => setNewProject({...newProject, axisCount: Number(e.target.value)})} />
                            </div>
                        </div>

                        {/* E/S */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase"><Hash size={14}/> Volumétrie E/S</div>
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput label="E/S TOR" type="number" value={newProject.ioCount} onChange={(e) => setNewProject({...newProject, ioCount: Number(e.target.value)})} />
                                <FormInput label="E/S Ana" type="number" value={newProject.anaCount} onChange={(e) => setNewProject({...newProject, anaCount: Number(e.target.value)})} />
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* DROITE : RESULTAT */}
                <div className="lg:col-span-8">
                    <SectionCard title="2. CPU Recommandée" className="h-full flex flex-col justify-center">
                        {newProjectRecommendation.name ? (
                            <div className="relative overflow-hidden p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{newProjectRecommendation.name}</h3>
                                        <div className="text-lg font-mono text-emerald-700 dark:text-emerald-300 mt-1 select-all">{newProjectRecommendation.ref}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {newProjectRecommendation.safety && <ShieldCheck size={32} className="text-yellow-600 bg-yellow-100 p-1 rounded"/>}
                                        {newProjectRecommendation.tech && <Zap size={32} className="text-blue-600 bg-blue-100 p-1 rounded"/>}
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/60 p-3 rounded"><div className="font-bold text-slate-500 uppercase text-[10px]">Mémoire Code</div><div className="font-mono font-bold text-slate-800">{newProjectRecommendation.memCode} Ko</div></div>
                                    <div className="bg-white/60 p-3 rounded"><div className="font-bold text-slate-500 uppercase text-[10px]">Mémoire Data</div><div className="font-mono font-bold text-slate-800">{newProjectRecommendation.memData / 1000} Mo</div></div>
                                </div>
                                
                                {newProjectRecommendation.warnings && newProjectRecommendation.warnings.length > 0 && (
                                    <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-2 rounded border border-orange-200">
                                        {newProjectRecommendation.warnings.map((w,i)=><div key={i}>⚠️ {w}</div>)}
                                    </div>
                                )}
                            </div>
                        ) : <div className="text-center text-slate-400">Aucune CPU correspondante.</div>}
                    </SectionCard>
                </div>
            </div>
        </div>
      )}

    </PageContainer>
  );
};

export default CpuSelector;