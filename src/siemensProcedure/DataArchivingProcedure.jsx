import React from 'react';
import { Database, Globe, Save, Cpu, FileSpreadsheet, AlertTriangle, CheckCircle2, Server, Lock } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const DataArchivingProcedure = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Archivage de Données (Data Logging)" 
        subtitle="S7-1200 (G1/G2) : Création de fichiers CSV et accès Web"
        icon={Database}
        enablePrint={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- COLONNE GAUCHE : PRÉ-REQUIS & INFO --- */}
        <div className="space-y-6">
            
            {/* Différences G1 / G2 */}
            <SectionCard title="Générations S7-1200">
                <div className="space-y-4 text-sm">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-1">
                            <Cpu size={16}/> Génération 1 (FW &lt; 4.0)
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            La mémoire de chargement interne est très faible.
                            <br/><strong className="text-red-500">Carte SMC (Memory Card) OBLIGATOIRE</strong> pour stocker des logs.
                        </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-1">
                            <Cpu size={16}/> Génération 2 (FW ≥ 4.0)
                        </div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            Mémoire interne plus grande. Petits logs possibles sans carte.
                            <br/><strong>Carte SMC recommandée</strong> pour les archivages longs ou fréquents afin de préserver la mémoire interne.
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Note Importante */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-orange-600 dark:text-orange-400 mt-1" size={20} />
                    <div>
                        <h3 className="text-orange-800 dark:text-orange-200 font-bold text-sm">Attention : Mémoire de Chargement</h3>
                        <p className="text-orange-700 dark:text-orange-300 text-xs mt-1 leading-relaxed">
                            Les fichiers CSV sont stockés dans la <strong>Load Memory</strong> (pas la Work Memory).
                            <br/>Si la mémoire est pleine, la création du log échouera (Erreur 8092).
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* --- COLONNE DROITE : PROCEDURE --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* ETAPE 1 : CONFIG WEB SERVER (DÉTAILLÉE) */}
            <SectionCard>
                <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg"><Globe size={24} className="text-indigo-600 dark:text-indigo-400"/></div>
                    <h3 className="font-bold text-lg">Étape 1 : Activation Serveur Web (TIA Portal)</h3>
                </div>
                
                <ol className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3">
                        <span className="badge-step">1</span>
                        <div>
                            <strong>Activation Globale :</strong>
                            <br/>Dans la <em>Configuration de l'appareil</em>, cliquez sur la CPU.
                            <br/>Allez dans l'onglet <strong>Propriétés &gt; Serveur Web &gt; Général</strong>.
                            <br/>Cochez la case <em className="font-bold text-indigo-600">"Activer le serveur Web sur ce module"</em>.
                            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                                <AlertTriangle size={12}/> Acceptez les avertissements de sécurité.
                            </div>
                        </div>
                    </li>
                    
                    <li className="flex gap-3">
                        <span className="badge-step">2</span>
                        <div>
                            <strong>Sécurité & HTTPS :</strong>
                            <br/>Toujours dans <em>Propriétés &gt; Serveur Web</em>, décochez "Autoriser l'accès uniquement via HTTPS" si vous voulez tester simplement en HTTP (déconseillé en prod), ou laissez-le pour la sécurité.
                        </div>
                    </li>

                    <li className="flex gap-3">
                        <span className="badge-step">3</span>
                        <div className="w-full">
                            <strong>Gestion des Utilisateurs (CRITIQUE) :</strong>
                            <br/>Allez dans le sous-menu <strong>Gestion des utilisateurs</strong>.
                            <br/>Par défaut, il n'y a pas d'utilisateur admin. Vous DEVEZ en créer un pour accéder aux fichiers.
                            
                            <div className="mt-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-700 dark:text-slate-200 uppercase">
                                    <Lock size={12}/> Configuration recommandée
                                </div>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    <li>Nom d'utilisateur : <code>admin</code></li>
                                    <li>Niveau d'accès : <strong>Sélectionnez les droits suivants :</strong></li>
                                    <li className="ml-4 text-green-700 dark:text-green-400 font-mono">☑ Lire les fichiers (Read files)</li>
                                    <li className="ml-4 text-green-700 dark:text-green-400 font-mono">☑ Écrire/supprimer des fichiers (Write/Delete files)</li>
                                    <li className="ml-4 font-mono opacity-70">☐ Modifier l'état de fonctionnement (Optionnel)</li>
                                </ul>
                            </div>
                        </div>
                    </li>

                    <li className="flex gap-3">
                        <span className="badge-step">4</span>
                        <div>
                            <strong>Chargement :</strong>
                            <br/>Compilez (Matériel complet) et chargez la configuration dans l'automate.
                        </div>
                    </li>
                </ol>
            </SectionCard>

            {/* ETAPE 2 : PROGRAMMATION */}
            <SectionCard>
                <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg"><Save size={24} className="text-teal-600 dark:text-teal-400"/></div>
                    <h3 className="font-bold text-lg">Étape 2 : Programmation (Blocs DataLog)</h3>
                </div>

                <div className="text-sm space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-700 dark:text-white mb-2">1. DataLogCreate (Création)</h4>
                        <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-400">
                            <li>Ce bloc doit être appelé <strong>une seule fois</strong> (sur front montant `REQ`).</li>
                            <li><strong>NAME :</strong> Nom du fichier (ex: <code>'Production_2024'</code>).</li>
                            <li><strong>HEADER :</strong> Entêtes des colonnes CSV (ex: <code>'Heure,Temperature,Pression'</code>).</li>
                            <li><strong>DATA :</strong> Structure (UDT ou Struct) contenant les variables à archiver.</li>
                            <li><strong>RECORDS :</strong> Nombre de lignes max avant écrasement (Circulaire) ou arrêt.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-700 dark:text-white mb-2">2. DataLogWrite (Écriture)</h4>
                        <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-400">
                            <li>Appelé à chaque fois que vous voulez enregistrer une ligne (ex: Top horloge 1min ou Fin de cycle).</li>
                            <li>L'entrée <strong>ID</strong> doit être reliée à la sortie <code>ID</code> du bloc <em>DataLogCreate</em>.</li>
                            <li>Les valeurs écrites sont celles présentes dans la structure définie en <code>DATA</code> au moment du front montant.</li>
                        </ul>
                    </div>

                    <div className="flex gap-2 items-start text-xs text-slate-500 italic">
                        <CheckCircle2 size={14} className="mt-0.5 text-green-500"/>
                        <span>Astuce : Utilisez <strong>DataLogOpen</strong> si l'automate redémarre pour continuer d'écrire dans le fichier existant sans le recréer (sinon erreur).</span>
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
                        <span>Ouvrez votre navigateur et tapez l'adresse IP de l'automate (ex: <code>https://192.168.0.1</code>).</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">2</span>
                        <span>Cliquez sur "ENTER" et connectez-vous avec l'utilisateur (<code>admin</code>) créé à l'étape 1.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">3</span>
                        <div>
                            Dans le menu de gauche, cliquez sur <strong>"Navigateur de fichiers"</strong> (File Browser).
                            <br/>Si le menu n'apparait pas, vérifiez les droits de l'utilisateur.
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="badge-step">4</span>
                        <span>Ouvrez le dossier <strong>DataLogs</strong>. Vos fichiers <code>.csv</code> sont ici. Clic droit &gt; "Enregistrer la cible sous..." pour télécharger.</span>
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