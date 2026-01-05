import React, { useState, useEffect } from 'react';
import { Activity, Database, Network } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect, ResultStat } from '../components/UI';

const ProfinetCalculator = () => {
  // --- STATE ---
  const [deviceCount, setDeviceCount] = useState(10);
  const [refreshTime, setRefreshTime] = useState(2); // ms
  const [protocol, setProtocol] = useState('RT'); // 'RT' ou 'IRT'
  const [networkSpeed, setNetworkSpeed] = useState(100); // 100 ou 1000 Mbps (Nouveau)
  
  // Composition des données
  const [dataConfig, setDataConfig] = useState({
    bools: 0,   // 1 bit
    bytes: 0,   // 8 bits
    ints: 0,    // 16 bits
    reals: 0    // 32 bits (Real/DWord)
  });

  const [results, setResults] = useState({ 
    payload: 0,
    pps: 0, 
    bandwidth: 0, 
    load: 0 
  });

  // --- LOGIQUE DE CALCUL ---
  useEffect(() => {
    // 1. Calcul de la charge utile (Payload) en Octets
    const totalBits = 
      (dataConfig.bools * 1) + 
      (dataConfig.bytes * 8) + 
      (dataConfig.ints * 16) + 
      (dataConfig.reals * 32);
    
    // On convertit en octets (arrondi supérieur)
    const calculatedPayload = Math.ceil(totalBits / 8);

    // 2. Taille de trame sur le câble (Wire Size)
    // En-tête : Ethernet (14) + VLAN (4) + Header Profinet (variable). Moyenne safe : 34 octets.
    const headers = 34; 
    
    // Règle Ethernet : taille min trame = 64 octets (padding si nécessaire)
    let frameSize = Math.max(64, calculatedPayload + headers);
    
    // Ajout Overhead physique (Préambule 8 + Inter-Frame Gap 12) = 20 octets
    const totalWireSize = frameSize + 20; 

    // 3. Calcul des paquets par seconde (PPS)
    // Bidirectionnel : 1 requête + 1 réponse par cycle
    const packetsPerSecondPerDevice = (1000 / refreshTime) * 2;
    const totalPPS = packetsPerSecondPerDevice * deviceCount;
    
    // 4. Bande passante consommée (Mbps)
    const bandwidthMbps = (totalPPS * totalWireSize * 8) / 1_000_000;

    // 5. Charge estimée (En fonction de la vitesse choisie !)
    const loadPercent = (bandwidthMbps / networkSpeed) * 100;

    setResults({
      payload: calculatedPayload,
      pps: totalPPS.toLocaleString(),
      bandwidth: bandwidthMbps.toFixed(2),
      load: loadPercent.toFixed(1)
    });

  }, [deviceCount, refreshTime, protocol, dataConfig, networkSpeed]);

  // Helper pour modifier la config de données
  const updateData = (field, value) => {
    setDataConfig(prev => ({ ...prev, [field]: Math.max(0, parseInt(value) || 0) }));
  };

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Calculateur Profinet" 
        subtitle="Dimensionnement réseau, charge CPU et bande passante"
        icon={Activity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : Paramètres Réseau */}
        <div className="space-y-6">
            <SectionCard title="1. Configuration Réseau">
                <FormSelect 
                    label="Vitesse du lien (Câble)"
                    value={networkSpeed}
                    onChange={(e) => setNetworkSpeed(Number(e.target.value))}
                    options={[
                    { value: 100, label: "100 Mbit/s (Fast Ethernet)" },
                    { value: 1000, label: "1 Gbit/s (Gigabit)" },
                    ]}
                />

                <FormSelect 
                    label="Protocole"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    options={[
                    { value: "RT", label: "Profinet RT (Standard)" },
                    { value: "IRT", label: "Profinet IRT (Isochronous)" },
                    ]}
                />

                <FormInput 
                    label="Nombre d'appareils (IO-Devices)" 
                    type="number" 
                    value={deviceCount} 
                    onChange={(e) => setDeviceCount(Number(e.target.value))} 
                    suffix="Appareils"
                />

                <FormSelect 
                    label="Temps de Rafraîchissement"
                    value={refreshTime}
                    onChange={(e) => setRefreshTime(Number(e.target.value))}
                    options={[
                    { value: 1, label: "1 ms (Performance)" },
                    { value: 2, label: "2 ms (Standard)" },
                    { value: 4, label: "4 ms (Robuste)" },
                    { value: 8, label: "8 ms (Lent)" },
                    { value: 16, label: "16 ms (Eco)" },
                    ]}
                />
            </SectionCard>

            <SectionCard title="3. Analyse de Charge" className={Number(results.load) > 50 ? "border-red-200 bg-red-50" : ""}>
                {Number(results.load) < 15 && (
                <p className="text-green-700 font-medium text-sm">
                    ✅ <strong>Réseau Sain ({networkSpeed}M).</strong><br/>
                    Charge très faible ({results.load}%). Vous avez une marge confortable pour le trafic acyclique (Web, HMI, Caméras).
                </p>
                )}
                {Number(results.load) >= 15 && Number(results.load) < 50 && (
                <p className="text-orange-700 font-medium text-sm">
                    ⚠️ <strong>Charge Modérée.</strong><br/>
                    Le réseau commence à se charger. Évitez de chaîner trop de switchs en série.
                </p>
                )}
                {Number(results.load) >= 50 && (
                <div className="text-red-700 font-bold text-sm">
                    🚨 <strong>SATURATION IMMINENTE !</strong><br/>
                    <ul className="list-disc list-inside mt-2 font-normal text-red-800">
                        <li>Risque de perte de paquets Profinet.</li>
                        <li>Forte gigue (Jitter) à prévoir.</li>
                        {networkSpeed === 100 && (
                            <li className="font-bold mt-1">💡 Conseil : Passez votre infrastructure en Gigabit (1000 Mbps).</li>
                        )}
                        {networkSpeed === 1000 && (
                            <li className="font-bold mt-1">💡 Conseil : Revoyez l'architecture (Segmentez le réseau).</li>
                        )}
                    </ul>
                </div>
                )}
            </SectionCard>
        </div>

        {/* COLONNE CENTRALE : Composition Données */}
        <SectionCard title="2. Données Echangées (Par Appareil)">
            <div className="mb-4 flex items-center gap-2 text-indigo-600">
                <Database size={18} />
                <span className="text-xs font-bold uppercase">Définition des IO</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <FormInput 
                    label="Booléens (Bits)" 
                    type="number" 
                    value={dataConfig.bools} 
                    onChange={(e) => updateData('bools', e.target.value)}
                    placeholder="0"
                />
                <FormInput 
                    label="Entiers (Int - 16bits)" 
                    type="number" 
                    value={dataConfig.ints} 
                    onChange={(e) => updateData('ints', e.target.value)}
                    placeholder="0"
                />
                <FormInput 
                    label="Réels (Real/DWord - 32bits)" 
                    type="number" 
                    value={dataConfig.reals} 
                    onChange={(e) => updateData('reals', e.target.value)}
                    placeholder="0"
                />
                <FormInput 
                    label="Octets (Bytes - 8bits)" 
                    type="number" 
                    value={dataConfig.bytes} 
                    onChange={(e) => updateData('bytes', e.target.value)}
                    placeholder="0"
                />
            </div>

            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Taille Payload Calculée</div>
                <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {results.payload} <span className="text-sm text-slate-500">Octets</span>
                </div>
                {results.payload < 40 && (
                    <div className="text-[10px] text-orange-500 mt-1 italic">
                        *Padding Ethernet appliqué (Trame min 64o)
                    </div>
                )}
            </div>
        </SectionCard>

        {/* COLONNE DROITE : Résultats */}
        <div className="space-y-6">
          <SectionCard title="Résultats Globaux">
            <div className="space-y-4">
              <ResultStat 
                label="Total Paquets / sec" 
                value={results.pps} 
                unit="pps" 
                color="indigo" 
              />
              <ResultStat 
                label="Bande Passante Requise" 
                value={results.bandwidth} 
                unit="Mbps" 
                color={Number(results.load) > 80 ? "red" : "blue"} 
              />
              
              {/* Le label s'adapte à la vitesse choisie */}
              <ResultStat 
                label={`Charge Lien (${networkSpeed === 1000 ? '1G' : '100M'})`} 
                value={results.load} 
                unit="%" 
                color={Number(results.load) > 50 ? "red" : (Number(results.load) > 15 ? "orange" : "green")} 
              />
            </div>
          </SectionCard>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2 font-bold mb-2">
                  <Network size={16} /> Note Technique
              </div>
              <p className="opacity-80">
                  Le calcul inclut l'overhead Ethernet complet (Preamble + IFG = 20o) et considère un trafic bidirectionnel symétrique (Input + Output), typique des E/S déportées.
              </p>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default ProfinetCalculator;