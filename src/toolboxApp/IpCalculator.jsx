import React, { useState, useEffect } from 'react';
import { Network, Globe, Server } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput, ResultStat } from '../components/UI';

const IpCalculator = () => {
  const [ip, setIp] = useState('192.168.1.10');
  const [mask, setMask] = useState('24');
  const [results, setResults] = useState(null);

  useEffect(() => {
    try {
        const ipParts = ip.split('.').map(Number);
        if(ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) return;
        
        const maskBits = parseInt(mask);
        if(isNaN(maskBits) || maskBits < 0 || maskBits > 32) return;

        // Calcul binaire
        const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
        const maskNum = -1 << (32 - maskBits);
        
        const netNum = ipNum & maskNum;
        const bcNum = netNum | (~maskNum);
        
        const intToIp = (int) => [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join('.');

        const hosts = Math.pow(2, 32 - maskBits) - 2;

        setResults({
            network: intToIp(netNum),
            broadcast: intToIp(bcNum),
            first: intToIp(netNum + 1),
            last: intToIp(bcNum - 1),
            hosts: hosts > 0 ? hosts : 0,
            maskIp: intToIp(maskNum)
        });

    } catch(e) { setResults(null); }
  }, [ip, mask]);

  return (
    <PageContainer>
      <BrandHeader title="Calculateur IP (CIDR)" subtitle="Calcul de plages réseaux et masques" icon={Network} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard title="Paramètres">
            <FormInput label="Adresse IP" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" />
            <FormInput label="Masque (CIDR /XX)" value={mask} onChange={(e) => setMask(e.target.value)} type="number" placeholder="24" suffix={"/" + mask} />
            
            {results && (
                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
                    Masque décimal : <strong>{results.maskIp}</strong>
                </div>
            )}
        </SectionCard>

        {results && (
            <SectionCard title="Résultats">
                <div className="space-y-4">
                    <ResultStat label="Adresse Réseau" value={results.network} unit="" color="indigo" />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultStat label="Première IP" value={results.first} unit="" color="green" />
                        <ResultStat label="Dernière IP" value={results.last} unit="" color="green" />
                    </div>
                    <ResultStat label="Adresse Broadcast" value={results.broadcast} unit="" color="orange" />
                    <div className="text-center text-sm font-bold text-slate-500">
                        {results.hosts.toLocaleString()} machines disponibles
                    </div>
                </div>
            </SectionCard>
        )}
      </div>
    </PageContainer>
  );
};
export default IpCalculator;