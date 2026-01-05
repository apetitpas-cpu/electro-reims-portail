import { Network, ShieldCheck, ShieldOff } from "lucide-react";
import { PageContainer, BrandHeader, ToolsGrid, ToolCard, SectionTitle, DocsGrid, DocCard } from "../components/UI";

const EticLanding = () => {
  return (
    <PageContainer>
      <BrandHeader 
        title="Etic Telecom" 
        subtitle="Gamme RAS & IPL : Configuration et Simulateurs"
        icon={Network}
      />

      {/* --- PARTIE 1 : DOCUMENTATION --- */}
      <div>
        <SectionTitle title="Procédures Techniques" badge="Ressources" />
          <DocsGrid>
            <DocCard 
                title="Mise en service RAS E-Series"
                subtitle="Procédure interactive : Ethernet, Wi-Fi et 4G"
                link="/etic/commissioning"   
                type="link"                  
            />
            <DocCard 
                title="Accès base de connaissance Etic"
                subtitle="Lien externe vers le support officiel"
                link="https://www.etictelecom.com"
                type="link"
            />
          </DocsGrid>
      </div>

      {/* --- SÉPARATEUR --- */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-12"></div>

      {/* --- PARTIE 2 : OUTILS --- */}
      <div>
        <SectionTitle title="Outils & Simulateurs" badge="Outils" />
        <ToolsGrid>
            <ToolCard 
            to="/etic/nat"
            title="Simulateur NAT"
            description="Visualisation interactive du SNAT et DNAT."
            icon={ShieldCheck}
            color="emerald"
            badge="Nouveau"
            status="active"
            />
            <ToolCard 
            to="/etic/vpn"
            title="Générateur VPN"
            description="Assistant de création de tunnels IPSec."
            icon={ShieldOff}
            color="emerald"
            badge="Bêta"
            status="active"
            />
        </ToolsGrid>
      </div>

    </PageContainer>
  );
};

export default EticLanding;