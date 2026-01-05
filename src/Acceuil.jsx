import React from 'react';
// J'ai ajouté l'icône 'Database' pour Gesco
import { Zap, Network, Cpu, ShieldCheck, Phone, Mail, Info, Database } from "lucide-react";

import { 
  PageContainer, BrandHeader, ToolsGrid, ToolCard, 
  WelcomeSection, SectionTitle, ContactGrid, ContactCard 
} from "./components/UI";

const Acceuil = () => {
  return (
    <PageContainer>
      
      {/* 1. EN-TÊTE */}
      <BrandHeader 
        title="Electro-Reims" 
        subtitle="Portail d'Ingénierie & Solutions Industrielles"
        icon={Zap}
      />

      {/* 2. PRÉSENTATION */}
      <WelcomeSection title="Bienvenue sur votre espace technique">
        <p>
          Cette plateforme centralise les outils de calcul, les simulateurs et les générateurs de configuration 
          pour nos partenaires technologiques. Elle est conçue pour assister nos équipes 
          d'ingénierie et nos clients dans le déploiement d'architectures sécurisées.
        </p>
      </WelcomeSection>

      {/* 3. Outils Internes */}
      <div className="mb-12">
        <SectionTitle badge="Interne" title="Gestion & Outils Business" />
        
        <ToolsGrid>
            <ToolCard 
              to="/gesco"
              title="GESCO"
              description="Gestion Commerciale, Suivi d'Affaires et Base Articles."
              icon={Database}
            />
            {/* Vous pourrez ajouter d'autres outils internes ici (ex: Planning, Congés...) */}
        </ToolsGrid>
      </div>

      {/* 4. SECTION CATALOGUE (Constructeurs) */}
      <div className="mb-8">
        <SectionTitle badge="Technique" title="Nos Univers Technologiques" />
        
        <ToolsGrid>
            <ToolCard 
              to="/etic"
              title="Univers Etic"
              description="Routeurs M2M, VPN IPSec et interconnexions réseaux complexes."
              icon={Network}
            />
            <ToolCard 
              to="/siemens"
              title="Univers Siemens"
              description="Automates S7-1200/1500, Profinet et Supervision Unified."
              icon={Cpu}
            />
            <ToolCard 
              to="/stormshield"
              title="Univers Stormshield"
              description="Cybersécurité souveraine, Firewalls SNI et protection des endpoints."
              icon={ShieldCheck}
            />
        </ToolsGrid>
      </div>

      {/* 5. PIED DE PAGE CONTACTS */}
      <ContactGrid>
          <ContactCard 
             label="Support Technique" 
             value="03 26 00 00 00" 
             icon={Phone} 
             color="blue"
          />
          <ContactCard 
             label="Email Bureau d'Étude" 
             value="be@electro-reims.fr" 
             icon={Mail} 
             color="indigo"
          />
          <ContactCard 
             label="Version Portail" 
             value="v1.5 (Gesco)" 
             icon={Info} 
             color="emerald"
          />
      </ContactGrid>

    </PageContainer>
  );
}

export default Acceuil;