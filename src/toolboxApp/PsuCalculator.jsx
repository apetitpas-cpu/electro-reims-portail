import React, { useState } from 'react';
import { Zap, Plus, Trash2, Save, Calculator, ArrowRight, Info } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput } from '../components/UI';

const PsuCalculator = () => {
  // --- STATE ---
  const [items, setItems] = useState([]);
  const [voltage, setVoltage] = useState(24); // Tension par défaut
  const [safetyMargin, setSafetyMargin] = useState(20); // Marge % par défaut
  
  // Formulaire d'ajout
  const [newItem, setNewItem] = useState({ name: '', qty: 1, val: 0, type: 'current' }); // type: 'current' (A) ou 'power' (W)

  // --- LOGIQUE ---
  const addItem = () => {
    if (!newItem.name || newItem.val <= 0) return;

    // On normalise tout : on calcule A et W pour chaque ligne
    let current = 0;
    let power = 0;

    if (newItem.type === 'current') {
        current = parseFloat(newItem.val);
        power = current * voltage;
    } else {
        power = parseFloat(newItem.val);
        current = power / voltage;
    }

    const itemToAdd = {
        id: Date.now(),
        name: newItem.name,
        qty: parseInt(newItem.qty),
        voltage: voltage,
        unitCurrent: current,
        unitPower: power,
        totalCurrent: current * parseInt(newItem.qty),
        totalPower: power * parseInt(newItem.qty)
    };

    setItems([...items, itemToAdd]);
    setNewItem({ name: '', qty: 1, val: 0, type: 'current' }); // Reset form
  };

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  // --- TOTAUX ---
  const totalPower = items.reduce((acc, item) => acc + item.totalPower, 0);
  const totalCurrent = items.reduce((acc, item) => acc + item.totalCurrent, 0);
  
  // Avec Marge
  const recommendedPower = totalPower * (1 + safetyMargin / 100);
  const recommendedCurrent = totalCurrent * (1 + safetyMargin / 100);

  // Standards Alims (pour info)
  const standardSizes = [1.3, 2.5, 5, 10, 20, 40];
  const suggestedSize = standardSizes.find(s => s >= recommendedCurrent) || "Spécifique (>40A)";

  return (
    <PageContainer>
      <BrandHeader 
        title="Dimensionnement Alimentation" 
        subtitle="Bilan de puissance armoire & Choix disjoncteur"
        icon={Zap}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : CONFIG & AJOUT */}
        <div className="space-y-6">
            <SectionCard title="1. Configuration Générale">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Tension (VDC)</label>
                        <input 
                            type="number" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
                            className="w-full mt-1 p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Marge Sécurité (%)</label>
                        <input 
                            type="number" value={safetyMargin} onChange={(e) => setSafetyMargin(parseFloat(e.target.value))}
                            className="w-full mt-1 p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 font-bold text-emerald-600"
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="2. Ajouter un équipement">
                <div className="space-y-3">
                    <FormInput 
                        label="Désignation (ex: CPU 1515, Switch, IHM...)" 
                        value={newItem.name} 
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                    />
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Qté</label>
                            <input 
                                type="number" min="1" 
                                value={newItem.qty} 
                                onChange={(e) => setNewItem({...newItem, qty: e.target.value})}
                                className="w-full mt-1 p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-700"
                            />
                        </div>
                        <div className="col-span-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Valeur Consom.</label>
                             <div className="flex mt-1">
                                <input 
                                    type="number" step="0.01"
                                    value={newItem.val} 
                                    onChange={(e) => setNewItem({...newItem, val: e.target.value})}
                                    className="w-full p-2 border-y border-l rounded-l bg-white dark:bg-slate-900 dark:border-slate-700"
                                    placeholder="0.00"
                                />
                                <select 
                                    value={newItem.type}
                                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                                    className="bg-slate-100 dark:bg-slate-800 border rounded-r px-2 text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-200"
                                >
                                    <option value="current">Amperès (A)</option>
                                    <option value="power">Watts (W)</option>
                                </select>
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={addItem}
                        className="w-full mt-2 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex justify-center items-center gap-2"
                    >
                        <Plus size={20}/> Ajouter à la liste
                    </button>
                </div>
            </SectionCard>
        </div>

        {/* COLONNE DROITE : BILAN */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* RÉSULTAT FLASH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Brut</div>
                    <div className="text-2xl font-mono font-bold text-slate-700 dark:text-white">
                        {totalCurrent.toFixed(2)} <span className="text-sm text-slate-400">A</span>
                    </div>
                    <div className="text-xs text-slate-400">{totalPower.toFixed(1)} W</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 shadow-sm md:col-span-2">
                    <div className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                        <Zap size={16}/> Alimentation Recommandée (Marge {safetyMargin}%)
                    </div>
                    <div className="flex items-baseline gap-4">
                        <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {recommendedCurrent.toFixed(2)} <span className="text-sm">A</span>
                        </div>
                        <div className="text-lg text-emerald-600/70">
                            soit {recommendedPower.toFixed(1)} W
                        </div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 inline-block px-2 py-1 rounded">
                        Standard conseillé : {typeof suggestedSize === 'number' ? `${suggestedSize} A` : suggestedSize}
                    </div>
                </div>
            </div>

            {/* TABLEAU DÉTAILLÉ */}
            <SectionCard title={`Détail des Consommateurs (${items.length})`} className="min-h-[400px]">
                {items.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Calculator size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>Aucun équipement ajouté.</p>
                        <p className="text-sm">Utilisez le formulaire à gauche pour construire votre bilan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3">Équipement</th>
                                    <th className="px-4 py-3 text-center">Qté</th>
                                    <th className="px-4 py-3 text-right">Unitaire</th>
                                    <th className="px-4 py-3 text-right font-bold text-indigo-600">Total (A)</th>
                                    <th className="px-4 py-3 text-right text-slate-400">Total (W)</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{item.name}</td>
                                        <td className="px-4 py-3 text-center text-slate-500">{item.qty}</td>
                                        <td className="px-4 py-3 text-right text-slate-500">
                                            {item.unitCurrent.toFixed(2)} A <span className="text-[10px] opacity-70">({item.unitPower.toFixed(1)}W)</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                            {item.totalCurrent.toFixed(2)} A
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-400 font-mono">
                                            {item.totalPower.toFixed(1)} W
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default PsuCalculator;