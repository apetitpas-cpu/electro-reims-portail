import React, { useState } from 'react';
import { FileCheck, AlertTriangle, Calendar, Paperclip, Info, Search, MousePointerClick, Plus, Trash2 } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const ArProcedure = () => {
  // --- STATE : Liste des cas particuliers ---
  const [specialCases, setSpecialCases] = useState([
    { id: 1, provider: 'HVS', rule: 'Délai = Date de départ' },
    { id: 2, provider: 'ELEMATIC', rule: 'Data speed = Date départ (+3 jours)' },
    { id: 3, provider: 'INTECH', rule: 'Compter 1 semaine' },
    { id: 4, provider: 'SCHMERSAL', rule: 'Délai de livraison = Date de départ' },
    { id: 5, provider: 'PUETTMANN', rule: 'Délai = Date livraison Agence Mondeville' },
    { id: 6, provider: 'TE-CONNECTIVITY', rule: 'Délai prévu = Date de livraison' },
  ]);

  // État pour les champs d'ajout
  const [newProvider, setNewProvider] = useState('');
  const [newRule, setNewRule] = useState('');

  // --- ACTIONS ---
  const handleAdd = () => {
    if (newProvider.trim() && newRule.trim()) {
        setSpecialCases([
            ...specialCases, 
            { id: Date.now(), provider: newProvider, rule: newRule }
        ]);
        setNewProvider('');
        setNewRule('');
    }
  };

  const handleDelete = (id) => {
    setSpecialCases(specialCases.filter(c => c.id !== id));
  };

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Saisie des AR Fournisseurs" 
        subtitle="Procédure de validation et suivi des délais de livraison"
        icon={FileCheck}
      />

      <div className="space-y-8">

        {/* --- 1. OBJECTIF --- */}
        <SectionCard title="Objectif">
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Saisir des délais de livraison communiqués par les fournisseurs pour assurer un suivi des commandes et garantir le respect des délais de livraison.
            </p>
        </SectionCard>

        {/* --- 2. VÉRIFIER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard title="Points à Vérifier">
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2"><Search size={16} className="text-indigo-500"/> Référence</li>
                    <li className="flex items-center gap-2"><Search size={16} className="text-indigo-500"/> Prix total</li>
                    <li className="flex items-center gap-2"><Search size={16} className="text-indigo-500"/> Quantité</li>
                    <li className="flex items-center gap-2"><Search size={16} className="text-indigo-500"/> Frais de port</li>
                </ul>
            </SectionCard>

            <SectionCard className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10">
                <div className="flex gap-3">
                    <AlertTriangle className="text-orange-600 dark:text-orange-400 flex-none" size={24} />
                    <div>
                        <h4 className="font-bold text-orange-800 dark:text-orange-200 text-sm mb-1">Attention : Frais de port</h4>
                        <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                            Si les frais de port sont en <strong>SUS</strong> ou à la facturation mais qu'il n'y a <strong>pas de montant dans l'AR</strong> :
                            <br/>👉 Ne pas les enlever dans la commande.
                            <br/>👉 Envoyer un mail au fournisseur pour avoir confirmation.
                        </p>
                    </div>
                </div>
            </SectionCard>
        </div>

        {/* --- 3. RENTRER (SAISIE) --- */}
        <SectionCard title="Saisie dans GESCO (Rentrer)">
            <div className="flex items-center gap-6 mb-6 text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2"><MousePointerClick size={18} /> N° AR</div>
                <div className="flex items-center gap-2"><Calendar size={18} /> Date de livraison</div>
            </div>

            {/* Règles de dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Si date de livraison</div>
                    <div className="font-bold text-teal-600 dark:text-teal-400">Mettre date exacte</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Si date de départ</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">Rajouter 2 jours</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Si mention "Dispo"</div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">Mettre +3 jours ouvrés</div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                <Info size={14} /> Les délais se calculent en jours ouvrés (sans week-ends ni jours fériés).
            </div>
        </SectionCard>

        {/* --- 4. GLISSE PJ --- */}
        <SectionCard title="Gestion de la Pièce Jointe (Glisse PJ)" className="border-indigo-100 dark:border-indigo-900">
            <div className="flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                    <Paperclip size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Règle importante :</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        Si pas de délai indiqué sur l'AR : <span className="text-red-600 dark:text-red-400 font-bold uppercase">Ne rien rentrer !</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Ne glisser que la PJ (le fichier PDF) sans modifier les champs de date.
                    </p>
                </div>
            </div>
        </SectionCard>

        {/* --- 5. INFO DIVERSE (DYNAMIQUE) --- */}
        <SectionCard title="Info Diverse : Cas Particuliers">
            {/* Liste existante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                {specialCases.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2 group hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded transition-colors">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.provider}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-600 dark:text-slate-400 text-right text-xs">{item.rule}</span>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-1"
                                title="Supprimer la ligne"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 items-end">
                <div className="w-full md:w-1/3">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nouveau Fournisseur</label>
                    <input 
                        type="text" 
                        value={newProvider}
                        onChange={(e) => setNewProvider(e.target.value)}
                        placeholder="Ex: PHOENIX CONTACT"
                        className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="w-full md:flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Règle de délai</label>
                    <input 
                        type="text" 
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        placeholder="Ex: Date départ + 1 semaine"
                        className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <button 
                    onClick={handleAdd}
                    disabled={!newProvider || !newRule}
                    className="bg-indigo-600 disabled:bg-slate-300 text-white p-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center min-w-[40px]"
                >
                    <Plus size={20} />
                </button>
            </div>
        </SectionCard>

      </div>
    </PageContainer>
  );
};

export default ArProcedure;