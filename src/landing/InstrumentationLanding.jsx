import React from 'react';
import { Gauge, ClipboardList, Thermometer, Droplets } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle } from "../components/UI";

const InstrumentationLanding = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Univers Instrumentation" 
        subtitle="Mesure, Régulation et Capteurs de Process"
        icon={Gauge}
      />

      {/* --- OUTILS --- */}
      <div>
        <SectionTitle title="Outils d'Aide au Choix" badge="Applications" />
        <ToolsGrid>
            <ToolCard 
              to="/instrumentation/selection-guide"
              title="Guide de Choix Capteurs"
              description="Livre blanc interactif : Niveau, Pression, Température."
              icon={ClipboardList}
              color="indigo"
              status="active"
              badge="Nouveau"
            />
            {/* Future placeholders */}
            <ToolCard 
              to="/instrumentation/converter" // Lien vers la nouvelle route
              title="Conversion Unités"
              description="Bar ↔ PSI, m³/h ↔ l/min, °C ↔ °F..."
              icon={ArrowRightLeft} // Changement d'icône
              status="active" // On active la carte
              color="cyan" // Nouvelle couleur
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default InstrumentationLanding;