import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, RefreshCw } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, ResultStat } from '../components/UI';

const AnalogScaling = () => {
  // Entrées
  const [inputVal, setInputVal] = useState(13824); // Valeur brute (ex: moitié de 27648)
  
  // Plage Entrée (Raw)
  const [inMin, setInMin] = useState(0);
  const [inMax, setInMax] = useState(27648); // Standard Siemens
  
  // Plage Sortie (Engineering)
  const [outMin, setOutMin] = useState(0);
  const [outMax, setOutMax] = useState(100);

  const [result, setResult] = useState(0);
  const [currentMa, setCurrentMa] = useState(0); // Simulation 4-20mA

  useEffect(() => {
    const i = parseFloat(inputVal) || 0;
    const iMin = parseFloat(inMin) || 0;
    const iMax = parseFloat(inMax) || 0;
    const oMin = parseFloat(outMin) || 0;
    const oMax = parseFloat(outMax) || 0;

    if (iMax === iMin) return;

    // Formule linéaire : Y = (X - Xmin) * (Ymax - Ymin) / (Xmax - Xmin) + Ymin
    const slope = (oMax - oMin) / (iMax - iMin);
    const val = (i - iMin) * slope + oMin;
    
    setResult(val);

    // Calcul théorique courant (si c'était du 4-20mA sur 0-27648)
    const ma = ((i - 0) * (20 - 4) / (27648 - 0)) + 4;
    setCurrentMa(ma);

  }, [inputVal, inMin, inMax, outMin, outMax]);

  return (
    <PageContainer>
      <BrandHeader title="Mise à l'échelle (Scaling)" subtitle="Conversion Linéaire & Analogique" icon={Activity} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PARAMETRES */}
        <div className="lg:col-span-5 space-y-6">
            <SectionCard title="1. Plages de conversion">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Entrée (Raw)</span>
                        <FormInput label="Min (X1)" value={inMin} onChange={(e) => setInMin(e.target.value)} />
                        <FormInput label="Max (X2)" value={inMax} onChange={(e) => setInMax(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Sortie (Eng)</span>
                        <FormInput label="Min (Y1)" value={outMin} onChange={(e) => setOutMin(e.target.value)} />
                        <FormInput label="Max (Y2)" value={outMax} onChange={(e) => setOutMax(e.target.value)} />
                    </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <FormInput label="Valeur à convertir (X)" value={inputVal} onChange={(e) => setInputVal(e.target.value)} type="number" />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <button onClick={()=>setInputVal(inMin)} className="hover:text-indigo-500">Min</button>
                        <button onClick={()=>setInputVal((parseFloat(inMax)+parseFloat(inMin))/2)} className="hover:text-indigo-500">50%</button>
                        <button onClick={()=>setInputVal(inMax)} className="hover:text-indigo-500">Max</button>
                    </div>
                </div>
            </SectionCard>
        </div>

        {/* VISUALISATION */}
        <div className="lg:col-span-7">
            <SectionCard title="2. Résultat">
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                    <span className="text-sm font-bold text-slate-400 uppercase mb-2">Valeur Calculée (Y)</span>
                    <div className="text-6xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-tighter">
                        {result.toFixed(2)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ResultStat label="Simulation 4-20mA" value={currentMa.toFixed(2)} unit="mA" color="blue" />
                    <ResultStat label="Pourcentage" value={((inputVal - inMin)/(inMax - inMin)*100).toFixed(1)} unit="%" color="orange" />
                </div>
                
                <div className="mt-6 text-xs text-slate-500 italic text-center">
                    Formule : Y = (X - Xmin) * (Ymax - Ymin) / (Xmax - Xmin) + Ymin
                </div>
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};
export default AnalogScaling;