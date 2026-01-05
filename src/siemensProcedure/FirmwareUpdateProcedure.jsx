import React, { useState } from 'react';
import { Download, AlertTriangle, Monitor, Server, Save, ExternalLink, Layers, Cpu, LayoutTemplate, RefreshCw } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const FirmwareUpdateProcedure = () => {
  // Gestion des onglets : 'cpu', 'modules', 'hmi'
  const [activeTab, setActiveTab] = useState('cpu');

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Procédure Mise à Jour Firmware" 
        subtitle="Centre de ressources : Automates, Cartes et IHM"
        icon={Download}
        enablePrint={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- COLONNE GAUCHE : COMMUNE --- */}
        <div className="space-y-6">
            
            {/* Navigation */}
            <div className="hidden lg:block space-y-2 no-print">
                <button 
                    onClick={() => setActiveTab('cpu')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'cpu' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Cpu size={20} /> <span className="font-bold">Automates (CPU)</span>
                </button>
                <button 
                    onClick={() => setActiveTab('modules')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'modules' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Layers size={20} /> <span className="font-bold">Cartes / IO</span>
                </button>
                <button 
                    onClick={() => setActiveTab('hmi')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${activeTab === 'hmi' ? 'bg-pink-600 text-white border-pink-600 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <LayoutTemplate size={20} /> <span className="font-bold">Ecrans (IHM)</span>
                </button>
            </div>

            {/* Sélecteur Mobile */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-print">
                <button onClick={() => setActiveTab('cpu')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'cpu' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600'}`}>CPU</button>
                <button onClick={() => setActiveTab('modules')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'modules' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Cartes IO</button>
                <button onClick={() => setActiveTab('hmi')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab === 'hmi' ? 'bg-pink-600 text-white' : 'bg-white text-slate-600'}`}>IHM</button>
            </div>

            {/* Liens de téléchargement */}
            <SectionCard title="Liens SIOS Officiels">
                <div className="space-y-3">
                    <a href="https://support.industry.siemens.com/cs/document/109478459" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">
                        <ExternalLink size={14}/> Firmware S7-1200
                    </a>
                    <a href="https://support.industry.siemens.com/cs/document/109478528" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline">
                        <ExternalLink size={14}/> Firmware S7-1500
                    </a>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                    <a href="https://support.industry.siemens.com/cs/ww/en/view/109746530" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-pink-700 dark:text-pink-400 hover:underline">
                        <ExternalLink size={14}/> Images IHM Comfort / Unified
                    </a>
                </div>
            </SectionCard>

            {/* Alerte Sécurité */}
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 dark:text-red-400 mt-1" size={20} />
                    <div>
                        <h3 className="text-red-800 dark:text-red-200 font-bold text-sm">Attention</h3>
                        <p className="text-red-700 dark:text-red-300 text-xs mt-1 leading-relaxed">
                            Ne coupez jamais l'alimentation pendant le transfert.
                            L'équipement redémarrera (Arrêt Production).
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE : CONTENU DYNAMIQUE --- */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 key={activeTab}">
            
            {/* === CONTENU CPU === */}
            {activeTab === 'cpu' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu size={32} className="text-teal-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mise à jour CPU</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Concerne : S7-1200, S7-1500, ET200SP CPU.</p>

                    <SectionCard>
                        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><Monitor size={24} className="text-teal-600 dark:text-teal-400"/></div>
                            <h3 className="font-bold text-lg">Méthode 1 : TIA Portal (Online)</h3>
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><span className="badge-step">1</span> Connectez-vous au réseau de l'automate.</li>
                            <li className="flex gap-3"><span className="badge-step">2</span> Dans TIA, allez dans <strong>En ligne et diagnostic</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">3</span> Menu <strong>Fonctions &gt; Mise à jour du firmware</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">4</span> Sélectionnez le fichier <code>.upd</code> et lancez.</li>
                        </ol>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><Server size={24} className="text-teal-600 dark:text-teal-400"/></div>
                            <h3 className="font-bold text-lg">Méthode 2 : Serveur Web</h3>
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><span className="badge-step">1</span> Ouvrez l'IP automate dans le navigateur (ex: 192.168.0.1).</li>
                            <li className="flex gap-3"><span className="badge-step">2</span> Loggez-vous (Admin) et allez dans <strong>Module &gt; Firmware</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">3</span> Uploadez le fichier <code>.upd</code>. La CPU redémarre seule.</li>
                        </ol>
                    </SectionCard>
                </>
            )}

            {/* === CONTENU CARTES / MODULES === */}
            {activeTab === 'modules' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <Layers size={32} className="text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mise à jour Cartes</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Concerne : Modules IO (SM), Communication (CM/CP), Têtes ET200.</p>

                    <SectionCard>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm p-3 rounded mb-4">
                            ℹ️ Astuce : La LED "Diag" du module clignotera vert/rouge pendant le transfert.
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-none">1</span>
                                <span>Passez TIA Portal en mode <strong>En ligne</strong> (Lunettes oranges).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-none">2</span>
                                <span>Dans la "Vue des appareils", faites un <strong>Clic Droit sur le module spécifique</strong> (ex: Slot 2).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-none">3</span>
                                <span>Choisissez <strong>En ligne et diagnostic</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-none">4</span>
                                <span>Allez dans <strong>Fonctions &gt; Mise à jour du firmware</strong>.</span>
                            </li>
                        </ol>
                    </SectionCard>
                </>
            )}

            {/* === CONTENU IHM === */}
            {activeTab === 'hmi' && (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutTemplate size={32} className="text-pink-600" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mise à jour IHM</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Concerne : Basic, Comfort, Unified Panels.</p>

                    {/* METHODE 1 : TIA */}
                    <SectionCard>
                        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><Monitor size={24} className="text-pink-600 dark:text-pink-400"/></div>
                            <h3 className="font-bold text-lg">Méthode 1 : Via TIA Portal</h3>
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><span className="badge-step">1</span> Assurez-vous que l'IHM est en mode "Transfert".</li>
                            <li className="flex gap-3"><span className="badge-step">2</span> Dans l'arborescence, clic droit sur l'IHM &gt; <strong>Mise à jour du système d'exploitation</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">3</span> Si l'option est cachée : Menu <strong>En ligne &gt; Maintenance HMI &gt; Mise à jour OS</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">4</span> Attention : Le Runtime et les recettes seront effacés.</li>
                        </ol>
                    </SectionCard>
                    
                    {/* METHODE 2 : USB */}
                    <SectionCard>
                        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><Save size={24} className="text-pink-600 dark:text-pink-400"/></div>
                            <h3 className="font-bold text-lg">Méthode 2 : Via USB (Recovery)</h3>
                        </div>
                        <div className="text-xs bg-slate-100 dark:bg-slate-700 dark:text-slate-300 p-2 rounded mb-4">
                            Recommandé pour les <strong>Unified Panels</strong> ou en cas de blocage.
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><span className="badge-step">1</span> Téléchargez l'image "USB Recovery" sur le site SIOS.</li>
                            <li className="flex gap-3"><span className="badge-step">2</span> Décompressez l'archive à la racine d'une clé USB (FAT32).</li>
                            <li className="flex gap-3"><span className="badge-step">3</span> Bootez l'écran sur la clé et suivez le menu maintenance.</li>
                        </ol>
                    </SectionCard>

                    {/* METHODE 3 : PROSAVE (NOUVEAU) */}
                    <SectionCard>
                        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><RefreshCw size={24} className="text-pink-600 dark:text-pink-400"/></div>
                            <h3 className="font-bold text-lg">Méthode 3 : Via ProSave (Maintenance)</h3>
                        </div>
                        <div className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300 p-2 rounded mb-4 border border-pink-100 dark:border-pink-800">
                            Outil autonome pour Basic/Comfort/Mobile Panels. Utile pour "Unbricker" un écran.
                        </div>
                        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><span className="badge-step">1</span> Lancez le logiciel <strong>ProSave</strong> sur votre PC.</li>
                            <li className="flex gap-3"><span className="badge-step">2</span> Onglet "Général" : Sélectionnez le type exact de pupitre et l'IP.</li>
                            <li className="flex gap-3"><span className="badge-step">3</span> Allez dans l'onglet <strong>Mise à jour de l'OS</strong>.</li>
                            <li className="flex gap-3"><span className="badge-step">4</span> Cochez <em>"Restaurer les paramètres d'usine"</em> si l'écran ne démarre plus (MAC Address requise).</li>
                            <li className="flex gap-3"><span className="badge-step">5</span> Cliquez sur "Mettre à jour". Redémarrez manuellement l'écran si demandé pour lancer le transfert.</li>
                        </ol>
                    </SectionCard>
                </>
            )}

        </div>

      </div>
      
      {/* Styles des badges numérotés */}
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
      `}</style>
    </PageContainer>
  );
};

export default FirmwareUpdateProcedure;