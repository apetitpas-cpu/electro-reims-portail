import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, AlertTriangle, Printer, Award, XCircle } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const HardeningChecklist = () => {
  
  // --- DEFINITION DE LA CHECKLIST ---
  const INITIAL_ITEMS = [
    { id: 1, category: "Accès & Administration", text: "Mot de passe 'admin' changé (complexe)", weight: 10, checked: false },
    { id: 2, category: "Accès & Administration", text: "Compte 'admin' désactivé (utiliser un compte nominatif)", weight: 5, checked: false },
    { id: 3, category: "Accès & Administration", text: "Accès SSH désactivé sur interface WAN", weight: 10, checked: false },
    { id: 4, category: "Accès & Administration", text: "Timeout de session configuré (ex: 10 min)", weight: 2, checked: false },
    
    { id: 5, category: "Filtrage & Règles", text: "Règle 'Clean-up' (Block All) en fin de politique", weight: 10, checked: false },
    { id: 6, category: "Filtrage & Règles", text: "Pas de règle 'Any Any Pass' temporaire oubliée", weight: 10, checked: false },
    { id: 7, category: "Filtrage & Règles", text: "Inspection IPS activée sur les flux critiques", weight: 5, checked: false },
    { id: 8, category: "Filtrage & Règles", text: "Filtrage GeoIP actif (Bloquer pays à risque)", weight: 5, checked: false },

    { id: 9, category: "Système & Logs", text: "NTP configuré et synchronisé", weight: 2, checked: false },
    { id: 10, category: "Système & Logs", text: "Logs activés sur les règles implicites (Block)", weight: 5, checked: false },
    { id: 11, category: "Système & Logs", text: "Sauvegarde de la configuration effectuée", weight: 10, checked: false },
  ];

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [score, setScore] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  // --- CALCUL DU SCORE ---
  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.weight, 0);
    const current = items.reduce((acc, item) => item.checked ? acc + item.weight : acc, 0);
    setTotalWeight(total);
    setScore(Math.round((current / total) * 100));
  }, [items]);

  const toggleItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <PageContainer>
      <BrandHeader 
        title="Checklist Hardening" 
        subtitle="Audit de sécurité et bonnes pratiques Stormshield (ANSSI)"
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- GAUCHE : CHECKLIST --- */}
        <div className="lg:col-span-8 space-y-8">
            {categories.map(cat => (
                <SectionCard key={cat} title={cat}>
                    <div className="space-y-3">
                        {items.filter(i => i.category === cat).map(item => (
                            <label key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${item.checked ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={item.checked} 
                                    onChange={() => toggleItem(item.id)}
                                    className="mt-1 w-5 h-5 accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className={`text-sm font-medium ${item.checked ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {item.text}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                    +{item.weight} pts
                                </span>
                            </label>
                        ))}
                    </div>
                </SectionCard>
            ))}
        </div>

        {/* --- DROITE : SCORE STICKY --- */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
            <SectionCard title="Score de Sécurité" className="text-center">
                <div className="relative flex items-center justify-center mb-6">
                    {/* Cercle Score */}
                    <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-3xl font-bold transition-colors ${
                        score < 50 ? 'border-red-500 text-red-600 bg-red-50' : 
                        score < 80 ? 'border-orange-500 text-orange-600 bg-orange-50' : 
                        'border-emerald-500 text-emerald-600 bg-emerald-50'
                    }`}>
                        {score}%
                    </div>
                </div>

                <div className="space-y-4">
                    {score < 100 && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            Il reste <strong>{items.filter(i => !i.checked).length}</strong> points à vérifier.
                        </div>
                    )}
                    
                    <button 
                        onClick={() => window.print()}
                        className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700 flex items-center justify-center gap-2"
                    >
                        <Printer size={18} /> Imprimer le Rapport
                    </button>
                </div>
            </SectionCard>

            {/* Note Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3 items-start">
                <Award className="text-blue-600 flex-none" size={20} />
                <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    Ce score est indicatif. Une conformité à 100% ne garantit pas une sécurité absolue, mais réduit drastiquement la surface d'attaque.
                </p>
            </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default HardeningChecklist;