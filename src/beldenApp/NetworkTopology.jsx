import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Network, Plus, Trash2, MousePointer2, Link as LinkIcon, Grid, X, Save, AlertOctagon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormSelect, FormInput } from '../components/UI';

const NetworkTopology = () => {
  const containerRef = useRef(null);
  
  // --- MODES D'INTERACTION ---
  const [mode, setMode] = useState('move');
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [selectedSwitchId, setSelectedSwitchId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  // --- TRI DU TABLEAU ---
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // --- GESTION DES GROUPES (ANNEAUX) ---
  // Mise à jour ici : Noms par défaut MRP / Sub-Ring
  const [groups, setGroups] = useState(['MRP', 'Sub-Ring 1']); 
  const [newGroupName, setNewGroupName] = useState(""); 

  // --- DONNÉES INITIALES (VIDES) ---
  const [switches, setSwitches] = useState([]);
  const [links, setLinks] = useState([]);

  // Groupe par défaut : MRP
  const [newSwitch, setNewSwitch] = useState({ name: '', ip: '', model: 'BRS20', group: 'MRP' });

  // --- PALETTE DE COULEURS POUR LES ANNEAUX ---
  const GROUP_PALETTE = [
    { name: 'Indigo', border: 'border-indigo-500', ring: 'ring-indigo-100', bgBadge: 'bg-indigo-100', textBadge: 'text-indigo-700' }, // MRP (souvent)
    { name: 'Blue', border: 'border-blue-500', ring: 'ring-blue-100', bgBadge: 'bg-blue-100', textBadge: 'text-blue-700' },       // Sub-Ring 1
    { name: 'Emerald', border: 'border-emerald-500', ring: 'ring-emerald-100', bgBadge: 'bg-emerald-100', textBadge: 'text-emerald-700' }, // Sub-Ring 2
    { name: 'Violet', border: 'border-violet-500', ring: 'ring-violet-100', bgBadge: 'bg-violet-100', textBadge: 'text-violet-700' },
    { name: 'Pink', border: 'border-pink-500', ring: 'ring-pink-100', bgBadge: 'bg-pink-100', textBadge: 'text-pink-700' },
    { name: 'Cyan', border: 'border-cyan-500', ring: 'ring-cyan-100', bgBadge: 'bg-cyan-100', textBadge: 'text-cyan-700' },
    { name: 'Amber', border: 'border-amber-500', ring: 'ring-amber-100', bgBadge: 'bg-amber-100', textBadge: 'text-amber-700' },
  ];

  // Helper pour récupérer le style d'un groupe
  const getGroupStyle = (groupName) => {
    const index = groups.indexOf(groupName);
    if (index === -1) return { border: 'border-slate-400', ring: 'ring-slate-100', bgBadge: 'bg-slate-100', textBadge: 'text-slate-600' };
    return GROUP_PALETTE[index % GROUP_PALETTE.length];
  };

  // --- LISTE DES MODÈLES ---
  const switchModels = [
    { value: 'BRS20', label: 'Bobcat BRS20' },
    { value: 'BRS30', label: 'Bobcat BRS30' },
    { value: 'BRS40', label: 'Bobcat BRS40' },
    { value: 'BRS50', label: 'Bobcat BRS50' },
    { value: 'RSP20', label: 'RSP20' },
    { value: 'RSP25', label: 'RSP25 (PRP)' },
    { value: 'RSP30', label: 'RSP30' },
    { value: 'RSP35', label: 'RSP35 (PRP)' },
    { value: 'GRS105', label: 'Greyhound 105' },
    { value: 'GRS106', label: 'Greyhound 106' },
    { value: 'GRS1040', label: 'Greyhound 1040' },
    { value: 'GRS115', label: 'Greyhound 115' },
  ];

  // --- DETECTION DOUBLONS IP ---
  const duplicateIps = useMemo(() => {
    const counts = {};
    const duplicates = [];
    switches.forEach(s => {
        if (s.ip && s.ip.trim() !== "") {
            counts[s.ip] = (counts[s.ip] || 0) + 1;
        }
    });
    for (const ip in counts) {
        if (counts[ip] > 1) duplicates.push(ip);
    }
    return duplicates;
  }, [switches]);

  // --- LOGIQUE DE TRI ---
  const sortedSwitches = useMemo(() => {
    let sortableSwitches = [...switches];
    if (sortConfig !== null) {
      sortableSwitches.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSwitches;
  }, [switches, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <ArrowUpDown size={14} className="opacity-30" />;
    if (sortConfig.direction === 'ascending') return <ArrowUp size={14} className="text-indigo-600" />;
    return <ArrowDown size={14} className="text-indigo-600" />;
  };

  // Helpers
  const selectedSwitch = switches.find(s => s.id === selectedSwitchId);

  // --- ACTIONS GROUPES ---
  const handleAddGroup = () => {
    if (newGroupName && !groups.includes(newGroupName)) {
        setGroups([...groups, newGroupName]);
        setNewSwitch({ ...newSwitch, group: newGroupName }); // Sélectionne auto le nouveau
        setNewGroupName("");
    }
  };

  // --- ACTIONS SWITCHS ---
  const handleAddSwitch = () => {
    if (!newSwitch.name) return;
    const newId = Date.now();
    const startX = 300;
    const startY = 250;
    
    setSwitches([...switches, { 
        id: newId, 
        name: newSwitch.name, 
        role: 'client', 
        group: newSwitch.group,
        model: newSwitch.model, 
        ip: newSwitch.ip,
        x: startX + (Math.random() * 100 - 50), 
        y: startY + (Math.random() * 100 - 50)
    }]);
    setNewSwitch({ ...newSwitch, name: '', ip: '' });
  };

  const updateSelectedSwitch = (field, value) => {
    if (!selectedSwitchId) return;
    setSwitches(switches.map(s => s.id === selectedSwitchId ? { ...s, [field]: value } : s));
  };

  const removeSwitch = (id) => {
    setSwitches(switches.filter(s => s.id !== id));
    setLinks(links.filter(l => l.source !== id && l.target !== id));
    if (selectedSwitchId === id) setSelectedSwitchId(null);
  };

  // --- ACTIONS LIENS ---
  const handleNodeClick = (id) => {
    if (mode === 'link') {
      if (selectedSourceId === null) {
        setSelectedSourceId(id);
      } else if (selectedSourceId === id) {
        setSelectedSourceId(null);
      } else {
        const existing = links.find(l => (l.source === selectedSourceId && l.target === id) || (l.source === id && l.target === selectedSourceId));
        if (!existing) {
            setLinks([...links, { id: `l-${Date.now()}`, source: selectedSourceId, target: id, type: 'active' }]);
        }
        setSelectedSourceId(null);
      }
    } else {
        setSelectedSwitchId(id);
    }
  };

  const toggleLinkType = (linkId) => {
    setLinks(links.map(l => {
      if (l.id !== linkId) return l;
      if (l.type === 'active') return { ...l, type: 'backup' };
      if (l.type === 'backup') return { ...l, type: 'coupling' };
      if (l.type === 'coupling') return { ...l, type: 'coupling-backup' };
      return { ...l, type: 'active' };
    }));
  };

  // --- DRAG & DROP ---
  const handleMouseDown = (e, id) => {
    if (mode === 'move') {
        e.stopPropagation();
        setDraggingId(id);
        setSelectedSwitchId(id);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const bx = Math.max(30, Math.min(rect.width - 30, x));
      const by = Math.max(30, Math.min(rect.height - 30, y));
      setSwitches(switches.map(s => s.id === draggingId ? { ...s, x: bx, y: by } : s));
    }
  };

  const handleMouseUp = () => setDraggingId(null);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, switches]);

  // --- RENDU GRAPHIQUE ---
  const getLinkStyle = (type) => {
    switch (type) {
        case 'backup': return { stroke: '#fb923c', dash: '8 4', width: 3, label: 'X (MRP)' }; 
        case 'coupling': return { stroke: '#8b5cf6', dash: '0', width: 4, label: 'Interco' }; 
        case 'coupling-backup': return { stroke: '#a78bfa', dash: '4 4', width: 3, label: 'X (Interco)' };
        default: return { stroke: '#10b981', dash: '0', width: 3, label: '' }; 
    }
  };

  // Helper pour savoir si c'est un format Rack (GRS)
  const isRackFormat = (model) => model && model.startsWith('GRS');

  return (
    <PageContainer>
      <BrandHeader title="Topologie Réseau MRP" subtitle="Concepteur libre : Anneaux, Sous-anneaux et Interconnexions" icon={Network} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : PARAMETRES --- */}
        <div className="lg:col-span-3 space-y-4">
            
            {/* ALARME DOUBLON IP */}
            {duplicateIps.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded animate-pulse">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm mb-1">
                        <AlertOctagon size={18} /> Conflit d'adresse IP !
                    </div>
                    <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside">
                        {duplicateIps.map(ip => <li key={ip}>IP en double : <b>{ip}</b></li>)}
                    </ul>
                </div>
            )}

            {/* MODE EDITION / AJOUT */}
            {selectedSwitch ? (
                <SectionCard title="Éditer l'équipement" className="border-indigo-500 ring-2 ring-indigo-500/20">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">ID: {selectedSwitch.id}</span>
                            <button onClick={() => setSelectedSwitchId(null)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                        </div>
                        
                        <FormInput label="Nom" value={selectedSwitch.name} onChange={(e) => updateSelectedSwitch('name', e.target.value)} />
                        
                        <div className={duplicateIps.includes(selectedSwitch.ip) ? "border border-red-500 rounded p-1 bg-red-50" : ""}>
                            <FormInput label="Adresse IP" value={selectedSwitch.ip} onChange={(e) => updateSelectedSwitch('ip', e.target.value)} />
                            {duplicateIps.includes(selectedSwitch.ip) && <span className="text-[10px] text-red-500 font-bold block -mt-3 mb-2">⚠️ Cette IP est déjà utilisée</span>}
                        </div>
                        
                        <FormSelect label="Modèle" value={selectedSwitch.model} onChange={(e) => updateSelectedSwitch('model', e.target.value)}
                            options={switchModels}
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                            <FormSelect label="Anneau" value={selectedSwitch.group} onChange={(e) => updateSelectedSwitch('group', e.target.value)}
                                options={groups.map(g => ({ value: g, label: g }))}
                            />
                            <FormSelect label="Rôle" value={selectedSwitch.role} onChange={(e) => updateSelectedSwitch('role', e.target.value)}
                                options={[{value: 'client', label: 'Client'}, {value: 'manager', label: 'Manager'}]}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                            <button onClick={() => setSelectedSwitchId(null)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-bold flex items-center justify-center gap-2">
                                <Save size={16}/> OK
                            </button>
                            <button onClick={() => removeSwitch(selectedSwitch.id)} className="px-3 bg-white border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 hover:text-red-700">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                </SectionCard>
            ) : (
                <SectionCard title="Ajouter Équipement">
                    <div className="space-y-2 text-sm">
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded text-xs text-slate-500 mb-2 italic border border-slate-100 dark:border-slate-700">
                            Sélectionnez un switch sur le plan pour modifier ses propriétés.
                        </div>
                        <FormInput label="Nom" value={newSwitch.name} onChange={(e) => setNewSwitch({...newSwitch, name: e.target.value})} placeholder="Ex: Switch-New" />
                        <FormInput label="IP" value={newSwitch.ip} onChange={(e) => setNewSwitch({...newSwitch, ip: e.target.value})} placeholder="192.168.1.X" />
                        
                        {/* GESTION DES GROUPES (CREATION) */}
                        <div className="mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Anneau (Groupe)</label>
                            <div className="flex gap-2 mb-2">
                                <select 
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-sm outline-none"
                                    value={newSwitch.group} 
                                    onChange={(e) => setNewSwitch({...newSwitch, group: e.target.value})}
                                >
                                    {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                                    placeholder="Nouveau (ex: Sub-Ring 2)..."
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                                <button 
                                    onClick={handleAddGroup}
                                    disabled={!newGroupName}
                                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 rounded-lg text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <FormSelect label="Modèle" value={newSwitch.model} onChange={(e) => setNewSwitch({...newSwitch, model: e.target.value})}
                            options={switchModels}
                        />
                        
                        <button onClick={handleAddSwitch} disabled={!newSwitch.name} className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 font-bold flex items-center justify-center gap-2">
                            <Plus size={16}/> Créer
                        </button>
                    </div>
                </SectionCard>
            )}

            {/* LEGENDE */}
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] space-y-1.5">
                <div className="font-bold mb-1 uppercase text-slate-400">Légende Liens (Clic pour changer)</div>
                <div className="flex items-center gap-2"><div className="w-6 h-1 bg-emerald-500"></div> Actif (Passant)</div>
                <div className="flex items-center gap-2"><div className="w-6 h-1 bg-orange-400 border-b-2 border-dotted border-white"></div> Bloqué (Backup MRP)</div>
                <div className="flex items-center gap-2"><div className="w-6 h-1 bg-violet-500"></div> Interconnexion</div>
                <div className="flex items-center gap-2"><div className="w-6 h-1 bg-violet-400 border-b-2 border-dotted border-white"></div> Interco Secours</div>
            </div>
        </div>

        {/* --- COLONNE DROITE : CANVAS + TABLEAU --- */}
        <div className="lg:col-span-9 space-y-6">
            
            {/* TOOLBAR CANVAS */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded-t-xl border-x border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                    <button onClick={() => setMode('move')} className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${mode === 'move' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <MousePointer2 size={16}/> Sélection / Déplacer
                    </button>
                    <button onClick={() => { setMode('link'); setSelectedSwitchId(null); }} className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${mode === 'link' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <LinkIcon size={16}/> Câblage
                    </button>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Grid size={14}/> {switches.length} Équipements
                </div>
            </div>

            {/* ZONE DE DESSIN */}
            <div ref={containerRef} className={`relative h-[600px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-xl overflow-hidden ${mode === 'link' ? 'cursor-crosshair' : 'cursor-default'}`}>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {links.map(link => {
                        const s = switches.find(sw => sw.id === link.source);
                        const t = switches.find(sw => sw.id === link.target);
                        if (!s || !t) return null;
                        const style = getLinkStyle(link.type);
                        
                        return (
                            <g key={link.id} className="pointer-events-auto cursor-pointer group" onClick={() => toggleLinkType(link.id)}>
                                <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="transparent" strokeWidth="15" />
                                <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={style.stroke} strokeWidth={style.width} strokeDasharray={style.dash} className="transition-all hover:stroke-slate-800 hover:stroke-[5]" />
                                {link.type !== 'active' && (
                                    <g>
                                        <rect x={(s.x+t.x)/2 - 10} y={(s.y+t.y)/2 - 8} width="20" height="16" rx="4" fill={style.stroke} />
                                        <text x={(s.x+t.x)/2} y={(s.y+t.y)/2} dy="4" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">X</text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {switches.map(sw => {
                    const isSelected = selectedSwitchId === sw.id;
                    const isDuplicate = duplicateIps.includes(sw.ip);
                    const isRack = isRackFormat(sw.model);
                    const groupStyle = getGroupStyle(sw.group);

                    // Formes
                    const shapeClass = isRack ? "w-32 h-16 rounded-md" : "w-20 h-20 rounded-xl";

                    let containerClass = 'bg-white dark:bg-slate-800';
                    let borderClass = `${groupStyle.border}`;

                    if (isDuplicate) {
                        borderClass = 'border-red-500 animate-pulse ring-4 ring-red-200';
                        containerClass = 'bg-red-50 dark:bg-red-900/50';
                    } else if (sw.role === 'manager') {
                        borderClass = 'border-orange-500 ring-4 ring-orange-100 dark:ring-orange-900/30';
                    } else {
                        // Style par défaut du groupe
                        borderClass = groupStyle.border;
                    }

                    return (
                        <div
                            key={sw.id}
                            onMouseDown={(e) => handleMouseDown(e, sw.id)}
                            onClick={() => handleNodeClick(sw.id)}
                            className={`absolute flex flex-col items-center justify-center border-2 shadow-lg transition-all z-10 group opacity-100
                                ${shapeClass}
                                ${containerClass}
                                ${borderClass}
                                ${isSelected ? 'ring-4 ring-indigo-400 scale-105 z-20' : ''}
                                ${mode === 'move' ? 'cursor-move' : 'cursor-pointer hover:scale-105'}
                            `}
                            style={{ left: sw.x, top: sw.y, transform: 'translate(-50%, -50%)' }}
                        >
                            <Network size={isRack ? 20 : 24} className={sw.role === 'manager' ? 'text-orange-500' : (isDuplicate ? 'text-red-500' : 'text-slate-500 dark:text-slate-300')} />
                            {isDuplicate && <div className="absolute -top-3 -left-3 bg-red-500 text-white rounded-full p-1 shadow-md animate-bounce"><AlertOctagon size={16} /></div>}
                            
                            <div className="w-full text-center px-1 mt-1 leading-tight">
                                <div className="text-[9px] font-bold truncate text-slate-800 dark:text-slate-100">{sw.name}</div>
                                <div className={`text-[8px] font-mono truncate ${isDuplicate ? 'text-red-600 font-bold' : 'text-slate-500'}`}>{sw.ip}</div>
                            </div>
                            
                            {sw.role === 'manager' && <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">RM</div>}
                        </div>
                    );
                })}

                {switches.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <MousePointer2 size={48} className="mx-auto mb-2 opacity-50" />
                            <p>La zone est vide. Utilisez le panneau gauche pour ajouter des équipements.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* TABLEAU RÉCAPITULATIF TRIABLE */}
            <SectionCard title="Inventaire & Configuration">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-1">Nom {getSortIcon('name')}</div>
                                </th>
                                <th className="p-3 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('ip')}>
                                    <div className="flex items-center gap-1">IP {getSortIcon('ip')}</div>
                                </th>
                                <th className="p-3 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('model')}>
                                    <div className="flex items-center gap-1">Modèle {getSortIcon('model')}</div>
                                </th>
                                <th className="p-3 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('group')}>
                                    <div className="flex items-center gap-1">Anneau {getSortIcon('group')}</div>
                                </th>
                                <th className="p-3 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('role')}>
                                    <div className="flex items-center gap-1">Rôle MRP {getSortIcon('role')}</div>
                                </th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {sortedSwitches.map(sw => {
                                const style = getGroupStyle(sw.group);
                                return (
                                    <tr key={sw.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${selectedSwitchId === sw.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`} onClick={() => setSelectedSwitchId(sw.id)}>
                                        <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{sw.name}</td>
                                        <td className={`p-3 font-mono ${duplicateIps.includes(sw.ip) ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                            {sw.ip || "-"} {duplicateIps.includes(sw.ip) && "⚠️"}
                                        </td>
                                        <td className="p-3">{sw.model}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${style.bgBadge} ${style.textBadge}`}>
                                                {sw.group}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${sw.role === 'manager' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {sw.role === 'manager' ? 'Manager (RM)' : 'Client'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={(e) => { e.stopPropagation(); removeSwitch(sw.id); }} className="text-red-400 hover:text-red-600 p-1">
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {switches.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                                        Aucun équipement configuré. Ajoutez-en un pour commencer.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

        </div>

      </div>
    </PageContainer>
  );
};

export default NetworkTopology;