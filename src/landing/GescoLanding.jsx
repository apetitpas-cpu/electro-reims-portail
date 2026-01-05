import React, { useState } from 'react';
import { 
  Database, Calculator, ExternalLink, 
  ShoppingCart, TrendingUp, Wrench, Users, Award, Monitor 
} from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle, DocCard, DocsGrid } from "../components/UI";

const GescoLanding = () => {
  const [activeTab, setActiveTab] = useState('fournisseurs');

  // Configuration des catégories
  const categories = [
    { 
      id: 'fournisseurs', 
      label: 'Fournisseurs', 
      icon: ShoppingCart, 
      color: 'emerald', // Vert
      docs: [
        { title: "Procédure Saisie AR", subtitle: "Règles délais & ports", link: "/gesco/ar-procedure", type: "link" },
        { title: "Contrôle Factures", subtitle: "Vérification, litiges et avoirs", link: "react-ag25/public/GescoProcedure/Contrôle_Facture_Gemini.pdf", type: "pdf" },
      ]
    },
    { 
      id: 'acceuiltel', label: 'Accueil Tel', icon: TrendingUp, color: 'blue', docs: []
    },
    { 
      id: 'clientcde', label: 'Client Commande', icon: Wrench, color: 'orange', docs: []
    },
    { 
      id: 'colis', label: 'Colis', icon: Users, color: 'pink', docs: []
    },
    { 
      id: 'réappro', label: 'Réappro', icon: Award, color: 'purple', docs: []
    },
    { 
      id: 'tarrifoffre', label: 'Tarif Offre', icon: Monitor, color: 'slate', docs: []
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab);

  return (
    <PageContainer>
      
      <BrandHeader 
        title="Outil GESCO" 
        subtitle="Gestion Commerciale & Suivi d'Affaires Interne"
        icon={Database}
      />

      {/* --- PARTIE 1 : DOCUMENTATION --- */}
      <div>
        <SectionTitle title="Fiches Mémo" badge="Ressources" />

        {/* --- BARRE DE SÉLECTION (Desktop) --- */}
        <div className="mb-8">
            <div className="flex flex-wrap gap-3">
                {categories.map((cat) => {
                    const isActive = activeTab === cat.id;
                    const count = cat.docs.length;

                    // Styles dynamiques (Couleur Active vs Inactive)
                    const colorStyles = {
                        emerald: isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200 ring-2 ring-emerald-500/20' : 'hover:bg-emerald-50 text-slate-600',
                        blue: isActive ? 'bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-500/20' : 'hover:bg-blue-50 text-slate-600',
                        orange: isActive ? 'bg-orange-100 text-orange-800 border-orange-200 ring-2 ring-orange-500/20' : 'hover:bg-orange-50 text-slate-600',
                        pink: isActive ? 'bg-pink-100 text-pink-800 border-pink-200 ring-2 ring-pink-500/20' : 'hover:bg-pink-50 text-slate-600',
                        purple: isActive ? 'bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-purple-500/20' : 'hover:bg-purple-50 text-slate-600',
                        slate: isActive ? 'bg-slate-200 text-slate-800 border-slate-300 ring-2 ring-slate-500/20' : 'hover:bg-slate-100 text-slate-600',
                    };
                    
                    const styleClass = colorStyles[cat.color] || colorStyles.slate;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`
                                flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-200
                                ${isActive ? 'shadow-sm font-bold scale-105 border-transparent' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}
                                ${styleClass}
                            `}
                        >
                            <cat.icon size={18} className={isActive ? '' : 'opacity-70'} />
                            <span>{cat.label}</span>
                            
                            {/* Compteur discret */}
                            {count > 0 && (
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* --- CONTENU --- */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 key={activeTab}">
            <div className="flex items-center gap-2 mb-4 opacity-50 text-xs font-bold uppercase tracking-wider">
                <currentCategory.icon size={14} />
                Documentation {currentCategory.label}
            </div>

            <DocsGrid>
                {currentCategory.docs.length > 0 ? (
                    currentCategory.docs.map((doc, i) => (
                        <DocCard 
                            key={i}
                            title={doc.title}
                            subtitle={doc.subtitle}
                            link={doc.link}
                            type={doc.type}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-3 text-slate-400">
                            <currentCategory.icon size={32} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            Aucune fiche disponible pour "{currentCategory.label}"
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Cette section est en cours de construction.
                        </p>
                    </div>
                )}
            </DocsGrid>
        </div>
      </div>

      {/* --- SÉPARATEUR --- */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-12"></div>

      {/* --- PARTIE 2 : OUTILS --- */}
      <div>
        <SectionTitle title="Modules GESCO" badge="Applications" />
        <ToolsGrid>
            <ToolCard 
              to="/gesco/offre" 
              title="Générateur d'offres"
              description="Convertisseur tableau client vers import Gesco."
              icon={ExternalLink}
              status="active"
              color="purple"
              badge="Bêta"
            />
            <ToolCard 
              to="/gesco/margin" 
              title="Calculateur de Marge"
              description="Simulateur de rentabilité par affaire."
              icon={Calculator}
              status="active" 
              color="purple"  
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default GescoLanding;