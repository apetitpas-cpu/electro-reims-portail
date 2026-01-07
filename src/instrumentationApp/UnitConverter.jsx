import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Gauge, Thermometer, Droplets, Waves, Ruler } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const UnitConverter = () => {
  const [category, setCategory] = useState('pressure');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState(0);

  // --- CONFIGURATION DES UNITÉS ---
  // Facteur de conversion vers une unité de base arbitraire (ex: Pascal pour pression)
  const DATA = {
    pressure: {
      label: "Pression",
      icon: Gauge,
      color: "text-indigo-600",
      units: {
        bar: { name: "Bar", factor: 100000 },
        mbar: { name: "Millibar (mbar)", factor: 100 },
        pa: { name: "Pascal (Pa)", factor: 1 },
        kpa: { name: "Kilopascal (kPa)", factor: 1000 },
        mpa: { name: "Mégapascal (MPa)", factor: 1000000 },
        psi: { name: "PSI", factor: 6894.76 },
        mmh2o: { name: "mmH2O (Col. d'eau)", factor: 9.80665 },
        mmhg: { name: "mmHg (Torr)", factor: 133.322 }
      }
    },
    flow: {
      label: "Débit Volumique",
      icon: Waves,
      color: "text-cyan-600",
      units: {
        m3h: { name: "m³/h", factor: 1 }, // Base
        lmin: { name: "l/min", factor: 0.06 },
        ls: { name: "l/s", factor: 3.6 },
        lh: { name: "l/h", factor: 0.001 },
        gpm: { name: "US GPM", factor: 0.227125 }
      }
    },
    length: {
      label: "Niveau / Distance",
      icon: Ruler,
      color: "text-blue-600",
      units: {
        m: { name: "Mètre (m)", factor: 1 }, // Base
        cm: { name: "Centimètre (cm)", factor: 0.01 },
        mm: { name: "Millimètre (mm)", factor: 0.001 },
        in: { name: "Pouce (inch)", factor: 0.0254 },
        ft: { name: "Pied (ft)", factor: 0.3048 }
      }
    },
    temperature: {
      label: "Température",
      icon: Thermometer,
      color: "text-red-600",
      units: {
        c: { name: "Celsius (°C)" },
        f: { name: "Fahrenheit (°F)" },
        k: { name: "Kelvin (K)" }
      }
    }
  };

  // Initialisation des unités quand on change de catégorie
  useEffect(() => {
    const keys = Object.keys(DATA[category].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [category]);

  // Calcul dynamique
  useEffect(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
        setResult("---");
        return;
    }

    // Cas spécial Température (Non linéaire)
    if (category === 'temperature') {
        let res = val;
        // 1. Convertir vers Celsius
        let tempC = val;
        if (fromUnit === 'f') tempC = (val - 32) * 5/9;
        if (fromUnit === 'k') tempC = val - 273.15;
        
        // 2. Convertir vers Cible
        if (toUnit === 'c') res = tempC;
        if (toUnit === 'f') res = (tempC * 9/5) + 32;
        if (toUnit === 'k') res = tempC + 273.15;
        
        setResult(res);
        return;
    }

    // Cas Standard (Facteur linéaire)
    const factorFrom = DATA[category].units[fromUnit]?.factor || 1;
    const factorTo = DATA[category].units[toUnit]?.factor || 1;
    
    // Formule : Valeur * (FacteurSource / FacteurCible)
    const res = val * (factorFrom / factorTo);
    setResult(res);

  }, [value, fromUnit, toUnit, category]);

  const Icon = DATA[category].icon;

  return (
    <PageContainer>
      <BrandHeader 
        title="Convertisseur Unités" 
        subtitle="Outil de conversion rapide pour l'instrumentation"
        icon={ArrowRightLeft}
      />

      {/* SÉLECTEUR DE CATÉGORIE */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(DATA).map(([key, info]) => (
            <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${category === key ? `bg-white dark:bg-slate-800 border-indigo-500 shadow-md ${info.color}` : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-800'}`}
            >
                <info.icon size={20} />
                <span className="font-bold">{info.label}</span>
            </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <SectionCard className="border-t-4 border-t-indigo-500">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
                
                {/* SOURCE */}
                <div className="md:col-span-3 space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">De (Source)</label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input 
                            type="number" 
                            value={value} 
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full bg-transparent text-3xl font-bold text-slate-700 dark:text-white outline-none mb-2"
                            placeholder="0"
                        />
                        <select 
                            value={fromUnit} 
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                        >
                            {Object.entries(DATA[category].units).map(([key, u]) => (
                                <option key={key} value={key}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ICONE CENTRALE */}
                <div className="md:col-span-1 flex justify-center">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-500">
                        <ArrowRightLeft size={24} />
                    </div>
                </div>

                {/* CIBLE */}
                <div className="md:col-span-3 space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vers (Cible)</label>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900">
                        <div className="w-full bg-transparent text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 truncate">
                            {typeof result === 'number' ? result.toLocaleString('fr-FR', { maximumFractionDigits: 4 }) : result}
                        </div>
                        <select 
                            value={toUnit} 
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg p-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 outline-none cursor-pointer"
                        >
                            {Object.entries(DATA[category].units).map(([key, u]) => (
                                <option key={key} value={key}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

            </div>
        </SectionCard>
      </div>

    </PageContainer>
  );
};

export default UnitConverter;