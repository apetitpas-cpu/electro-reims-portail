import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput } from '../components/UI';

const MarginCalculator = () => {
  // --- STATE ---
  const [mode, setMode] = useState('findPrice'); // 'findPrice' = Trouver le Prix de Vente | 'findMargin' = Trouver la Marge
  
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [marginPercent, setMarginPercent] = useState("");
  
  const [result, setResult] = useState({
    value: 0,      // Le résultat principal (Prix ou %)
    grossMargin: 0 // Le gain en euros
  });

  // --- CALCULS SIMPLES ---
  useEffect(() => {
    const pa = parseFloat(purchasePrice) || 0;

    if (mode === 'findPrice') {
        // SCÉNARIO 1 : Je veux mon PRIX DE VENTE selon une marge souhaitée
        // Formule Marge Commerciale : PV = PA / (1 - Taux%)
        const margin = parseFloat(marginPercent) || 0;
        
        if (pa > 0 && margin < 100) {
            const pv = pa / (1 - (margin / 100));
            setResult({
                value: pv,
                grossMargin: pv - pa
            });
        } else {
            setResult({ value: 0, grossMargin: 0 });
        }
    } 
    else {
        // SCÉNARIO 2 : Je veux connaître ma MARGE réelle sur une vente
        // Formule : Marge % = ((PV - PA) / PV) * 100
        const pv = parseFloat(sellingPrice) || 0;
        
        if (pa > 0 && pv > 0) {
            const gross = pv - pa;
            const marginRate = (gross / pv) * 100;
            setResult({
                value: marginRate,
                grossMargin: gross
            });
        } else {
            setResult({ value: 0, grossMargin: 0 });
        }
    }
  }, [purchasePrice, sellingPrice, marginPercent, mode]);

  // Reset lors du changement de mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setPurchasePrice("");
    setSellingPrice("");
    setMarginPercent("");
  };

  return (
    <PageContainer>
      <BrandHeader 
        title="Calculateur de Marge" 
        subtitle="Simulateur de prix simplifié"
        icon={Calculator}
      />

      {/* SÉLECTEUR DE MODE */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 inline-flex">
            <button 
                onClick={() => switchMode('findPrice')} 
                className={`px-6 py-2 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${mode === 'findPrice' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
                <TrendingUp size={16} /> Calculer un Prix
            </button>
            <button 
                onClick={() => switchMode('findMargin')} 
                className={`px-6 py-2 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${mode === 'findMargin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
                <RefreshCw size={16} /> Calculer une Marge
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- ZONE DE SAISIE --- */}
        <SectionCard title="1. Saisie">
            <div className="space-y-6">
                
                {/* Prix d'Achat (Toujours présent) */}
                <FormInput 
                    label="Prix d'Achat (HT)" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(e.target.value)} 
                    placeholder="0.00"
                    suffix="€"
                    type="number"
                />

                {/* Champ dynamique selon le mode */}
                {mode === 'findPrice' ? (
                    <div className="animate-in fade-in slide-in-from-left-2">
                        <FormInput 
                            label="Marge souhaitée" 
                            value={marginPercent} 
                            onChange={(e) => setMarginPercent(e.target.value)} 
                            placeholder="ex: 25"
                            suffix="%"
                            type="number"
                        />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-2">
                        <FormInput 
                            label="Prix de Vente (HT)" 
                            value={sellingPrice} 
                            onChange={(e) => setSellingPrice(e.target.value)} 
                            placeholder="0.00"
                            suffix="€"
                            type="number"
                        />
                    </div>
                )}
            </div>
        </SectionCard>


        {/* --- ZONE DE RÉSULTAT --- */}
        <SectionCard title="2. Résultat" className="text-center h-full flex flex-col justify-center bg-slate-50 dark:bg-slate-800/50">
            
            {/* Résultat Principal */}
            <div className="mb-8">
                <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                    {mode === 'findPrice' ? 'Prix de Vente (HT)' : 'Marge Réalisée'}
                </span>
                <div className={`text-6xl font-bold tracking-tighter ${result.grossMargin < 0 ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {mode === 'findPrice' 
                        ? (result.value).toFixed(2) + " €"
                        : (result.value).toFixed(2) + " %"
                    }
                </div>
            </div>

            {/* Marge Brute (Gain en €) */}
            <div className="inline-block mx-auto px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Gain Net (Marge Brute)</div>
                <div className={`text-2xl font-bold ${result.grossMargin < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {result.grossMargin > 0 ? '+' : ''}{result.grossMargin.toFixed(2)} €
                </div>
            </div>

        </SectionCard>

      </div>
    </PageContainer>
  );
};

export default MarginCalculator;