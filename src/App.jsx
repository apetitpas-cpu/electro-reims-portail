import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// Import des pages d'accueil
import Acceuil from "./Acceuil";
import EticLanding from "./landing/EticLanding";
import SiemensLanding from "./landing/SiemensLanding";
import StormshieldLanding from "./landing/StormshieldLanding";
import BeldenLanding from "./landing/BeldenLanding";
import GescoLanding from "./landing/GescoLanding";
import InstrumentationLanding from "./landing/InstrumentationLanding"; // <-- Import Nouveau

// Import EticApp
import EticNatVisualizer from './eticApp/EticNatVisualizer';
import VpnGenerator from "./eticApp/VpnGenerator";
import RasCommissioning from "./eticProcedure/RasCommissioning"

// Import SiemensApp
import ProfinetCalculator from "./siemensApp/ProfinetCalculator";
import CpuSelector from "./siemensApp/CpuSelector";
import FirmwareUpdateProcedure from "./siemensProcedure/FirmwareUpdateProcedure";
import DataArchivingProcedure from "./siemensProcedure/DataArchivingProcedure";

// Import StormshieldApp
import RuleGenerator from "./stormshieldApp/RuleGenerator";
import HardeningChecklist from "./stormshieldApp/HardeningChecklist";

// Import BeldenAPP
import NetworkTopology from "./beldenApp/NetworkTopology";
import CliGenerator from "./beldenApp/CliGenerator";
import MacSecProcedure from "./beldenProcedure/MacSecProcedure";

// Import GescoApp
import GénérateurOffre from "./gescoApp/GénérateurOffre";
import MarginCalculator from "./gescoApp/MarginCalculator";
import ArProcedure from "./gescoProcedure/ArProcedure";

// Import ServiceInfoApp
import IpPlanAgence from "./serviceInfoApp/IpPlanAgence";

// Import InstrumentationApp 
import SensorSelectionGuide from "./instrumentationApp/SensorGuide";
import UnitConverter from "./instrumentationApp/UnitConverter";

// Import Toolbox
import DataConverter from "./toolboxApp/DataConverter";
import IpCalculator from "./toolboxApp/IpCalculator";
import VoltageCalculator from "./toolboxApp/VoltageCalculator";
import AnalogScaling from "./toolboxApp/AnalogScaling";
import PowerCalculator from "./toolboxApp/PowerCalculator";
import PsuCalculator from "./toolboxApp/PsuCalculator";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Page d'accueil */}
                    <Route path="/" element={<Acceuil />} />

                    {/* Menu Etic */}
                    <Route path="/etic" element={<EticLanding />} />
                    <Route path="/etic/nat" element={<EticNatVisualizer />} />
                    <Route path="/etic/vpn" element={<VpnGenerator />} />
                    <Route path="/etic/commissioning" element={<RasCommissioning />} />

                    {/* Menu Belden */}
                    <Route path="/belden" element={<BeldenLanding />} />
                    <Route path="/belden/topology" element={<NetworkTopology />} />
                    <Route path="/belden/cli" element={<CliGenerator />} />
                    <Route path="/belden/macsec" element={<MacSecProcedure />} />
                    
                    {/* Menu Siemens */}
                    <Route path="/siemens" element={<SiemensLanding />} />
                    <Route path="/siemens/profinet" element={<ProfinetCalculator />} />
                    <Route path="/siemens/selector" element={<CpuSelector />} />
                    <Route path="/siemens/firmware-update" element={<FirmwareUpdateProcedure />} />
                    <Route path="/siemens/archiving" element={<DataArchivingProcedure />} />

                    {/* Menu Stormshield */}
                    <Route path="/stormshield" element={<StormshieldLanding />}/>
                    <Route path="/stormshield/rules" element={<RuleGenerator />} />
                    <Route path="/stormshield/hardening" element={<HardeningChecklist />} />
                                       
                    {/* Menu GESCO */}
                    <Route path="/gesco" element={<GescoLanding />} />
                    <Route path="/gesco/offre" element={<GénérateurOffre />} />
                    <Route path="/gesco/margin" element={<MarginCalculator />} />
                    <Route path="/gesco/ar-procedure" element={<ArProcedure />} />

                    {/* Menu Service Info */}
                    <Route path="/service-info/ip-plan" element={<IpPlanAgence />} />

                    {/* Menu Instrumentation (NOUVEAU) */}
                    <Route path="/instrumentation" element={<InstrumentationLanding />} />
                    <Route path="/instrumentation/selection-guide" element={<SensorSelectionGuide />} />
                    <Route path="/instrumentation/converter" element={<UnitConverter />} />

                    {/* Menu ToolBox */}
                    <Route path="/toolbox/converter" element={<DataConverter />} />
                    <Route path="/toolbox/ip" element={<IpCalculator />} />
                    <Route path="/toolbox/elec" element={<VoltageCalculator />} />
                    <Route path="/toolbox/scaling" element={<AnalogScaling />} />
                    <Route path="/toolbox/power" element={<PowerCalculator />} />
                    <Route path="/toolbox/psu" element={<PsuCalculator />} />

                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;