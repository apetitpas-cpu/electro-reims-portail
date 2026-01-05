import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// Import des pages
import Acceuil from "./Acceuil";
import EticLanding from "./landing/EticLanding";
import SiemensLanding from "./landing/SiemensLanding";
import StormshieldLanding from "./landing/StormshieldLanding";
import BeldenLanding from "./landing/BeldenLanding";
import GescoLanding from "./landing/GescoLanding";

// Import EticApp
import EticNatVisualizer from './eticApp/EticNatVisualizer';
import VpnGenerator from "./eticApp/VpnGenerator";
// Import EticProcedure
import RasCommissioning from "./eticProcedure/RasCommissioning"

// Import SiemensApp
import ProfinetCalculator from "./siemensApp/ProfinetCalculator";
import CpuSelector from "./siemensApp/CpuSelector";
// Import SiemensProcedure
import FirmwareUpdateProcedure from "./siemensProcedure/FirmwareUpdateProcedure";
import DataArchivingProcedure from "./siemensProcedure/DataArchivingProcedure";

// Import StormshieldApp
import RuleGenerator from "./stormshieldApp/RuleGenerator";
import HardeningChecklist from "./stormshieldApp/HardeningChecklist";
// Import StormshieldProcedure

// Import BeldenAPP
import NetworkTopology from "./beldenApp/NetworkTopology";
import CliGenerator from "./beldenApp/CliGenerator";
// Import BeldenProcedure
import MacSecProcedure from "./beldenProcedure/MacSecProcedure";

// Import GescoApp
import GénérateurOffre from "./gescoApp/GénérateurOffre";
import MarginCalculator from "./gescoApp/MarginCalculator";
// Import GescoProcedure
import ArProcedure from "./gescoProcedure/ArProcedure";

//Import Toolbox
import DataConverter from "./toolboxApp/DataConverter";
import IpCalculator from "./toolboxApp/IpCalculator";
import VoltageCalculator from "./toolboxApp/VoltageCalculator";
import AnalogScaling from "./toolboxApp/AnalogScaling";
import PowerCalculator from "./toolboxApp/PowerCalculator";
import Pt100Calculator from "./toolboxApp/Pt100Calculator";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Page d'accueil */}
                    <Route path="/" element={<Acceuil />} />

                    {/* Menu Etic */}
                    <Route path="/etic" element={<EticLanding />} />
                        {/* Outils */}
                    <Route path="/etic/nat" element={<EticNatVisualizer />} />
                    <Route path="/etic/vpn" element={<VpnGenerator />} />
                        {/* Procédures */}
                    <Route path="/etic/commissioning" element={<RasCommissioning />} />

                    {/* Menu Belden */}
                    <Route path="/belden" element={<BeldenLanding />} />
                        {/* Outils */}
                    <Route path="/belden/topology" element={<NetworkTopology />} />
                    <Route path="/belden/cli" element={<CliGenerator />} />
                        {/* Procédures */}
                    <Route path="/belden/macsec" element={<MacSecProcedure />} />
                    
                    {/* Menu Siemens */}
                    <Route path="/siemens" element={<SiemensLanding />} />
                        {/* Outils */}
                    <Route path="/siemens/profinet" element={<ProfinetCalculator />} />
                    <Route path="/siemens/selector" element={<CpuSelector />} />
                        {/* Procédures */}
                    <Route path="/siemens/firmware-update" element={<FirmwareUpdateProcedure />} />
                    <Route path="/siemens/archiving" element={<DataArchivingProcedure />} />

                    {/* Menu Stormshield */}
                    <Route path="/stormshield" element={<StormshieldLanding />}/>
                        {/* Outils */}
                    <Route path="/stormshield/rules" element={<RuleGenerator />} />
                    <Route path="/stormshield/hardening" element={<HardeningChecklist />} />
                        {/* Procédures */}
                                       
                    {/* Menu GESCO */}
                    <Route path="/gesco" element={<GescoLanding />} />
                        {/* Outils */}
                    <Route path="/gesco/offre" element={<GénérateurOffre />} />
                    <Route path="/gesco/margin" element={<MarginCalculator />} />
                        {/* Procédures */}
                    <Route path="/gesco/ar-procedure" element={<ArProcedure />} />

                    {/* Menu ToolBox */}
                    <Route path="/toolbox/converter" element={<DataConverter />} />
                    <Route path="/toolbox/ip" element={<IpCalculator />} />
                    <Route path="/toolbox/elec" element={<VoltageCalculator />} />
                    <Route path="/toolbox/scaling" element={<AnalogScaling />} />
                    <Route path="/toolbox/power" element={<PowerCalculator />} />
                    <Route path="/toolbox/pt100" element={<Pt100Calculator />} />

                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;