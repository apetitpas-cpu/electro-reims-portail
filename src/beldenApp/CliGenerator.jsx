import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Save, Command, Plus, Trash2, Users, UserPlus, Edit3, Repeat, Cable } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const CliGenerator = () => {
  // --- STATE VLANS ---
  const [vlans, setVlans] = useState([
    { uniqueId: 1, id: '1', name: 'Default' }
  ]);
  const [newVlan, setNewVlan] = useState({ id: '', name: '' });

  // --- STATE UTILISATEURS ---
  const [users, setUsers] = useState([
    { uniqueId: 1, name: 'admin', password: 'private', role: 'administrator' }
  ]);
  const [newUser, setNewUser] = useState({ name: '', password: '', role: 'administrator' });

  // --- STATE PARAMETRES GLOBAUX ---
  const [config, setConfig] = useState({
    hostname: "Switch-New",
    ip: "192.168.1.1",
    mask: "255.255.255.0",
    gateway: "192.168.1.254",
    vlanMgmt: "1",
    // NOUVEAUX CHAMPS MRP
    mrpEnabled: false,
    mrpRole: "client", // client | manager
    mrpVlan: "1",
    // SERVICES
    ssh: true,
    https: true,
    http: false,
    telnet: false
  });

  // --- STATE PORTS ---
  const [ports, setPorts] = useState([]);
  const [newPort, setNewPort] = useState({ range: '', mode: 'access', vlan: '' });

  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);

  // --- SECURITE : SI VLAN SUPPRIMÉ ---
  useEffect(() => {
    // Check VLAN Management
    const mgmtExists = vlans.find(v => v.id === config.vlanMgmt);
    if (!mgmtExists) {
        const fallback = vlans.find(v => v.id === '1') || vlans[0];
        if (fallback) setConfig(prev => ({ ...prev, vlanMgmt: fallback.id }));
    }
    // Check VLAN MRP
    const mrpExists = vlans.find(v => v.id === config.mrpVlan);
    if (!mrpExists) {
        const fallback = vlans.find(v => v.id === '1') || vlans[0];
        if (fallback) setConfig(prev => ({ ...prev, mrpVlan: fallback.id }));
    }
  }, [vlans, config.vlanMgmt, config.mrpVlan]);

  // --- GÉNÉRATION DU SCRIPT ---
  useEffect(() => {
    const generateScript = () => {
      const lines = [];
      
      lines.push('enable');
      lines.push('configure');
      
      // 1. SYSTEME
      lines.push('! --- SYSTEM ---');
      lines.push(`system name "${config.hostname}"`);

      // 2. UTILISATEURS
      if (users.length > 0) {
        lines.push('! --- USERS ---');
        users.forEach(u => {
            lines.push(`user "${u.name}" password "${u.password}" ${u.role}`);
        });
      }

      // 3. VLANS
      if (vlans.length > 0) {
        lines.push('! --- VLANS ---');
        vlans.forEach(v => {
            if(v.id !== '1') {
                lines.push(`vlan ${v.id}`);
                lines.push(` name "${v.name}"`);
                lines.push(' exit');
            }
        });
      }

      // 4. REDONDANCE MRP
      if (config.mrpEnabled) {
        // AJOUT ICI : Désactivation du Spanning Tree pour éviter les conflits
        lines.push('! --- SPANNING TREE (Desactive car MRP actif) ---');
        lines.push('no spanning-tree operation');
        
        const vlanName = vlans.find(v => v.id === config.mrpVlan)?.name || '';
        lines.push(`! --- MRP RING (VLAN ${config.mrpVlan}: ${vlanName}) ---`);
        lines.push('mrp ring 1'); // On configure l'anneau 1 par défaut
        lines.push(` role ${config.mrpRole}`);
        lines.push(` vlan ${config.mrpVlan}`);
        lines.push(' enable');
        lines.push(' exit');
      }

      // 5. PORTS
      if (ports.length > 0) {
        lines.push('! --- PORTS ---');
        ports.forEach(p => {
            lines.push(`interface ${p.range}`);
            if (p.mode === 'access') {
                lines.push(' switchport mode access');
                lines.push(` switchport access vlan ${p.vlan}`);
            } else {
                lines.push(' switchport mode trunk');
                lines.push(` switchport trunk allowed vlan add ${p.vlan}`);
            }
            lines.push(' exit');
        });
      }

      // 6. MANAGEMENT IP
      const vlanName = vlans.find(v => v.id === config.vlanMgmt)?.name || '';
      lines.push(`! --- MANAGEMENT (VLAN ${config.vlanMgmt} : ${vlanName}) ---`);
      lines.push(`interface vlan ${config.vlanMgmt}`);
      lines.push(` ip address ${config.ip} ${config.mask}`);
      lines.push(' exit');
      
      if (config.gateway) {
        lines.push(`ip default-gateway ${config.gateway}`);
      }

      // 7. SERVICES
      lines.push('! --- SERVICES ---');
      lines.push(config.ssh ? 'ip ssh server' : 'no ip ssh server');
      lines.push(config.https ? 'ip https server' : 'no ip https server');
      lines.push(config.http ? 'ip http server' : 'no ip http server');
      lines.push(config.telnet ? 'ip telnet server' : 'no ip telnet server');

      // 8. FIN
      lines.push('exit');
      lines.push('copy running-config startup-config');

      return lines.join('\n');
    };

    setScript(generateScript());
  }, [config, vlans, ports, users]);

  // --- ACTIONS VLANS ---
  const addVlan = () => {
    if (newVlan.id && newVlan.name) {
        if (!vlans.some(v => v.id === newVlan.id)) {
            setVlans([...vlans, { ...newVlan, uniqueId: Date.now() }]);
            setNewVlan({ id: '', name: '' });
        }
    }
  };
  const updateVlan = (uniqueId, field, value) => {
    setVlans(vlans.map(v => v.uniqueId === uniqueId ? { ...v, [field]: value } : v));
  };
  const removeVlan = (uniqueId) => {
      setVlans(vlans.filter(v => v.uniqueId !== uniqueId));
  };

  // --- ACTIONS USERS ---
  const addUser = () => {
    if (newUser.name && newUser.password) {
        setUsers([...users, { ...newUser, uniqueId: Date.now() }]);
        setNewUser({ name: '', password: '', role: 'administrator' });
    }
  };
  const removeUser = (uniqueId) => setUsers(users.filter(u => u.uniqueId !== uniqueId));

  // --- ACTIONS PORTS ---
  const addPort = () => {
    if (newPort.range && newPort.vlan) {
        setPorts([...ports, newPort]);
        setNewPort({ range: '', mode: 'access', vlan: '' });
    }
  };
  const removePort = (idx) => setPorts(ports.filter((_, i) => i !== idx));

  // --- ACTIONS GLOBALES ---
  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer>
      <BrandHeader 
        title="Générateur CLI HiOS" 
        subtitle="Création rapide de configuration pour switches Hirschmann (Ligne de commande)"
        icon={Terminal}
      />

      {/* --- PREAMBULE : MODE D'EMPLOI --- */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Cable size={22} className="text-indigo-600 dark:text-indigo-400"/> 
            Mode d'emploi & Injection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="flex gap-4 items-start">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full flex-none shadow-sm border border-indigo-100 dark:border-indigo-800">1</div>
                <div>
                    <strong className="text-slate-800 dark:text-slate-100 block mb-1 text-base">Connexion Physique</strong>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                        Raccordez votre PC au port <strong>V.24 / USB</strong> du switch à l'aide du câble série Hirschmann (ACA21 ou V.24).
                    </p>
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full flex-none shadow-sm border border-indigo-100 dark:border-indigo-800">2</div>
                <div>
                    <strong className="text-slate-800 dark:text-slate-100 block mb-1 text-base">Paramètres PuTTY</strong>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                        Type de connexion : <strong>Serial</strong>.<br/>
                        Vitesse (Speed) : <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-200">115200</span> (Gamme BRS/GRS)<br/>
                        ou <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-200">9600</span> (Anciens RS20/30).
                    </p>
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full flex-none shadow-sm border border-indigo-100 dark:border-indigo-800">3</div>
                <div>
                    <strong className="text-slate-800 dark:text-slate-100 block mb-1 text-base">Injection Rapide</strong>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                        1. Cliquez sur le bouton <strong>"Copier"</strong> à droite.<br/>
                        2. Dans la fenêtre noire de PuTTY, faites un <strong>Clic Droit</strong> souris pour coller et exécuter toutes les commandes d'un coup.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : FORMULAIRES --- */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* 1. GENERAL */}
            <SectionCard title="1. Paramètres Généraux">
                <FormInput 
                    label="Nom du système (Hostname)" 
                    value={config.hostname} 
                    onChange={(e) => handleChange('hostname', e.target.value)}
                    placeholder="Ex: BRS-Atelier-1"
                />
                <div className="mb-4">
                    <FormSelect 
                        label="VLAN de Management"
                        value={config.vlanMgmt}
                        onChange={(e) => handleChange('vlanMgmt', e.target.value)}
                        options={vlans.map(v => ({ value: v.id, label: `ID ${v.id} - ${v.name}` }))}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                        label="IP Management" 
                        value={config.ip} 
                        onChange={(e) => handleChange('ip', e.target.value)}
                    />
                    <FormInput 
                        label="Masque" 
                        value={config.mask} 
                        onChange={(e) => handleChange('mask', e.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <FormInput 
                        label="Passerelle (Gateway)" 
                        value={config.gateway} 
                        onChange={(e) => handleChange('gateway', e.target.value)}
                    />
                </div>
            </SectionCard>

            {/* 2. REDONDANCE MRP */}
            <SectionCard title="2. Redondance (MRP)">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => handleChange('mrpEnabled', !config.mrpEnabled)}>
                    <input 
                        type="checkbox" 
                        checked={config.mrpEnabled} 
                        onChange={(e) => handleChange('mrpEnabled', e.target.checked)}
                        className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-200">
                        <Repeat size={18} className="text-indigo-500"/> Activer le MRP (Anneau)
                    </div>
                </div>

                {config.mrpEnabled && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <FormSelect 
                            label="Rôle MRP"
                            value={config.mrpRole}
                            onChange={(e) => handleChange('mrpRole', e.target.value)}
                            options={[
                                {value: 'client', label: 'Client (Défaut)'}, 
                                {value: 'manager', label: 'Manager (RM)'}
                            ]}
                        />
                        <FormSelect 
                            label="VLAN MRP"
                            value={config.mrpVlan}
                            onChange={(e) => handleChange('mrpVlan', e.target.value)}
                            options={vlans.map(v => ({ value: v.id, label: `ID ${v.id} - ${v.name}` }))}
                        />
                        <div className="col-span-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded border border-orange-100 dark:border-orange-800">
                            ⚠️ Le Spanning Tree sera automatiquement désactivé.
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* 3. UTILISATEURS */}
            <SectionCard title="3. Utilisateurs">
                <div className="grid grid-cols-3 gap-2 items-end mb-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="col-span-1">
                        <FormInput label="Nom" placeholder="admin" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                        <FormInput label="Mdp" placeholder="..." type="text" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div className="col-span-1 flex gap-1">
                        <div className="flex-1">
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rôle</label>
                             <select className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                                <option value="administrator">Admin</option>
                                <option value="operator">Oper.</option>
                                <option value="auditor">Audit</option>
                             </select>
                        </div>
                        <button onClick={addUser} disabled={!newUser.name} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 mt-5 h-[34px] w-[34px] flex items-center justify-center">
                            <UserPlus size={16} />
                        </button>
                    </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {users.map(u => (
                        <div key={u.uniqueId} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded shadow-sm">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400"/>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{u.name}</span>
                                <span className="text-xs text-slate-400">({u.role})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">***</span>
                                {users.length > 1 && (
                                    <button onClick={() => removeUser(u.uniqueId)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* 4. GESTION VLANS */}
            <SectionCard title="4. Gestion des VLANs">
                <div className="flex gap-2 items-end mb-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-20">
                        <FormInput label="ID" type="number" placeholder="10" value={newVlan.id} onChange={(e) => setNewVlan({...newVlan, id: e.target.value})} />
                    </div>
                    <div className="flex-1">
                        <FormInput label="Nom" placeholder="Process" value={newVlan.name} onChange={(e) => setNewVlan({...newVlan, name: e.target.value})} />
                    </div>
                    <button onClick={addVlan} disabled={!newVlan.id} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 mb-4 disabled:opacity-50">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {vlans.map(v => (
                        <div key={v.uniqueId} className="flex gap-2 items-center text-sm p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded shadow-sm group">
                            <input type="number" className="w-12 text-center font-mono font-bold bg-indigo-50 text-indigo-700 rounded border-none focus:ring-2 focus:ring-indigo-500 text-xs py-1 outline-none"
                                value={v.id} onChange={(e) => updateVlan(v.uniqueId, 'id', e.target.value)} />
                            <input type="text" className="flex-1 bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-slate-700 dark:text-slate-200 text-sm font-medium px-2"
                                value={v.name} onChange={(e) => updateVlan(v.uniqueId, 'name', e.target.value)} />
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                <Edit3 size={12} className="text-slate-300 mr-2 pointer-events-none"/>
                                {vlans.length > 1 && (
                                    <button onClick={() => removeVlan(v.uniqueId)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* 5. AFFECTATION PORTS */}
            <SectionCard title="5. Configuration des Ports">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-4 text-sm">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <FormInput label="Ports (ex: 1/1, 1/1-4)" value={newPort.range} onChange={(e) => setNewPort({...newPort, range: e.target.value})} />
                        <FormSelect label="Mode" value={newPort.mode} onChange={(e) => setNewPort({...newPort, mode: e.target.value})} 
                            options={[
                                {value: 'access', label: 'Access (Untagged)'}, 
                                {value: 'trunk', label: 'Trunk (Tagged)'}
                            ]}
                        />
                    </div>
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            {newPort.mode === 'access' ? (
                                <FormSelect 
                                    label="VLAN (Access)"
                                    value={newPort.vlan}
                                    onChange={(e) => setNewPort({...newPort, vlan: e.target.value})}
                                    options={[
                                        {value:'', label:'Choisir...'}, 
                                        ...vlans.map(v => ({value: v.id, label: `VLAN ${v.id} (${v.name})`}))
                                    ]}
                                />
                            ) : (
                                <FormInput label="VLANs autorisés (ex: 1,10)" value={newPort.vlan} onChange={(e) => setNewPort({...newPort, vlan: e.target.value})} />
                            )}
                        </div>
                        <button onClick={addPort} disabled={!newPort.range || !newPort.vlan} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 mb-4 disabled:opacity-50 disabled:bg-slate-400">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {ports.length === 0 ? (
                        <div className="text-center text-xs text-slate-400 italic py-2">Aucun port configuré</div>
                    ) : (
                        ports.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded shadow-sm">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 dark:text-slate-200">Port {p.range}</span>
                                    <span className="text-slate-500 uppercase text-[10px]">{p.mode} • VLAN {p.vlan}</span>
                                </div>
                                <button onClick={() => removePort(idx)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        ))
                    )}
                </div>
            </SectionCard>

        </div>

        {/* --- COLONNE DROITE : RESULTAT --- */}
        <div className="lg:col-span-7">
            <SectionCard title="Script CLI généré" className="h-full flex flex-col bg-slate-900 border-slate-800">
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                        <Command size={14}/> Syntaxe HiOS (BRS/RSP/GRS)
                    </div>
                    <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                    >
                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                        {copied ? 'Copié !' : 'Copier tout'}
                    </button>
                </div>

                <div className="flex-1 relative">
                    <textarea 
                        className="w-full h-[800px] bg-slate-950 text-green-400 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
                        value={script}
                        readOnly
                    />
                </div>

            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default CliGenerator;