import React, { useState } from 'react';
import { Power, Globe, Wifi, Signal, Settings, Monitor, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const RasCommissioning = () => {
  const [activeTab, setActiveTab] = useState('ethernet');

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Mise en service RAS E-Series" 
        subtitle="Première connexion et configuration WAN (Ethernet / 4G / Wi-Fi)"
        icon={Power}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- COLONNE GAUCHE : NAVIGATION & INFOS --- */}
        <div className="space-y-6">
            
            {/* Onglets de Navigation */}
            <div className="hidden lg:block space-y-2 no-print">
                <button 
                    onClick={() => setActiveTab('ethernet')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'ethernet' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Globe size={20} /> <span className="font-bold">WAN Ethernet (Usine)</span>
                </button>
                <button 
                    onClick={() => setActiveTab('wifi')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'wifi' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Wifi size={20} /> <span className="font-bold">WAN Wi-Fi (Client)</span>
                </button>
                <button 
                    onClick={() => setActiveTab('cellular')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'cellular' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Signal size={20} /> <span className="font-bold">WAN Cellulaire (4G)</span>
                </button>
            </div>

            {/* Sélecteur Mobile */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
                <button onClick={() => setActiveTab('ethernet')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'ethernet' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Ethernet</button>
                <button onClick={() => setActiveTab('wifi')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'wifi' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>Wi-Fi</button>
                <button onClick={() => setActiveTab('cellular')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'cellular' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600'}`}>4G / LTE</button>
            </div>

            {/* Carte Infos Connexion */}
            <SectionCard title="Accès par défaut">
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="text-slate-500 dark:text-slate-400">IP Usine (LAN)</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">192.168.0.128</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="text-slate-500 dark:text-slate-400">Utilisateur</span>
                        <span className="font-mono font-bold">etic</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Mot de passe</span>
                        <span className="font-mono font-bold">etictelecom</span>
                    </div>
                </div>
            </SectionCard>

            {/* Astuce Reset */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <RefreshCw className="text-orange-600 dark:text-orange-400 mt-1" size={20} />
                    <div>
                        <h3 className="text-orange-800 dark:text-orange-200 font-bold text-sm">Perdu l'accès ?</h3>
                        <p className="text-orange-700 dark:text-orange-300 text-xs mt-1 leading-relaxed">
                            Maintenez le bouton "Reset" enfoncé pendant <strong>3 secondes</strong> pour restaurer temporairement l'IP usine sans effacer la config.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE : CONTENU --- */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 key={activeTab}">
            
            {/* ETAPE 0 : PRE-REQUIS COMMUN */}
            <SectionCard className="border-l-4 border-l-slate-400">
                <div className="flex items-center gap-3 mb-4">
                    <Monitor size={24} className="text-slate-600 dark:text-slate-300"/>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Étape 0 : Connexion au PC</h3>
                </div>
                <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3"><span className="badge-step">1</span> Connectez votre PC sur un port <strong>LAN</strong> (1 à 3) du RAS.</li>
                    <li className="flex gap-3"><span className="badge-step">2</span> Configurez votre carte réseau PC en IP fixe : <code>192.168.0.10</code>.</li>
                    <li className="flex gap-3"><span className="badge-step">3</span> Ouvrez <code>http://192.168.0.128</code> dans votre navigateur.</li>
                    <li className="flex gap-3"><span className="badge-step">4</span> Connectez-vous (etic / etictelecom) et cliquez sur <strong>"Assistant"</strong> (Wizard).</li>
                </ol>
            </SectionCard>

            {/* === CONTENU ETHERNET === */}
            {activeTab === 'ethernet' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <Globe size={32} className="text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuration WAN Ethernet</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Pour raccorder le RAS au réseau d'entreprise (Usine) via câble RJ45.</p>

                    <SectionCard>
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Dans l'Assistant :</h3>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3">
                                <span className="badge-step">1</span>
                                <div>
                                    <strong>Choix du Scénario :</strong> Sélectionnez "Machine reliée à Internet par le réseau Usine".
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">2</span>
                                <div>
                                    <strong>Interface WAN :</strong> Choisissez le port WAN (souvent le port 4 ou dédié).
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">3</span>
                                <div>
                                    <strong>Adressage IP :</strong>
                                    <ul className="list-disc list-inside mt-2 ml-2 text-slate-500 dark:text-slate-400">
                                        <li>Soit <strong>DHCP Client</strong> (Recommandé si le réseau usine le gère).</li>
                                        <li>Soit <strong>IP Fixe</strong> (Demandez à l'IT client : IP, Masque, Passerelle, DNS).</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">4</span>
                                <div>
                                    <strong>Validation :</strong> Terminez l'assistant. Le RAS va redémarrer.
                                    <br/><span className="text-xs italic opacity-80">Note : Branchez le câble réseau Usine sur le port WAN maintenant.</span>
                                </div>
                            </li>
                        </ol>
                    </SectionCard>
                </>
            )}

            {/* === CONTENU WIFI === */}
            {activeTab === 'wifi' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <Wifi size={32} className="text-blue-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuration WAN Wi-Fi</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Pour connecter le RAS à un point d'accès Wi-Fi existant (Mode Client).</p>

                    <SectionCard>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded mb-4 border border-blue-100 dark:border-blue-800">
                            ⚠️ Requis : Modèle RAS-EW ou RAS-CW (avec option Wi-Fi).
                        </div>
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Procédure Manuelle :</h3>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3">
                                <span className="badge-step">1</span>
                                <span>Allez dans le menu <strong>Configuration &gt; Interfaces WAN &gt; Wi-Fi</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">2</span>
                                <span>Cochez <strong>"Activer l'interface"</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">3</span>
                                <span>Cliquez sur le bouton <strong>"Scanner"</strong> pour voir les réseaux disponibles.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">4</span>
                                <span>Sélectionnez le SSID (Nom du réseau) et entrez la clé de sécurité (WPA2/PSK).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">5</span>
                                <span>Sauvegardez. Vérifiez l'état dans <strong>Diagnostic &gt; État des interfaces</strong>.</span>
                            </li>
                        </ol>
                    </SectionCard>
                </>
            )}

            {/* === CONTENU CELLULAIRE === */}
            {activeTab === 'cellular' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <Signal size={32} className="text-orange-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuration WAN 4G</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Connexion via carte SIM M2M (Modèles RAS-EC ou RAS-C).</p>

                    <SectionCard>
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Configuration APN :</h3>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3">
                                <span className="badge-step">1</span>
                                <span>Insérez la carte SIM (RAS éteint) et vissez les antennes 4G.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">2</span>
                                <span>Allez dans <strong>Configuration &gt; Interfaces WAN &gt; Cellulaire</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">3</span>
                                <div>
                                    <strong>Code PIN :</strong> Entrez le code (souvent 0000 ou 1234).
                                    <br/><span className="text-xs text-orange-600 dark:text-orange-400 font-bold">Conseil : Désactivez le code PIN via un téléphone avant si possible.</span>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">4</span>
                                <div>
                                    <strong>APN (Access Point Name) :</strong> Indispensable pour la data.
                                    <ul className="mt-2 grid grid-cols-2 gap-2 text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                        <li>Orange M2M : <code>orange.m2m.spec</code></li>
                                        <li>SFR M2M : <code>m2minternet</code></li>
                                        <li>Bouygues : <code>m2mbouygtel</code></li>
                                        <li>Objenious : <code>transatel</code></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="badge-step">5</span>
                                <span>Sauvegardez. La LED "Cell" doit passer au vert fixe après 1-2 minutes.</span>
                            </li>
                        </ol>
                    </SectionCard>
                </>
            )}

            {/* VALIDATION */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 flex items-start gap-4">
                <CheckCircle2 className="text-green-600 dark:text-green-400 mt-1" />
                <div>
                    <h4 className="font-bold text-green-800 dark:text-green-200 text-sm">Validation finale</h4>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Une fois configuré, allez dans <strong>Maintenance &gt; Outils de test</strong> et faites un "Ping" vers <code>8.8.8.8</code>.
                        <br/>Si ça répond ("Reply from..."), votre RAS est connecté à Internet !
                    </p>
                </div>
            </div>

        </div>

      </div>
      
      <style>{`
        .badge-step {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 9999px;
            font-weight: bold;
            flex: none;
            background-color: #e2e8f0;
            color: #475569;
        }
        .dark .badge-step {
            background-color: #334155;
            color: #e2e8f0;
        }
      `}</style>
    </PageContainer>
  );
};

export default RasCommissioning;