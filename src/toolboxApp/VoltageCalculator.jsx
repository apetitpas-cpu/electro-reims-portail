import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect, ResultStat } from '../components/UI';

const VoltageCalculator = () => {
  const [voltage, setVoltage] = useState(24);
  const [current, setCurrent] = useState(2); // Ampères
  const [length, setLength] = useState(50); // Mètres
  const [section, setSection] = useState(1.5); // mm²
  const [material, setMaterial] = useState(0.017); // Cuivre

  const [result, setResult] = useState({ drop: 0, endVoltage: 0, percent: 0, status: 'ok' });

  useEffect(() => {
    // Formule : dU = b * (rho * L * I) / S
    // b = 2 (Aller-retour pour DC/Monophasé)
    const drop = (2 * material * length * current) / section;
    const endV = voltage - drop;
    const percent = (drop / voltage) * 100;
    
    let status = 'ok';
    if(percent > 5) status = 'warning';
    if(percent > 10) status = 'critical';

    setResult({ drop, endVoltage: endV, percent, status });
  }, [voltage, current, length, section, material]);

  return (
    <PageContainer>
      <BrandHeader title="Chute de Tension" subtitle="Validation section de câble (DC / Mono)" icon={Zap} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <SectionCard title="Paramètres Câble">
                <FormInput label="Tension Départ (V)" type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} />
                <FormInput label="Courant (A)" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} />
                <FormInput label="Longueur (m)" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                <FormSelect label="Section (mm²)" value={section} onChange={(e) => setSection(e.target.value)} 
                    options={[0.22, 0.5, 0.75, 1.5, 2.5, 4, 6, 10, 16].map(v => ({value: v, label: v + ' mm²'}))} 
                />
            </SectionCard>
        </div>

        <div className="lg:col-span-2">
            <SectionCard title="Résultat à l'arrivée">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <ResultStat label="Chute (V)" value={result.drop.toFixed(2)} unit="V" color="orange" />
                    <ResultStat label="Tension Arrivée" value={result.endVoltage.toFixed(2)} unit="V" color={result.status === 'ok' ? 'green' : 'red'} />
                    <ResultStat label="Chute (%)" value={result.percent.toFixed(1)} unit="%" color={result.status === 'ok' ? 'green' : 'red'} />
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-4 ${result.status === 'ok' ? 'bg-green-50 border-green-200 text-green-800' : result.status === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {result.status === 'ok' ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                    <div>
                        <h4 className="font-bold mb-1">{result.status === 'ok' ? 'Câblage Conforme' : result.status === 'warning' ? 'Chute de tension notable' : 'Non Conforme'}</h4>
                        <p className="text-xs opacity-90">
                            {result.status === 'ok' && "La chute de tension est inférieure à 5%."}
                            {result.status === 'warning' && "La chute est entre 5% et 10%. Vérifiez la sensibilité de l'équipement."}
                            {result.status === 'critical' && "La chute dépasse 10%. Risque de dysfonctionnement. Augmentez la section !"}
                        </p>
                    </div>
                </div>
            </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};
export default VoltageCalculator;