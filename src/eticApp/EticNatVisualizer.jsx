import React, { useState } from 'react';
import { ArrowRight, Server, Laptop, ShieldCheck, RefreshCw, Box, Settings, X, Plus, Trash2, Camera, Monitor, FileText } from 'lucide-react';
// Import de vos composants UI
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const EticNatVisualizer = () => {
  const [mode, setMode] = useState('SNAT'); 
  const [step, setStep] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  
  // --- Device Management State ---
  const [lanDevices, setLanDevices] = useState([
    { id: 1, name: "Automate (PLC)", ip: "192.168.2.1", type: "plc" }
  ]);
  const [wanDevices, setWanDevices] = useState([
    { id: 1, name: "PC Supervision", ip: "10.93.71.16", type: "pc" }
  ]);

  const [activeLanId, setActiveLanId] = useState(1);
  const [activeWanId, setActiveWanId] = useState(1);

  // Router Config (VIP included)
  const [config, setConfig] = useState({
    routerWanIp: "10.93.71.19",
    routerLanIp: "192.168.2.128",
    dnatVirtualIp: "10.93.71.19",
    snatVirtualIp: "10.93.71.19"
  });

  // Helpers
  const activeLanDevice = lanDevices.find(d => d.id === activeLanId) || lanDevices[0];
  const activeWanDevice = wanDevices.find(d => d.id === activeWanId) || wanDevices[0];

  // New device form
  const [newDevice, setNewDevice] = useState({ side: 'LAN', name: '', ip: '', type: 'pc' });

  // --- Scenarios ---
  const scenarios = {
    SNAT: {
      title: "SNAT : Sortant (LAN vers WAN)",
      desc: "L'appareil LAN initie la connexion. Le routeur remplace l'IP source par l'IP Virtuelle SNAT.",
      packet: {
        step0: { src: activeLanDevice?.ip, dst: activeWanDevice?.ip },
        step2: { src: config.snatVirtualIp, dst: activeWanDevice?.ip }
      }
    },
    DNAT: {
      title: "DNAT : Entrant (WAN vers LAN)",
      desc: "L'appareil WAN vise l'IP Virtuelle DNAT. Le routeur redirige vers l'appareil LAN actif.",
      packet: {
        step0: { src: activeWanDevice?.ip, dst: config.dnatVirtualIp },
        step2: { src: activeWanDevice?.ip, dst: activeLanDevice?.ip }
      }
    }
  };

  const currentScenario = scenarios[mode];

  // --- Actions ---
  const handleNext = () => setStep((prev) => (prev < 2 ? prev + 1 : 0));
  const reset = () => setStep(0);
  const switchMode = (newMode) => { setMode(newMode); setStep(0); };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.ip) return;
    const newId = Date.now();
    const deviceObj = { id: newId, name: newDevice.name, ip: newDevice.ip, type: newDevice.type };
    
    if (newDevice.side === 'LAN') {
      setLanDevices([...lanDevices, deviceObj]);
      if (lanDevices.length === 0) setActiveLanId(newId);
    } else {
      setWanDevices([...wanDevices, deviceObj]);
      if (wanDevices.length === 0) setActiveWanId(newId);
    }
    setNewDevice({ ...newDevice, name: '', ip: '' }); 
  };

  const handleDeleteDevice = (side, id) => {
    if (side === 'LAN') {
      const filtered = lanDevices.filter(d => d.id !== id);
      setLanDevices(filtered);
      if (activeLanId === id && filtered.length > 0) setActiveLanId(filtered[0].id);
    } else {
      const filtered = wanDevices.filter(d => d.id !== id);
      setWanDevices(filtered);
      if (activeWanId === id && filtered.length > 0) setActiveWanId(filtered[0].id);
    }
  };

  const getIcon = (type, size = 24) => {
    switch (type) {
      case 'plc': return <Box size={size} />;
      case 'hmi': return <Monitor size={size} />;
      case 'camera': return <Camera size={size} />;
      case 'server': return <Server size={size} />;
      case 'pc': default: return <Laptop size={size} />;
    }
  };

  return (
    <PageContainer>
      
      {/* 1. HEADER STANDARDISÉ */}
      <BrandHeader 
        title="Architecture ETIC RAS e100" 
        subtitle="Visualisation interactive des flux SNAT et DNAT"
        icon={ShieldCheck}
      />

      {/* BOUTON TOGGLE CONFIG */}
      <div className="w-full mb-4 flex justify-end">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors shadow-sm border ${showConfig ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
        >
          {showConfig ? <X size={16} /> : <Settings size={16} />}
          {showConfig ? 'Fermer Config' : 'Configurer & Ajouter'}
        </button>
      </div>

      {/* 2. PANNEAU DE CONFIGURATION (Utilise SectionCard et FormInput) */}
      {showConfig && (
        <SectionCard className="mb-8 animate-in slide-in-from-top-2 border-indigo-100 ring-4 ring-indigo-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CONFIG ROUTEUR */}
                <div className="space-y-2 border-r border-slate-100 pr-4">
                    <h3 className="font-bold text-slate-700 text-sm border-b pb-2 mb-4 flex items-center gap-2">
                        <Settings size={16} /> Routeur & NAT
                    </h3>
                    <FormInput label="IP Routeur (LAN)" value={config.routerLanIp} onChange={(e) => setConfig({...config, routerLanIp: e.target.value})} />
                    <FormInput label="IP Routeur (WAN)" value={config.routerWanIp} onChange={(e) => setConfig({...config, routerWanIp: e.target.value})} />
                    
                    <div className="pt-2 border-t border-slate-100 mt-4">
                        <FormInput label="VIP DNAT (Entrant)" value={config.dnatVirtualIp} onChange={(e) => setConfig({...config, dnatVirtualIp: e.target.value})} suffix="(Public)" />
                        <FormInput label="VIP SNAT (Sortant)" value={config.snatVirtualIp} onChange={(e) => setConfig({...config, snatVirtualIp: e.target.value})} suffix="(Public)" />
                    </div>
                </div>

                {/* AJOUT APPAREIL */}
                <div className="lg:col-span-2">
                     <h3 className="font-bold text-indigo-700 text-sm border-b border-indigo-100 pb-2 mb-4 flex items-center gap-2">
                        <Plus size={16} /> Ajouter un Appareil
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <FormSelect 
                            label="Zone" 
                            value={newDevice.side} 
                            onChange={(e) => setNewDevice({...newDevice, side: e.target.value})}
                            options={[{value: "LAN", label: "LAN"}, {value: "WAN", label: "WAN"}]}
                        />
                        <FormSelect 
                            label="Type" 
                            value={newDevice.type} 
                            onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                            options={[
                                {value: "plc", label: "Automate"}, 
                                {value: "hmi", label: "Pupitre"}, 
                                {value: "pc", label: "PC / Laptop"},
                                {value: "server", label: "Serveur"},
                                {value: "camera", label: "Caméra"}
                            ]}
                        />
                        <FormInput 
                            label="Nom" 
                            value={newDevice.name} 
                            onChange={(e) => setNewDevice({...newDevice, name: e.target.value})} 
                            placeholder="Ex: Capteur 1"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <FormInput 
                                    label="IP" 
                                    value={newDevice.ip} 
                                    onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})} 
                                    placeholder="192.168..."
                                />
                            </div>
                            <button onClick={handleAddDevice} className="mb-4 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 shadow-sm h-[38px] w-[38px] flex items-center justify-center">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* LISTE RAPIDE */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white p-3 rounded h-32 overflow-y-auto border border-slate-200">
                             <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase sticky top-0 bg-white">LAN ({lanDevices.length})</h4>
                             {lanDevices.map(d => (
                                 <div key={d.id} className="flex justify-between items-center text-xs p-1 hover:bg-slate-50 rounded mb-1 border-b border-slate-50">
                                     <span className="flex items-center gap-2 truncate">{getIcon(d.type, 14)} {d.name}</span>
                                     <button onClick={() => handleDeleteDevice('LAN', d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12}/></button>
                                 </div>
                             ))}
                        </div>
                        <div className="bg-white p-3 rounded h-32 overflow-y-auto border border-slate-200">
                             <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase sticky top-0 bg-white">WAN ({wanDevices.length})</h4>
                             {wanDevices.map(d => (
                                 <div key={d.id} className="flex justify-between items-center text-xs p-1 hover:bg-slate-50 rounded mb-1 border-b border-slate-50">
                                     <span className="flex items-center gap-2 truncate">{getIcon(d.type, 14)} {d.name}</span>
                                     <button onClick={() => handleDeleteDevice('WAN', d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12}/></button>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
      )}

      {/* SÉLECTEUR DE MODE */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button onClick={() => switchMode('SNAT')} className={`px-6 py-2 text-sm rounded-lg font-bold transition-all ${mode === 'SNAT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                SNAT (Sortant)
            </button>
            <button onClick={() => switchMode('DNAT')} className={`px-6 py-2 text-sm rounded-lg font-bold transition-all ${mode === 'DNAT' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                DNAT (Entrant)
            </button>
        </div>
      </div>

      {/* 3. VISUALISATION PRINCIPALE (Dans une SectionCard) */}
      <SectionCard title={currentScenario.title} className="overflow-hidden">
        <p className="text-sm text-slate-500 mb-6 -mt-2">{currentScenario.desc}</p>

        <div className="relative p-2 lg:p-8 min-h-[400px] flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-0 bg-slate-50/50 rounded-xl border border-slate-100">
          
          {/* ZONE LAN */}
          <div className="flex-1 flex flex-col items-center p-4 border-b lg:border-b-0 lg:border-r border-slate-200 relative z-10">
            <span className="absolute top-0 left-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-br-lg">LAN (Local)</span>
            
            <div className="flex flex-col gap-4 w-full h-full justify-center lg:pr-8 relative mt-6 lg:mt-0">
                <div className="absolute right-0 top-10 bottom-10 w-1 bg-slate-300 rounded hidden lg:block"></div>
                {lanDevices.map(device => {
                    const isActive = device.id === activeLanId;
                    return (
                        <div key={device.id} onClick={() => { setActiveLanId(device.id); reset(); }}
                            className={`relative flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all w-full max-w-[240px] lg:ml-auto ${isActive ? (mode === 'SNAT' ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-50' : 'bg-white border-green-500 shadow-md') : 'bg-white border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{getIcon(device.type, 28)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold truncate">{device.name}</div>
                                <div className="text-[10px] font-mono text-slate-500">{device.ip}</div>
                            </div>
                            {/* Connecteur Visuel */}
                            <div className="absolute right-[-36px] top-1/2 h-0.5 w-8 bg-slate-300 hidden lg:block"></div>
                            {isActive && <div className="absolute right-[-38px] top-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 hidden lg:block"></div>}
                        </div>
                    );
                })}
            </div>
          </div>

          {/* ZONE ROUTEUR (Centre) */}
          <div className="flex-none w-full lg:w-64 flex flex-col items-center justify-center relative z-20 px-4 py-8 lg:py-0">
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -z-10 hidden lg:block"></div>
             
             <div className="bg-white rounded-xl border-2 border-orange-200 p-6 shadow-xl w-full max-w-[240px] relative">
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-50 px-3 py-0.5 rounded-full text-[10px] font-bold text-orange-600 uppercase border border-orange-100">ETIC RAS</span>
                <ShieldCheck size={48} className="text-orange-500 mx-auto mb-4" />
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-orange-50 pb-2">
                        <span className="text-slate-400">WAN</span>
                        <span className="font-mono font-bold text-blue-600">{config.routerWanIp}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">LAN</span>
                        <span className="font-mono font-bold text-slate-600">{config.routerLanIp}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* ZONE WAN */}
          <div className="flex-1 flex flex-col items-center p-4 border-t lg:border-t-0 lg:border-l border-slate-200 relative z-10">
            <span className="absolute top-0 right-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-bl-lg">WAN (Internet)</span>

            <div className="flex flex-col gap-4 w-full h-full justify-center lg:pl-8 relative mt-6 lg:mt-0">
                <div className="absolute left-0 top-10 bottom-10 w-1 bg-slate-300 rounded hidden lg:block"></div>
                {wanDevices.map(device => {
                    const isActive = device.id === activeWanId;
                    return (
                        <div key={device.id} onClick={() => { setActiveWanId(device.id); reset(); }}
                            className={`relative flex flex-row-reverse text-right items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all w-full max-w-[240px] lg:mr-auto ${isActive ? (mode === 'DNAT' ? 'bg-white border-green-500 shadow-md ring-2 ring-green-50' : 'bg-white border-blue-500 shadow-md') : 'bg-white border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{getIcon(device.type, 28)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold truncate">{device.name}</div>
                                <div className="text-[10px] font-mono text-slate-500">{device.ip}</div>
                            </div>
                            {/* Connecteur Visuel */}
                            <div className="absolute left-[-36px] top-1/2 h-0.5 w-8 bg-slate-300 hidden lg:block"></div>
                            {isActive && <div className="absolute left-[-38px] top-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 hidden lg:block"></div>}
                        </div>
                    );
                })}
            </div>
          </div>

          {/* PAQUET ANIMÉ */}
          {activeLanDevice && activeWanDevice && (
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out z-30 pointer-events-none"
                style={{ 
                   marginLeft: step === 0 ? '-35%' : step === 1 ? '0%' : '35%',
                   opacity: step === 0 ? 0.9 : 1
                }}
            >
                <div className={`w-40 bg-white rounded shadow-2xl border-2 p-3 flex flex-col gap-1 text-[10px] relative -mt-24 lg:-mt-16 ${mode === 'SNAT' ? 'border-blue-500' : 'border-green-500'}`}>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-current text-current"></div>
                    
                    <div className="flex justify-between border-b border-slate-50 pb-1 mb-1">
                        <span className="text-slate-400 uppercase font-bold text-[9px]">Source</span>
                        <span className={`font-mono font-bold ${step === 2 && mode === 'SNAT' ? 'text-blue-600 bg-blue-50 px-1 rounded' : ''}`}>
                            {step < 2 ? currentScenario.packet.step0.src : currentScenario.packet.step2.src}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 uppercase font-bold text-[9px]">Dest.</span>
                        <span className={`font-mono font-bold ${step < 2 && mode === 'DNAT' ? 'text-green-600 bg-green-50 px-1 rounded' : ''}`}>
                            {step < 2 ? currentScenario.packet.step0.dst : currentScenario.packet.step2.dst}
                        </span>
                    </div>

                    {((mode === 'SNAT' && step === 2) || (mode === 'DNAT' && step === 0)) && (
                        <div className="absolute -top-3 -right-2 bg-yellow-100 text-yellow-700 px-2 rounded-full text-[9px] font-bold border border-yellow-200 shadow-sm">
                            VIP
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {/* FOOTER: RÈGLES & CONTRÔLES */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 mt-4 -mx-6 -mb-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className={`flex-none p-2 rounded-full bg-white border ${mode === 'SNAT' ? 'text-blue-500 border-blue-200' : 'text-green-500 border-green-200'}`}>
                <FileText size={20} />
            </div>
            <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Traduction Active</div>
                <div className="text-xs font-mono font-bold text-slate-700">
                    {mode === 'SNAT' ? 
                        `${activeLanDevice?.ip} -> ${config.snatVirtualIp}` : 
                        `${config.dnatVirtualIp} -> ${activeLanDevice?.ip}`
                    }
                </div>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button onClick={reset} className="flex-1 lg:flex-none px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold flex justify-center items-center gap-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              <RefreshCw size={14} /> Reset
            </button>
            <button onClick={handleNext} disabled={step === 2} className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs font-bold text-white flex justify-center items-center gap-2 shadow-sm transition-all ${step === 2 ? 'bg-slate-300 cursor-not-allowed' : mode === 'SNAT' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {step === 2 ? 'Terminé' : 'Étape Suivante'} <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </SectionCard>
    </PageContainer>
  );
};

export default EticNatVisualizer;