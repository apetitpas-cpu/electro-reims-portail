import { Cpu, Activity, Shield, Network, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle, DocsGrid, DocCard } from "../components/UI";

const StormshieldLanding = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Univers Stormshield" 
        subtitle="Firewall SNI10 & Switches Industriels"
        icon={Shield}
      />

      {/* --- PARTIE 1 : DOCUMENTATION --- */}
      <div>
        <SectionTitle title="Procédures Réseau" badge="Ressources" />
        <DocsGrid>
          
        </DocsGrid>
      </div>

      {/* --- SÉPARATEUR --- */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-12"></div>

      {/* --- PARTIE 2 : OUTILS --- */}
      <div>
        <SectionTitle title="Outils & Monitoring" badge="Applications" />
          <ToolsGrid>
            {/* CARTE 1 : REGLES */}
            <ToolCard 
              to="/stormshield/rules"
              title="Générateur de Règles"
              description="Création rapide de matrice de flux et export CSV."
              icon={FileSpreadsheet}
              status="active"
              color="blue"
              badge="Nouveau"
            />
             
             {/* CARTE 2 : HARDENING */}
             <ToolCard 
              to="/stormshield/hardening"
              title="Audit Hardening"
              description="Checklist de sécurité et calcul de score."
              icon={ShieldCheck}
              status="active"
              color="blue"
              badge="Nouveau"
            />
          </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default StormshieldLanding;