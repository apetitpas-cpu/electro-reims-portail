import React, { useState, useEffect } from 'react';
import { Binary, ArrowRightLeft, Hash } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput } from '../components/UI';

const DataConverter = () => {
  const [dec, setDec] = useState(0);
  const [hex, setHex] = useState('0');
  const [bin, setBin] = useState('0');
  const [bits, setBits] = useState(Array(16).fill(false));

  // Mise à jour depuis Décimal
  const updateFromDec = (val) => {
    const v = parseInt(val) || 0;
    setDec(v);
    setHex(v.toString(16).toUpperCase());
    setBin(v.toString(2));
    updateBits(v);
  };

  // Mise à jour depuis Hexa
  const updateFromHex = (val) => {
    setHex(val.toUpperCase());
    const v = parseInt(val, 16) || 0;
    setDec(v);
    setBin(v.toString(2));
    updateBits(v);
  };

  // Mise à jour depuis Binaire
  const updateFromBin = (val) => {
    // Nettoyage caractères non binaires
    const clean = val.replace(/[^0-1]/g, '');
    setBin(clean);
    const v = parseInt(clean, 2) || 0;
    setDec(v);
    setHex(v.toString(16).toUpperCase());
    updateBits(v);
  };

  // Mise à jour des checkbox bits
  const updateBits = (val) => {
    const newBits = [];
    for(let i=0; i<16; i++) {
        newBits.push(!!((val >> i) & 1));
    }
    setBits(newBits);
  };

  // Toggle Bit individuel
  const toggleBit = (index) => {
    let newVal = dec;
    if (bits[index]) newVal &= ~(1 << index); // Clear bit
    else newVal |= (1 << index); // Set bit
    updateFromDec(newVal);
  };

  // Conversion Float IEEE754 (Hex -> Float)
  const getFloatValue = () => {
    // On simule un buffer de 4 octets
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, dec, false); // Big Endian par défaut
    return view.getFloat32(0, false);
  };

  return (
    <PageContainer>
      <BrandHeader title="Convertisseur de Données" subtitle="Décimal, Hexa, Binaire & Float" icon={Binary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CONVERSION BASIQUE */}
        <SectionCard title="Conversions Entières (Word / DWord)">
            <div className="space-y-4">
                <FormInput label="Décimal" value={dec} onChange={(e) => updateFromDec(e.target.value)} type="number" />
                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Hexadécimal (16#)" value={hex} onChange={(e) => updateFromHex(e.target.value)} prefix="0x" />
                    <FormInput label="Binaire (2#)" value={bin} onChange={(e) => updateFromBin(e.target.value)} />
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-500 uppercase"><Hash size={14}/> Décomposition Binaire (16 bits)</div>
                <div className="flex flex-row-reverse justify-center gap-1 overflow-x-auto py-2">
                    {bits.map((b, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => toggleBit(i)}>
                            <div className={`w-3 h-8 rounded border transition-colors ${b ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-100 border-slate-300 dark:bg-slate-800'}`}></div>
                            <span className="text-[9px] font-mono text-slate-400 group-hover:text-indigo-500">{i}</span>
                        </div>
                    )).reverse()} {/* On inverse l'affichage pour avoir bit 15 à gauche */}
                </div>
            </div>
        </SectionCard>

        {/* INTERPRÉTATION FLOTTANTE */}
        <SectionCard title="Décodage Avancé (IEEE-754)">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Valeur brute (Hex)</div>
                <div className="font-mono text-xl font-bold text-slate-700 dark:text-slate-300 mb-6 tracking-widest">{hex.padStart(8, '0')}</div>
                
                <div className="inline-flex items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm mb-6">
                    <ArrowRightLeft className="text-slate-400 rotate-90" />
                </div>

                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Interprétation Float (Real)</div>
                <div className="font-mono text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {getFloatValue().toFixed(4)}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Utile pour lire des températures ou mesures via Modbus</p>
            </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
};
export default DataConverter;