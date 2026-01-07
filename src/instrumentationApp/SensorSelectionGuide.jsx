import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Droplets, Gauge, Thermometer, ArrowRight, Printer, Waves } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const SensorSelectionGuide = () => {
  const [activeTab, setActiveTab] = useState('flow');

  const questions = {
    flow: {
      title: "Débitmètre",
      icon: Waves,
      color: "text-cyan-600",
      items: [
        { q: "Technologie et Fluide ?", a: "Quelle techno envisagée ? Type de fluide (chargé ou non) ?" },
        { q: "Performance de mesure ?", a: "Plage de débit ? Précision requise ? Type de mesure (Volumique ou Massique) ?" },
        { q: "Contraintes Tuyauterie ?", a: "Diamètre de la tuyauterie ? Matériaux du corps (compatibilité chimique avec le fluide) ?" },
        { q: "Installation ?", a: "Contraintes d'encombrement ? Type d'alimentation disponible ?" },
        { q: "Communication ?", a: "Le signal de sortie souhaité ? Besoin d'affichage local et communication ?" }
      ]
    },
    pressure: {
      title: "Capteur de Pression",
      icon: Gauge,
      color: "text-indigo-600",
      items: [
        { q: "Type de pression ?", a: "Relative, Absolue ou Différentielle ?" },
        { q: "Conditions du Fluide ?", a: "Compatibilité chimique ? Température (du fluide et de l'environnement) ?" },
        { q: "Environnement & Sécurité ?", a: "Indice IP voulu ? Zone ATEX ou non ?" },
        { q: "Performance ?", a: "Étendue de mesure ? Précision voulue ? Temps de réponse ?" },
        { q: "Installation ?", a: "Technologie voulue ? Alimentation ? Raccordement process ?" },
        { q: "Sortie & Interface ?", a: "Signal de sortie ? Affichage et communication ?" }
      ]
    },
    level: {
      title: "Capteur de Niveau",
      icon: Droplets,
      color: "text-blue-600",
      items: [
        { q: "Type de détection ?", a: "Niveau TOR (détecteur seuil) ou Niveau Continu (capteur mesure) ?" },
        { q: "Caractéristiques Produit ?", a: "Liquide, Solide, Pâte ? Propriétés chimiques (corrosif, abrasif) ? Propriétés physiques (mousse, vapeur, poussière, agitation) ?" },
        { q: "Conditions de la Cuve ?", a: "Dimension et forme ? Température et Pression interne ?" },
        { q: "Installation ?", a: "Raccordement électrique ? Zone ATEX ou non ?" },
        { q: "Spécifications Capteur ?", a: "Technologie voulue ? Plage de mesure ? Précision ?" },
        { q: "Interface ?", a: "Afficheur local et Communication ?" }
      ]
    },
    temperature: {
      title: "Sonde de Température",
      icon: Thermometer,
      color: "text-red-600",
      items: [
        { q: "Paramètres de mesure ?", a: "Plage de température ? Précision et temps de réponse requis ?" },
        { q: "Milieu et Environnement ?", a: "Milieu (liquide, solide, gaz, surface) ? Env. (vibrations, humidité, chimique, corrosif, ATEX) ?" },
        { q: "Technologie PT100 ?", a: "Doigt de gant ? Longueur tige (min/max) ? Taille / Classe / 2,3,4 fils ? Tête ou sortie câble ?" },
        { q: "Autres Technologies ?", a: "Thermocouple (Câble prolongation) ? Thermistance ? Capteur Infrarouge ?" },
        { q: "Contexte ?", a: "Pour quelle application précise ?" }
      ]
    }
  };

  const currentCategory = questions[activeTab];
  const Icon = currentCategory.icon;

  return (
    <PageContainer>
      <BrandHeader 
        title="Guide de Choix Instrumentation" 
        subtitle="Aide-mémoire pour la détermination technique (Débit, Pression, Niveau, Température)"
        icon={ClipboardList}
        enablePrint={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MENU NAVIGATION */}
        <div className="lg:col-span-4 space-y-4 no-print">
            <SectionCard title="Type de Mesure">
                <div className="space-y-2">
                    {Object.entries(questions).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${activeTab === key ? `border-current ${data.color} bg-slate-50 dark:bg-slate-800 shadow-sm ring-1 ring-current` : 'border-transparent hover:bg-white dark:hover:bg-slate-800 text-slate-500'}`}
                        >
                            <data.icon size={24} />
                            <span className="font-bold text-lg">{data.title}</span>
                            {activeTab === key && <ArrowRight className="ml-auto" size={16}/>}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Conseil :</strong> Remplissez les champs à l'écran puis imprimez cette fiche pour la joindre à votre demande de prix fournisseur.
            </div>
        </div>

        {/* CONTENU CHECKLIST */}
        <div className="lg:col-span-8">
            <SectionCard className="min-h-[500px]">
                <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700 ${currentCategory.color}`}>
                    <Icon size={32} />
                    <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                </div>

                <div className="space-y-8">
                    {currentCategory.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start group break-inside-avoid">
                            <div className="mt-1 flex-none text-slate-300 group-hover:text-emerald-500 transition-colors no-print">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="flex-1">
                                {/* Question */}
                                <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">
                                    {item.q}
                                </h4>
                                
                                {/* Indication / Aide */}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
                                    {item.a}
                                </p>

                                {/* Zone de Réponse */}
                                <textarea 
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-y min-h-[60px] print:border-slate-300 print:bg-white print:text-black print:placeholder-transparent"
                                    placeholder="Spécifications..."
                                ></textarea>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default SensorSelectionGuide;