import React from 'react';
// CORRECTION : Ajout de ArrowRightLeft dans les imports
import { Gauge, ClipboardList, Thermometer, Droplets, ArrowRightLeft } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle } from "../components/UI";

const InstrumentationLanding = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Univers Instrumentation" 
        subtitle="Mesure, Régulation et Capteurs de Process"
        icon={Gauge}
      />

      <div>
        <SectionTitle title="Procédures Techniques" badge="Ressources" />
        <DocsGrid>
          <DocCard 
            title="Test Boucle 4-20mA"
            subtitle="Méthodologie de dépannage capteur analogique"
            link="/instrumentation/loop-check"   
            type="link"                  
          />
        </DocsGrid>
      </div>

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
            
            <ToolCard 
              to="/instrumentation/converter"
              title="Conversion Unités"
              description="Bar ↔ Psi, m³/h ↔ l/min, °C ↔ °F..."
              icon={ArrowRightLeft}
              status="active"
              color="cyan"
              badge="Nouveau"
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default InstrumentationLanding;