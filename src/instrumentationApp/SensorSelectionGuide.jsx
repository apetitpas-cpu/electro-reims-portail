import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Droplets, Gauge, Thermometer, ArrowRight } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const SensorSelectionGuide = () => {
  const [activeTab, setActiveTab] = useState('level');

  const questions = {
    level: {
      title: "Capteur de Niveau",
      icon: Droplets,
      color: "text-blue-600",
      items: [
        { q: "Nature du produit ?", a: "Liquide, Solide (Pulvérulent/Granuleux), Pâteux, Interface (Huile/Eau)." },
        { q: "Conditions de la cuve ?", a: "Cuve ouverte (Pression atm) ou fermée (Sous pression/Vide) ? Forme du fond ?" },
        { q: "Contraintes process ?", a: "Présence de mousse ? Agitation (Vagues) ? Condensation ? Dépôts colmatants ?" },
        { q: "Caractéristiques produit ?", a: "Constante diélectrique (pour Radar/Capacitif) ? Densité (pour Hydrostatique) ?" },
        { q: "Technologie souhaitée ?", a: "Sans contact (Radar/Ultrason) ou Contact (Sonde/Flotteur/Hydrostatique) ?" },
        { q: "Zone d'installation ?", a: "Zone ATEX ? Zone Hygiénique (Agro/Pharma) ?" }
      ]
    },
    pressure: {
      title: "Capteur de Pression",
      icon: Gauge,
      color: "text-indigo-600",
      items: [
        { q: "Type de pression ?", a: "Relative (vs Atm), Absolue (vs Vide), Différentielle (Delta P) ?" },
        { q: "Plage de mesure ?", a: "Échelle min/max ? Tenue à la surpression (Coups de bélier) ?" },
        { q: "Nature du fluide ?", a: "Gaz, Vapeur, Liquide ? Corrosif ? Abrasif ? Visqueux (Besoin membrane affleurante) ?" },
        { q: "Température du fluide ?", a: "Standard (-20/+80°C) ou Haute T° ? (Besoin d'un séparateur ou siphon) ?" },
        { q: "Raccordement Process ?", a: "Filetage (G1/2, NPT), Bride, Clamp, Raccord laitier ?" },
        { q: "Signal de sortie ?", a: "4-20mA, 0-10V, IO-Link, HART, Profibus ?" }
      ]
    },
    temperature: {
      title: "Sonde de Température",
      icon: Thermometer,
      color: "text-red-600",
      items: [
        { q: "Plage de température ?", a: "Min / Max en fonctionnement ? Pics de nettoyage (CIP/SIP) ?" },
        { q: "Type d'élément ?", a: "Pt100 (Précis <600°C) ou Thermocouple (Rapide/Haute T° >600°C) ?" },
        { q: "Montage mécanique ?", a: "À visser, À souder, De surface, Avec doigt de gant (démontage en charge) ?" },
        { q: "Longueur d'insertion ?", a: "Doit être suffisante pour éviter la dissipation thermique (min 50mm ou 10x diamètre)." },
        { q: "Transmetteur ?", a: "Tête B (Bornier simple), Transmetteur 4-20mA intégré, Afficheur local ?" },
        { q: "Temps de réponse ?", a: "Besoin d'une pointe réduite pour réactivité rapide ?" }
      ]
    }
  };

  const currentCategory = questions[activeTab];
  const Icon = currentCategory.icon;

  return (
    <PageContainer>
      <BrandHeader 
        title="Guide de Choix Instrumentation" 
        subtitle="Aide-mémoire pour la définition technique des capteurs"
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
                <strong>Conseil :</strong> Imprimez cette page ou exportez-la en PDF pour la joindre au dossier technique lors de la consultation fournisseurs.
            </div>
        </div>

        {/* CONTENU CHECKLIST */}
        <div className="lg:col-span-8">
            <SectionCard className="min-h-[500px]">
                <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700 ${currentCategory.color}`}>
                    <Icon size={32} />
                    <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                </div>

                <div className="space-y-6">
                    {currentCategory.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start group">
                            <div className="mt-1 flex-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">{item.q}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    {item.a}
                                </p>
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