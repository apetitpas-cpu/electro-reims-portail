import React, { useState, useEffect } from 'react';
// CORRECTION ICI : On utilise ArrowLeftRight au lieu de ArrowRightArrowLeft
import { Lock, ArrowLeftRight, FileKey } from 'lucide-react';
// On réutilise vos composants UI existants
import { PageContainer, BrandHeader, SectionCard, FormInput, FormSelect } from '../components/UI';

const VpnGenerator = () => {
  // --- STATE ---
  const [config, setConfig] = useState({
    name: "Tunnel_Siège_Usine",
    psk: "MonSecretTresSecurise123!",
    algo: "aes256-sha256",
    // Site A (Local / Siège)
    siteA_PublicIp: "80.14.22.10",
    siteA_Subnet: "192.168.1.0/24",
    // Site B (Distant / Usine)
    siteB_PublicIp: "45.12.33.44",
    siteB_Subnet: "192.168.10.0/24",
  });

  const [output, setOutput] = useState("");

  // --- LOGIQUE DE GÉNÉRATION ---
  useEffect(() => {
    // On simule une génération de fichier de configuration (Format textuel)
    const generateConfig = () => {
      const { name, psk, algo, siteA_PublicIp, siteA_Subnet, siteB_PublicIp, siteB_Subnet } = config;
      
      return `
# --- CONFIGURATION VPN IPSEC : ${name} ---
# Généré le : ${new Date().toLocaleDateString()}

# --- PHASE 1 (IKE) ---
conn ${name}
    authby=secret
    auto=start
    keyexchange=ikev2
    ike=${algo};modp2048
    ikelifetime=24h

# --- PHASE 2 (ESP) ---
    esp=${algo}
    lifetime=1h
    
# --- ADRESSAGE ---
    # Site Local (Ici)
    left=${siteA_PublicIp}
    leftsubnet=${siteA_Subnet}
    leftid=@${siteA_PublicIp}

    # Site Distant (Là-bas)
    right=${siteB_PublicIp}
    rightsubnet=${siteB_Subnet}
    rightid=@${siteB_PublicIp}

# --- SECRET PARTAGÉ (PSK) ---
# A mettre dans ipsec.secrets :
${siteA_PublicIp} ${siteB_PublicIp} : PSK "${psk}"
      `;
    };

    setOutput(generateConfig());
  }, [config]);

  // Helper pour mettre à jour le state facilement
  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Générateur VPN IPSec" 
        subtitle="Assistant de configuration pour interconnexion de sites (Site-à-Site)"
        icon={Lock}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLONNE GAUCHE : FORMULAIRES */}
        <div className="space-y-6">
            
            {/* Paramètres Généraux */}
            <SectionCard title="1. Paramètres du Tunnel">
                <FormInput 
                    label="Nom du Tunnel" 
                    value={config.name} 
                    onChange={(e) => handleChange('name', e.target.value)} 
                />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <FormInput 
                            label="Clé Pré-partagée (PSK)" 
                            value={config.psk} 
                            onChange={(e) => handleChange('psk', e.target.value)}
                            type="text"
                        />
                    </div>
                    <div className="w-1/3">
                         <FormSelect 
                            label="Chiffrement"
                            value={config.algo}
                            onChange={(e) => handleChange('algo', e.target.value)}
                            options={[
                                { value: "aes128-sha1", label: "AES128 / SHA1 (Standard)" },
                                { value: "aes256-sha256", label: "AES256 / SHA256 (Fort)" },
                                { value: "3des-sha1", label: "3DES / SHA1 (Vieux)" },
                            ]}
                        />
                    </div>
                </div>
            </SectionCard>

            {/* Site A */}
            <SectionCard title="2. Site A (Local / Siège)">
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                    {/* CORRECTION ICI : Utilisation de la bonne icône */}
                    <ArrowLeftRight size={18} />
                    <span className="text-xs font-bold uppercase">Extrémité Gauche (Left)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                        label="IP Publique (WAN)" 
                        value={config.siteA_PublicIp} 
                        onChange={(e) => handleChange('siteA_PublicIp', e.target.value)} 
                    />
                    <FormInput 
                        label="Sous-réseau LAN" 
                        value={config.siteA_Subnet} 
                        onChange={(e) => handleChange('siteA_Subnet', e.target.value)} 
                        suffix="(CIDR)"
                    />
                </div>
            </SectionCard>

             {/* Site B */}
             <SectionCard title="3. Site B (Distant / Usine)">
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                    {/* CORRECTION ICI : Utilisation de la bonne icône */}
                    <ArrowLeftRight size={18} />
                    <span className="text-xs font-bold uppercase">Extrémité Droite (Right)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                        label="IP Publique (WAN)" 
                        value={config.siteB_PublicIp} 
                        onChange={(e) => handleChange('siteB_PublicIp', e.target.value)} 
                    />
                    <FormInput 
                        label="Sous-réseau LAN" 
                        value={config.siteB_Subnet} 
                        onChange={(e) => handleChange('siteB_Subnet', e.target.value)} 
                        suffix="(CIDR)"
                    />
                </div>
            </SectionCard>

        </div>

        {/* COLONNE DROITE : RÉSULTAT */}
        <div className="h-full">
            <SectionCard title="Fichier de Configuration" className="h-full bg-slate-900 border-slate-800 text-slate-200">
                <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-700 pb-2">
                    <FileKey size={16} />
                    <span className="text-xs font-mono">ipsec.conf preview</span>
                </div>
                
                {/* Zone de code */}
                <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-green-400 selection:bg-green-900 selection:text-white">
                    {output}
                </pre>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 italic">
                    Copiez ce bloc dans la section VPN de votre routeur ETIC ou dans le fichier de conf StrongSwan.
                </div>
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default VpnGenerator;