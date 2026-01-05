import React from 'react';
import { Lock, AlertTriangle, Network, Key as KeyIcon } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const MacSecProcedure = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Configuration MACsec" 
        subtitle="Chiffrement de liaison (Hirschmann GRS/BRS)"
        icon={Lock}
      />

      <div className="space-y-8">

        {/* --- MACSEC UNIQUEMENT --- */}
        <SectionCard title="Mise en place du MACsec">
            
            {/* Définition */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-800 dark:text-indigo-200 text-sm border-l-4 border-indigo-500">
                <Lock size={20} className="flex-none"/>
                <div>
                    <strong>Objectif :</strong> Sécuriser la liaison entre le bâtiment et une zone sensible.
                    <br/><span className="opacity-80">Pré-requis : Le réseau physique doit être fonctionnel avant d'activer le chiffrement.</span>
                </div>
            </div>

            {/* Informations Matériel */}
            <h4 className="font-bold text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                <Network size={18} /> Paramètres des Équipements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* GRS115 */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MASTER ?</div>
                    <div className="font-bold text-lg text-slate-800 dark:text-white mb-1">GRS115</div>
                    <div className="text-xs font-mono text-slate-500 mb-4">Hirschmann</div>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">IP</span>
                            <span className="font-mono font-bold">172.16.10.1 /24</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">Gateway</span>
                            <span className="font-mono">172.16.10.254</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">User</span>
                            <span className="font-bold">Admin</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Password</span>
                            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">Belden25.</span>
                        </div>
                    </div>
                </div>

                {/* BRS31 */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                    <div className="font-bold text-lg text-slate-800 dark:text-white mb-1">BRS31</div>
                    <div className="text-xs font-mono text-slate-500 mb-4">Hirschmann</div>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">IP</span>
                            <span className="font-mono font-bold">172.16.10.6 /24</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">Gateway</span>
                            <span className="font-mono">172.16.10.254</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">User</span>
                            <span className="font-bold">Admin</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Password</span>
                            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">private</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Procédure Commune */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <KeyIcon size={18} className="text-teal-600"/> Procédure de Configuration (Identique sur les 2)
                </h4>

                <div className="relative border-l-2 border-slate-300 dark:border-slate-600 ml-3 space-y-6">
                    
                    {/* Etape 1 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-white">1. Accès au menu</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Se rendre dans <strong>Politique de sécurité</strong> puis <strong>Générateur de clé externe</strong>.
                        </p>
                    </div>

                    {/* Etape 2 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-white">2. Création des Clés</h5>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-1 list-disc list-inside">
                            <li>Créer la <strong>MKE Policy</strong> (Laisser celle par défaut).</li>
                            <li>Créer la <strong>Key Chain</strong>.</li>
                            <li>Définir un <strong>Key Name</strong> (Jusqu'à 8 noms par chaîne).</li>
                            <li>Générer la <strong>Key String</strong>.</li>
                        </ul>
                    </div>

                    {/* Etape 3 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-white">3. Affectation</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Lier la <strong>Key Chain</strong> au port souhaité et <strong>Valider</strong>.
                        </p>
                    </div>

                    {/* Etape 4 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 shadow-md"></div>
                        <h5 className="font-bold text-sm text-teal-700 dark:text-teal-400">4. Activation Switch-to-Switch</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Activer le mode <strong>switch-to-switch</strong>.
                            <br/><em className="opacity-80">Requis : Liaison physique OK et Key Chain identique.</em>
                        </p>
                    </div>
                </div>

                {/* Warning Important */}
                <div className="mt-6 flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-100 dark:border-orange-800">
                    <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400 flex-none mt-0.5" />
                    <div className="text-xs text-orange-800 dark:text-orange-200">
                        <strong>ATTENTION :</strong><br/>
                        Pour que la liaison fonctionne, la <u>Key Chain</u> et le <u>Key Name</u> doivent être strictement <strong>IDENTIQUES</strong> sur les deux équipements.
                    </div>
                </div>

            </div>
        </SectionCard>

      </div>
    </PageContainer>
  );
};

export default MacSecProcedure;