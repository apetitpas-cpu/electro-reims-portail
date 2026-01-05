import React from 'react';
import { Database, Globe, Save, Cpu, FileSpreadsheet, AlertTriangle, CheckCircle2, Server, Lock, Code, Bug, FolderOpen, FilePlus, XCircle, CalendarClock } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const DataArchivingProcedure = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Archivage de Données (Data Logging)" 
        subtitle="S7-1200 (G1/G2) : Guide complet des blocs DataLog & Segmentation"
        icon={Database}
        enablePrint={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- COLONNE GAUCHE : PRÉ-REQUIS & INFO --- */}
        <div className="space-y-6">
            
            {/* Différences G1 / G2 */}
            <SectionCard title="Pré-requis Matériel">
                <div className="space-y-4 text-sm">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-1">
                            <Cpu size={16}/> Génération 1 (FW &lt; 4.0)
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Mémoire de chargement très faible.
                            <br/><strong className="text-red-500">Carte SMC (Memory Card) OBLIGATOIRE</strong> pour stocker les CSV.
                        </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-1">
                            <Cpu size={16}/> Génération 2 (FW ≥ 4.0)
                        </div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            Mémoire interne plus grande. Petits logs possibles sans carte.
                            <br/><strong>Carte SMC recommandée</strong> pour les archivages fréquents (évite d'user la mémoire interne).
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Note Importante */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-orange-600 dark:text-orange-400 mt-1" size={20} />
                    <div>
                        <h3 className="text-orange-800 dark:text-orange-200 font-bold text-sm">Attention : Mémoire</h3>
                        <p className="text-orange-700 dark:text-orange-300 text-xs mt-1 leading-relaxed">
                            Les fichiers sont stockés en <strong>Load Memory</strong>. Si elle est pleine, le bloc renvoie l'erreur <strong>8092</strong>.
                            <br/>Pensez à supprimer les vieux logs via le serveur web.
                        </p>
                    </div>
                </div>
            </div>

            {/* Codes Erreurs */}
            <SectionCard title="Codes Erreurs Fréquents">
                <div className="space-y-2">
                    <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-1">
                        <span className="font-mono font-bold text-red-600">807F</span>
                        <span className="text-right w-2/3">Erreur interne. Souvent : type de données incorrect dans le paramètre `DATA` (Utilisez une STRUCT).</span>
                    </div>
                    <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-1">
                        <span className="font-mono font-bold text-red-600">8090</span>
                        <span className="text-right w-2/3">Nom de fichier invalide (caractères spéciaux ?) ou fichier déjà ouvert.</span>
                    </div>
                    <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-1">
                        <span className="font-mono font-bold text-red-600">8092</span>
                        <span className="text-right w-2/3">Mémoire de chargement pleine (Load Memory). Insérez une SD Card.</span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                        <span className="font-mono font-bold text-red-600">8093</span>
                        <span className="text-right w-2/3">Fichier non existant (lors d'un DataLogWrite/Open). Créez-le d'abord.</span>
                    </div>
                </div>
            </SectionCard>

        </div>

        {/* --- COLONNE DROITE : PROCEDURE --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* ETAPE 1 : CONFIG WEB SERVER */}
            <SectionCard>
                <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg"><Globe size={24} className="text-indigo-600 dark:text-indigo-400"/></div>
                    <h3 className="font-bold text-lg">Étape 1 : Activation Serveur Web (TIA Portal)</h3>
                </div>
                
                <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3">
                        <span className="badge-step">1</span>
                        <div>
                            <strong>Activation Globale :</strong>
                            <br/>Configuration Appareil &gt; Propriétés &gt; Serveur Web.
                            <br/>Cochez <em className="font-bold text-indigo-600">"Activer le serveur Web sur ce module"</em>.
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">2</span>
                        <div className="w-full">
                            <strong>Gestion des Utilisateurs (CRITIQUE) :</strong>
                            <br/>Sans utilisateur, impossible de voir les fichiers.
                            <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                                <div className="text-xs font-bold uppercase mb-1 flex items-center gap-2"><Lock size={12}/> Créer un user "admin"</div>
                                <ul className="list-none text-xs space-y-1">
                                    <li className="text-green-600 dark:text-green-400">☑ Lire les fichiers (Read files)</li>
                                    <li className="text-green-600 dark:text-green-400">☑ Écrire/supprimer des fichiers</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ol>
            </SectionCard>

            {/* ETAPE 2 : PROGRAMMATION (DETAIL BLOCS) */}
            <SectionCard>
                <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg"><Code size={24} className="text-teal-600 dark:text-teal-400"/></div>
                    <h3 className="font-bold text-lg">Étape 2 : Les Blocs DataLog</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    
                    {/* DataLogCreate */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2">
                        <h4 className="font-bold text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-2">
                            <Save size={16}/> DataLogCreate
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                            Crée le fichier CSV initial. À appeler <strong>une seule fois</strong> (FirstScan ou bouton "Init").
                        </p>
                        <ul className="list-disc list-inside text-[10px] text-slate-500 font-mono space-y-1 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                            <li><strong>NAME</strong>: 'Log_Production' (String)</li>
                            <li><strong>HEADER</strong>: 'Date,Heure,Pression' (String)</li>
                            <li><strong>DATA</strong>: MaStructure (Struct/UDT)</li>
                            <li><strong>ID (Out)</strong>: Sauvegarder cette valeur ! (DWord)</li>
                        </ul>
                    </div>

                    {/* DataLogWrite */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <Code size={16}/> DataLogWrite
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Écrit une ligne dans le CSV.
                            <br/>Déclenchez-le sur un événement ou une horloge (ex: 1min).
                            <br/><span className="italic opacity-80">Requiert l'ID du Create ou Open.</span>
                        </p>
                    </div>

                    {/* DataLogOpen */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                            <FolderOpen size={16}/> DataLogOpen
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            <strong>Indispensable après un redémarrage automate.</strong>
                            <br/>Si le fichier existe déjà, "Create" échoue. Utilisez "Open" pour récupérer l'ID et continuer d'écrire.
                        </p>
                    </div>

                    {/* DataLogClose */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                            <XCircle size={16}/> DataLogClose
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Ferme le fichier pour libérer l'accès.
                            <br/>Recommandé <strong>avant de télécharger</strong> le CSV via le Web pour être sûr d'avoir les dernières lignes.
                        </p>
                    </div>

                    {/* DataLogNewFile */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                            <FilePlus size={16}/> DataLogNewFile
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Ferme le fichier actuel et en crée un nouveau automatiquement.
                            <br/>Idéal pour la rotation périodique (voir ci-dessous).
                        </p>
                    </div>

                </div>
            </SectionCard>

            {/* NOUVEAU : STRATEGIE DE SEGMENTATION */}
            <SectionCard title="Stratégie de Segmentation (Rotation des Logs)">
                <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 hidden sm:block">
                        <CalendarClock size={24} />
                    </div>
                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                        <p>
                            Pour éviter de saturer la mémoire avec un fichier unique géant, il est recommandé de segmenter les archives (ex: <strong>un fichier par jour</strong>).
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h5 className="font-bold text-slate-800 dark:text-white mb-2 text-xs uppercase flex items-center gap-2">
                                <Code size={14} className="text-indigo-500"/> Principe de l'Algorithme
                            </h5>
                            <ul className="list-disc list-inside text-xs space-y-1.5 leading-relaxed">
                                <li>Sur <strong>Changement de date</strong> (ex: à Minuit) ou sur déclenchement manuel.</li>
                                <li>Appeler le bloc <strong>DataLogNewFile</strong>.</li>
                                <li>Construire un nom dynamique pour l'entrée <code>NAME</code> (ex: en SCL : <code>CONCAT('Log_', DateString)</code> pour avoir <em>"Log_20231201"</em>).</li>
                                <li>Le bloc ferme automatiquement l'ancien fichier et ouvre le nouveau.</li>
                                <li><strong>Avantage :</strong> L'ID reste le même, vous pouvez continuer d'appeler <code>DataLogWrite</code> sans changer votre code principal.</li>
                            </ul>
                        </div>

                        <div className="flex gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded border border-orange-100 dark:border-orange-800">
                            <AlertTriangle size={16} className="flex-none mt-0.5"/>
                            <span><strong>Important :</strong> La limite est souvent de <strong>10 fichiers ouverts</strong> simultanément. Pensez à fermer les vieux fichiers si vous ne faites pas de rotation automatique.</span>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ETAPE 3 : RECUPERATION */}
            <SectionCard>
                <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><FileSpreadsheet size={24} className="text-blue-600 dark:text-blue-400"/></div>
                    <h3 className="font-bold text-lg">Étape 3 : Récupération via le Web</h3>
                </div>
                
                <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3">
                        <span className="badge-step">1</span>
                        <span>Ouvrez votre navigateur : <code>https://[IP_AUTOMATE]</code>.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">2</span>
                        <span>Connectez-vous avec l'utilisateur <strong>admin</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">3</span>
                        <div>
                            Allez dans <strong>"Navigateur de fichiers"</strong> (File Browser).
                            <br/>Ouvrez le dossier <strong>DataLogs</strong>.
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">4</span>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded border border-blue-100 dark:border-blue-800 w-full">
                            <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-1"><Bug size={14}/> Fichier vide ou incomplet ?</span>
                            <p className="text-xs text-blue-600 dark:text-blue-200">
                                Les données sont parfois en mémoire tampon.
                                <br/>Exécutez un <strong>DataLogClose</strong> dans l'automate pour forcer l'écriture sur disque avant le téléchargement.
                            </p>
                        </div>
                    </li>
                </ol>
            </SectionCard>

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

export default DataArchivingProcedure;