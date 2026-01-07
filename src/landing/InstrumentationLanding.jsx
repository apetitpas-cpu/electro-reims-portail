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
              to="#"
              title="Conversion Unités"
              description="Bar ↔ Psi, °C ↔ °F, Débit..."
              icon={Gauge}
              status="disabled"
              color="slate"
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default InstrumentationLanding;