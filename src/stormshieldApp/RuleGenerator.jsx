import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, Download, Copy, Shield, ArrowRight } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const RuleGenerator = () => {
  // --- STATE ---
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    action: 'pass',
    source: 'Any',
    dest: 'Any',
    port: 'Any',
    log: 'none',
    comment: ''
  });

  // --- ACTIONS ---
  const addRule = () => {
    setRules([...rules, { ...newRule, id: Date.now() }]);
    // On garde certains champs pour saisir à la chaîne (Source/Dest souvent proches)
    setNewRule({ ...newRule, comment: '' }); 
  };

  const removeRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const duplicateRule = (rule) => {
    setRules([...rules, { ...rule, id: Date.now() }]);
  };

  const exportCSV = () => {
    // En-tête CSV
    const headers = ["ID", "Action", "Source", "Destination", "Service (Port)", "Log", "Commentaire"];
    
    // Contenu
    const rows = rules.map((r, index) => [
      index + 1,
      r.action,
      r.source,
      r.dest,
      r.port,
      r.log,
      `"${r.comment}"` // Guillemets pour gérer les espaces
    ]);

    const csvContent = [
      headers.join(';'), 
      ...rows.map(r => r.join(';'))
    ].join('\n');

    // Téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "regles_stormshield.csv";
    link.click();
  };

  return (
    <PageContainer>
      <BrandHeader 
        title="Générateur de Règles CSV" 
        subtitle="Préparation de matrice de flux pour Stormshield (Format CSV/Excel)"
        icon={FileSpreadsheet}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- FORMULAIRE D'AJOUT --- */}
        <div className="lg:col-span-4 space-y-6">
            <SectionCard title="Nouvelle Règle">
                <div className="space-y-4">
                    <FormSelect 
                        label="Action" 
                        value={newRule.action} 
                        onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                        options={[
                            {value: 'pass', label: 'Allow (Passer)'},
                            {value: 'block', label: 'Block (Bloquer)'}
                        ]}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Source" value={newRule.source} onChange={(e) => setNewRule({...newRule, source: e.target.value})} placeholder="Any / 192.168..." />
                        <FormInput label="Destination" value={newRule.dest} onChange={(e) => setNewRule({...newRule, dest: e.target.value})} placeholder="Any / Server..." />
                    </div>

                    <FormInput label="Service / Port" value={newRule.port} onChange={(e) => setNewRule({...newRule, port: e.target.value})} placeholder="http, tcp/443..." />
                    
                    <FormSelect 
                        label="Niveau de Log" 
                        value={newRule.log} 
                        onChange={(e) => setNewRule({...newRule, log: e.target.value})}
                        options={[
                            {value: 'none', label: 'Aucun'},
                            {value: 'log', label: 'Log (Standard)'},
                            {value: 'all', label: 'Log All (Verbose)'}
                        ]}
                    />

                    <FormInput label="Commentaire" value={newRule.comment} onChange={(e) => setNewRule({...newRule, comment: e.target.value})} placeholder="Description du flux..." />

                    <button 
                        onClick={addRule} 
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 mt-4"
                    >
                        <Plus size={18} /> Ajouter
                    </button>
                </div>
            </SectionCard>
        </div>

        {/* --- TABLEAU --- */}
        <div className="lg:col-span-8">
            <SectionCard title={`Liste des Règles (${rules.length})`} className="h-full flex flex-col">
                
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Source</th>
                                <th className="p-3">Dest.</th>
                                <th className="p-3">Port</th>
                                <th className="p-3">Log</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {rules.map((r, idx) => (
                                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${r.action === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {r.action}
                                        </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{r.source}</td>
                                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{r.dest}</td>
                                    <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">{r.port}</td>
                                    <td className="p-3 text-xs text-slate-500">{r.log}</td>
                                    <td className="p-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => duplicateRule(r)} className="text-slate-400 hover:text-indigo-600" title="Dupliquer"><Copy size={14}/></button>
                                        <button onClick={() => removeRule(r.id)} className="text-slate-400 hover:text-red-600" title="Supprimer"><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                            {rules.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                                        Aucune règle. Utilisez le formulaire à gauche.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button 
                        onClick={exportCSV}
                        disabled={rules.length === 0}
                        className="bg-emerald-600 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Download size={18} /> Exporter CSV
                    </button>
                </div>

            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default RuleGenerator;