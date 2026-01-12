import React from 'react';
import { Activity, Zap, AlertTriangle, CheckSquare } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const LoopCheckProcedure = () => {
  return (
    <PageContainer>
      <BrandHeader 
        title="Test Boucle 4-20mA" 
        subtitle="Méthodologie de dépannage capteur analogique"
        icon={Activity}
        enablePrint={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : PRÉREQUIS */}
        <div className="md:col-span-1 space-y-4">
            <SectionCard title="Outillage">
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500"/> Multimètre (mA)</li>
                    <li className="flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500"/> Tournevis précision</li>
                    <li className="flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500"/> Plan de bornier</li>
                    <li className="flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500"/> Simulateur (Optionnel)</li>
                </ul>
            </SectionCard>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-yellow-800 dark:text-yellow-200 font-bold">
                    <AlertTriangle size={18}/> Sécurité
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Ne jamais mettre le multimètre en mode Ampèremètre en parallèle sur une source de tension (24V). Risque de court-circuit fusible.
                </p>
            </div>
        </div>

        {/* COLONNE DROITE : ÉTAPES */}
        <div className="md:col-span-2 space-y-6">
            
            <SectionCard title="1. Mesure de la Tension (V)">
                <p className="text-sm mb-2">Vérifier l'alimentation du capteur.</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono text-sm flex justify-between">
                    <span>VDC entre Borne + et -</span>
                    <span className="font-bold text-emerald-600">Attendu : &gt; 18 VDC</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Si 0V : Vérifier disjoncteur, fusible ou alimentation générale.</p>
            </SectionCard>

            <SectionCard title="2. Mesure du Courant (mA) - En Série">
                <p className="text-sm mb-4">Pour lire la valeur réelle envoyée par le capteur :</p>
                <ol className="list-decimal ml-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>Régler le multimètre sur <strong>mA DC</strong>.</li>
                    <li>Débrancher le fil de retour signal (souvent le fil - ou S+).</li>
                    <li>Placer le multimètre en <strong>SÉRIE</strong> entre le fil débranché et la borne.</li>
                </ol>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <strong>0 mA</strong><br/>Boucle ouverte / Capteur HS
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
                        <strong>4 mA</strong><br/>Mesure 0% (Min)
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
                        <strong>20 mA</strong><br/>Mesure 100% (Max)
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                        <strong>&gt; 21 mA</strong><br/>Défaut Capteur (Sursaturation)
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="3. Test d'isolement (Si mesure instable)">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Si la valeur oscille anormalement, vérifier le blindage.
                    <br/>Mesurer la tension AC entre le blindage et la terre (Doit être proche de 0V).
                </p>
            </SectionCard>

        </div>
      </div>
    </PageContainer>
  );
};

export default LoopCheckProcedure;