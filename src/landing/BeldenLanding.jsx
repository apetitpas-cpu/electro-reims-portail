import React from 'react';
import { Cable, Network, Terminal } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle, DocsGrid, DocCard } from "../components/UI";

const BeldenLanding = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Univers Belden" 
        subtitle="Hirschmann, Lumberg & Solutions Réseaux"
        icon={Cable}
      />

      {/* --- PARTIE 1 : DOCUMENTATION --- */}
      <div>
        <SectionTitle title="Fiches Techniques & Procédures" badge="Ressources" />
        <DocsGrid>
            {/* CARTE MISE A JOUR */}
            <DocCard 
                title="Configuration MACsec (Hirschmann)"
                subtitle="Procédure de chiffrement GRS115 / BRS31."
                link="/belden/macsec" 
                type="link"
            />
            <DocCard 
                title="Configuration VLAN"
                subtitle="Procédure de mise en place des VLANS"
                link="/belden/vlan"
                type="link"
            />
        </DocsGrid>
      </div>

      {/* ... Suite du fichier (Séparateur et Outils) inchangée ... */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-12"></div>

      <div>
        <SectionTitle title="Outils de Configuration" badge="Applications" />
        <ToolsGrid>
            <ToolCard 
              to="/belden/cli"
              title="Générateur CLI"
              description="Script de mise en service rapide (IP, Admin, SSH)."
              icon={Terminal}
              status="active"
              color="orange"
              badge="Nouveau"
            />
            <ToolCard 
              to="/belden/topology" // Lien vers la nouvelle route
              title="Topologie Réseau"
              description="Concepteur d'anneaux redondants (MRP)."
              icon={Network}
              status="active" // On active la carte
              color="orange"
              badge="Nouveau"
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default BeldenLanding;