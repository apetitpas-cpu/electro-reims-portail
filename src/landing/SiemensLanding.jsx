import { Cpu, Sigma, Scale } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle, DocsGrid, DocCard } from "../components/UI";

const SiemensLanding = () => {
  return (
    <PageContainer>
      
      <BrandHeader 
        title="Univers Siemens" 
        subtitle="Automates S7-1200/1500 et IHM Unified"
        icon={Cpu}
      />

      {/* --- PARTIE 1 : DOCUMENTATION --- */}
      <div>
        <SectionTitle title="Guides TIA Portal" badge="Ressources" />
        <DocsGrid>
            <DocCard 
                title="Mise à jour Firmware"
                subtitle="Procédure interactive (TIA, Web, SMC) et liens de téléchargement."
                link="/siemens/firmware-update"
                type="link"
            />
            <DocCard 
                title="Archivage Données (DataLog)"
                subtitle="Création de fichiers CSV et accès Web Server (S7-1200)."
                link="/siemens/archiving"
                type="link"
            />
            <DocCard 
                title="Sauvegarde S7-1500"
                subtitle="Procédure de Backup/Restore via Web Server (Sans TIA Portal)."
                link="/siemens/backup"
                type="link"
            />
        </DocsGrid>
      </div>

      {/* --- SÉPARATEUR --- */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-12"></div>

      {/* --- PARTIE 2 : OUTILS --- */}
      <div>
        <SectionTitle title="Calculateurs" badge="Outils" />
        <ToolsGrid>
            <ToolCard 
              to="/siemens/profinet"
              title="Calculateur Profinet"
              description="Estimer la charge réseau de vos IO-Devices."
              icon={Sigma}
              color="blue"
              badge="Bêta"
              status="active"
            />
            <ToolCard 
                to="/siemens/selector"
                title="Sélecteur CPU"
                description="Aide au choix (S7-1200 vs 1500) selon Motion, Safety et E/S."
                icon={Scale}
                color="blue" 
                badge="Bêta"
                status="active"
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default SiemensLanding;