import React from 'react';
import { Cpu, Save, Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const BackupRestoreProcedure = () => {
  return (
    <PageContainer>
      <BrandHeader 
        title="Sauvegarde S7-1500" 
        subtitle="Procédure de Backup/Restore via Web Server (Sans TIA Portal)"
        icon={Cpu}
        enablePrint={true}
      />

      <div className="space-y-8">
        
        {/* ÉTAPE 1 */}
        <SectionCard title="1. Accès au Web Server">
            <div className="flex gap-4">
                <div className="bg-slate-100 dark:bg-slate-700 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                    <p className="mb-2">Ouvrez votre navigateur web et entrez l'adresse IP de l'automate.</p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono text-sm inline-block">
                        https://192.168.0.1 (Exemple)
                    </div>
                    <p className="text-sm text-slate-500 mt-2 italic">Note : Il faut accepter le certificat de sécurité si demandé.</p>
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <div className="bg-slate-100 dark:bg-slate-700 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                    <p>Connectez-vous avec un utilisateur ayant les droits d'administration.</p>
                    <ul className="list-disc ml-5 mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <li>Utilisateur par défaut : <strong>admin</strong></li>
                        <li>Mot de passe : (Voir dossier projet)</li>
                    </ul>
                </div>
            </div>
        </SectionCard>

        {/* ÉTAPE 2 */}
        <SectionCard title="2. Créer une sauvegarde (Backup)">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mb-6 flex items-start gap-3">
                <Save className="text-blue-600 mt-1" size={20}/>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important :</strong> L'automate doit être en mode STOP pour effectuer une sauvegarde complète cohérente.
                </div>
            </div>

            <ol className="space-y-4 ml-2 border-l-2 border-slate-200 dark:border-slate-700 pl-6">
                <li className="relative">
                    <span className="absolute -left-[33px] bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full w-4 h-4"></span>
                    Allez dans le menu <strong>Module</strong> &rarr; <strong>Backup</strong>.
                </li>
                <li className="relative">
                    <span className="absolute -left-[33px] bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full w-4 h-4"></span>
                    Donnez un nom au fichier (ex: <code>Backup_Ligne1_2025.s7pbkp</code>).
                </li>
                <li className="relative">
                    <span className="absolute -left-[33px] bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full w-4 h-4"></span>
                    Cliquez sur <strong>Create Backup</strong>.
                </li>
                <li className="relative">
                    <span className="absolute -left-[33px] bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full w-4 h-4"></span>
                    Une fois généré, cliquez sur <strong className="text-emerald-600"><Download className="inline w-4 h-4"/> Download</strong> pour enregistrer le fichier sur votre PC.
                </li>
            </ol>
        </SectionCard>

        {/* ÉTAPE 3 */}
        <SectionCard title="3. Restauration (Restore)">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg mb-6 flex items-start gap-3">
                <AlertTriangle className="text-orange-600 mt-1" size={20}/>
                <div className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Attention :</strong> La restauration va écraser tout le programme actuel et redémarrer la CPU.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold flex items-center gap-2 mb-3"><Upload size={18}/> Chargement</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Dans le menu <strong>Online Backup</strong>, cliquez sur "Browse" pour sélectionner votre fichier <code>.s7pbkp</code> puis cliquez sur "Restore".
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold flex items-center gap-2 mb-3"><CheckCircle2 size={18}/> Validation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Confirmez le redémarrage. La LED "MAINT" clignotera orange pendant l'opération. Attendez le retour au vert "RUN".
                    </p>
                </div>
            </div>
        </SectionCard>

      </div>
    </PageContainer>
  );
};

export default BackupRestoreProcedure;