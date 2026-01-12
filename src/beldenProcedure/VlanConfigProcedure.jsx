import React from 'react';
import { Network, Settings, Layers, AlertCircle } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const VlanConfigProcedure = () => {
  return (
    <PageContainer>
      <BrandHeader 
        title="Configuration VLAN" 
        subtitle="Guide rapide pour Switch Hirschmann (HiOS 8/9)"
        icon={Network}
        enablePrint={true}
      />

      {/* PRÉREQUIS */}
      <div className="mb-6 flex gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
        <Settings className="text-indigo-600 shrink-0" />
        <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Accès Switch</h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-200">
                Connectez-vous à l'interface Web (HiView ou Navigateur Java/HTML5).<br/>
                Aller dans le menu : <strong>Switching &rarr; VLAN &rarr; Static</strong>.
            </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* ÉTAPE 1 : CRÉATION */}
        <SectionCard title="1. Création des VLANs">
            <p className="mb-4 text-sm">Dans l'onglet <strong>Global</strong> ou <strong>Configuration</strong> :</p>
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                        <th className="p-2 border border-slate-300 dark:border-slate-600">ID</th>
                        <th className="p-2 border border-slate-300 dark:border-slate-600">Name (Optionnel)</th>
                        <th className="p-2 border border-slate-300 dark:border-slate-600">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono font-bold">10</td>
                        <td className="p-2 border border-slate-300 dark:border-slate-600">AUTOMATISME</td>
                        <td className="p-2 border border-slate-300 dark:border-slate-600 text-slate-500">Cliquer <span className="font-bold text-black dark:text-white">+</span> (Add)</td>
                    </tr>
                    <tr>
                        <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono font-bold">20</td>
                        <td className="p-2 border border-slate-300 dark:border-slate-600">SUPERVISION</td>
                        <td className="p-2 border border-slate-300 dark:border-slate-600 text-slate-500">Cliquer <span className="font-bold text-black dark:text-white">+</span> (Add)</td>
                    </tr>
                </tbody>
            </table>
        </SectionCard>

        {/* ÉTAPE 2 : ASSIGNATION */}
        <SectionCard title="2. Assignation des Ports (Tagging)">
            <p className="mb-4 text-sm">Aller dans l'onglet <strong>Port Table</strong>. Pour chaque port, définissez son appartenance :</p>
            
            <div className="grid gap-4 md:grid-cols-2">
                {/* UNTAGGED */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="font-bold text-emerald-600 flex items-center gap-2"><Layers size={18}/> Access Port (Untagged)</h4>
                    <p className="text-xs text-slate-500 mb-2">Pour PC, Automate, Imprimante.</p>
                    <ul className="text-sm list-disc ml-4 space-y-1">
                        <li><strong>Port Mode :</strong> Access</li>
                        <li><strong>PVID :</strong> ID du VLAN (ex: 10)</li>
                        <li><strong>Egress :</strong> Untagged (U) sur le VLAN 10</li>
                        <li><strong>Ingress Filtering :</strong> Activé (recommandé)</li>
                    </ul>
                </div>

                {/* TAGGED */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="font-bold text-blue-600 flex items-center gap-2"><Layers size={18}/> Trunk Port (Tagged)</h4>
                    <p className="text-xs text-slate-500 mb-2">Lien entre switchs ou vers routeur.</p>
                    <ul className="text-sm list-disc ml-4 space-y-1">
                        <li><strong>Port Mode :</strong> Trunk</li>
                        <li><strong>PVID :</strong> 1 (Natif)</li>
                        <li><strong>Egress :</strong> Tagged (T) sur les VLANs 10, 20...</li>
                        <li>Vérifier que le VLAN 1 est aussi autorisé.</li>
                    </ul>
                </div>
            </div>
        </SectionCard>

        {/* NOTE IMPORTANTE */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-4">
            <AlertCircle size={24} className="text-red-600"/>
            <div>
                <h4 className="font-bold text-red-700 dark:text-red-300">Ne pas s'enfermer dehors !</h4>
                <p className="text-sm text-red-600 dark:text-red-200">
                    Si vous modifiez le VLAN du port sur lequel vous êtes connecté (ex: Port 1), vous perdrez la connexion immédiatement. Configurez toujours un autre port ou utilisez le port Console (USB/Série).
                </p>
            </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default VlanConfigProcedure;