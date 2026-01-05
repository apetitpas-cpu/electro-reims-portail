import React, { useState, useEffect } from 'react';
import { Zap, Settings } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect, ResultStat } from '../components/UI';

const PowerCalculator = () => {
  const [type, setType] = useState('tri'); // 'mono' | 'tri' | 'dc'
  const [voltage, setVoltage] = useState(400);
  const [current, setCurrent] = useState(10);
  const [cosPhi, setCosPhi] = useState(0.85);
  
  const [powerW, setPowerW] = useState(0);
  const [powerVA, setPowerVA] = useState(0);

  useEffect(() => {
    const u = parseFloat(voltage) || 0;
    const i = parseFloat(current) || 0;
    const phi = parseFloat(cosPhi) || 1;

    let p = 0; // Active (W)
    let s = 0; // Apparente (VA)

    if (type === 'dc') {
        p = u * i;
        s = p; 
    } else if (type === 'mono') {
        s = u * i;
        p = s * phi;
    } else if (type === 'tri') {
        s = u * i * Math.sqrt(3);
        p = s * phi;
    }

    setPowerW(p);
    setPowerVA(s);
  }, [type, voltage, current, cosPhi]);

  return (
    <PageContainer>
      <BrandHeader title="Calculateur de Puissance" subtitle="Loi d'Ohm, Moteurs & Résistances" icon={Zap} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <SectionCard title="Paramètres">
                <FormSelect label="Type de circuit" value={type} onChange={(e) => {
                    setType(e.target.value);
                    if(e.target.value === 'tri') setVoltage(400);
                    if(e.target.value === 'mono') setVoltage(230);
                    if(e.target.value === 'dc') { setVoltage(24); setCosPhi(1); }
                }} 
                options={[
                    {value: 'tri', label: 'Triphasé (AC)'},
                    {value: 'mono', label: 'Monophasé (AC)'},
                    {value: 'dc', label: 'Courant Continu (DC)'}
                ]} />
                
                <FormInput label="Tension (U)" value={voltage} onChange={(e) => setVoltage(e.target.value)} suffix="Volts" type="number"/>
                <FormInput label="Courant (I)" value={current} onChange={(e) => setCurrent(e.target.value)} suffix="Ampères" type="number"/>
                
                {type !== 'dc' && (
                    <FormInput label="Cos φ (Facteur puissance)" value={cosPhi} onChange={(e) => setCosPhi(e.target.value)} type="number" placeholder="0.85" />
                )}
            </SectionCard>
        </div>

        <div className="lg:col-span-2">
            <SectionCard title="Puissance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultStat label="Puissance Active (P)" value={(powerW/1000).toFixed(2)} unit="kW" color="orange" />
                    <ResultStat label="Puissance Apparente (S)" value={(powerVA/1000).toFixed(2)} unit="kVA" color="indigo" />
                </div>
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-mono">
                    {type === 'tri' && `P = U x I x √3 x cosφ = ${voltage} x ${current} x 1.732 x ${cosPhi}`}
                    {type === 'mono' && `P = U x I x cosφ = ${voltage} x ${current} x ${cosPhi}`}
                    {type === 'dc' && `P = U x I = ${voltage} x ${current}`}
                </div>
            </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};
export default PowerCalculator;