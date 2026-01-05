import React, { useState, useEffect } from 'react';
import { Thermometer, ArrowRightLeft } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, ResultStat } from '../components/UI';

const Pt100Calculator = () => {
  const [mode, setMode] = useState('tempToOhm'); // ou 'ohmToTemp'
  const [inputVal, setInputVal] = useState(0);
  const [result, setResult] = useState(0);

  // Approximation Callendar-Van Dusen (Simplifiée pour usage industriel > 0°C)
  // R(t) = R0 * (1 + A*t + B*t^2)
  const R0 = 100;
  const A = 3.9083e-3;
  const B = -5.775e-7;

  useEffect(() => {
    const val = parseFloat(inputVal);
    if(isNaN(val)) return;

    if (mode === 'tempToOhm') {
        // T -> R
        const t = val;
        let r = 0;
        if(t >= 0) r = R0 * (1 + A*t + B*t*t);
        else r = R0 * (1 + A*t + B*t*t - 100*t*t*t + 100*t*t*t*t); // Approximation simple pour <0
        setResult(r);
    } else {
        // R -> T (Approximation quadratique inversée pour T > 0)
        // R = R0(1 + At + Bt2) => Bt2 + At + (1 - R/R0) = 0
        const R = val;
        const c = 1 - (R/R0);
        // Solution équation second degré : (-A + sqrt(A^2 - 4Bc)) / 2B
        const t = (-A + Math.sqrt(A*A - 4*B*c)) / (2*B);
        setResult(t);
    }
  }, [inputVal, mode]);

  return (
    <PageContainer>
      <BrandHeader title="Calculateur PT100" subtitle="Conversion Température ↔ Résistance" icon={Thermometer} />
      
      <div className="max-w-3xl mx-auto">
        {/* SWAPPER */}
        <div className="flex justify-center mb-8">
            <button onClick={() => setMode(mode === 'tempToOhm' ? 'ohmToTemp' : 'tempToOhm')} className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all">
                <span className={`font-bold ${mode === 'tempToOhm' ? 'text-indigo-600' : 'text-slate-400'}`}>°C</span>
                <ArrowRightLeft size={20} className="text-slate-400"/>
                <span className={`font-bold ${mode === 'ohmToTemp' ? 'text-indigo-600' : 'text-slate-400'}`}>Ohms (Ω)</span>
            </button>
        </div>

        <SectionCard>
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full max-w-xs">
                    <FormInput 
                        label={mode === 'tempToOhm' ? "Température (°C)" : "Résistance Mesurée (Ω)"} 
                        value={inputVal} 
                        onChange={(e) => setInputVal(e.target.value)} 
                        type="number"
                        placeholder="Ex: 100"
                    />
                </div>
                
                <div className="w-full h-px bg-slate-100 dark:bg-slate-700"></div>

                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Résultat</span>
                    <div className="text-5xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {result.toFixed(2)} <span className="text-xl text-slate-500">{mode === 'tempToOhm' ? 'Ω' : '°C'}</span>
                    </div>
                </div>
            </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
export default Pt100Calculator;