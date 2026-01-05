import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Table, Play, Download, Trash2, AlertTriangle, Upload, FileSpreadsheet } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

const GénérateurOffre = () => {
  // --- STATE ---
  const [inputText, setInputText] = useState("");
  const [processedData, setProcessedData] = useState([]);
  const [invalidRefs, setInvalidRefs] = useState([]);
  const [fileName, setFileName] = useState(""); // Nom du fichier importé
  
  // Paramètre global (Offre)
  const [offerNumber, setOfferNumber] = useState("OFF-2025-XXXX");
  const fileInputRef = useRef(null);

  // --- MOTEUR DE RÈGLES (Identique à avant) ---
  const BRAND_RULES = {
    wago: { keywords: ['wago', 'wag'], prefix: 'WAG', format: (ref) => ref },
    siemens: { keywords: ['siemens', 'sie'], prefix: '', format: (ref) => ref.replace(/^SIE/i, '').replace(/O/g, '0') },
    wera: { keywords: ['wera', 'wer'], prefix: 'WER' },
    hirschmann: { keywords: ['hirschmann', 'hir'], prefix: 'HIR' },
    tecknomega: { keywords: ['tecknomega', 'teknomega', 'tek'], prefix: 'tek' },
    pilz: { keywords: ['pilz', 'pil'], prefix: 'PIL' },
    murrelektronik: { keywords: ['murrelektronik', 'murr', 'mur'], prefix: 'mur' },
    socomec: { keywords: ['socomec', 'soc'], prefix: 'SOC' },
    schneider: { keywords: ['schneider', 'sch', 'se'], prefix: 'SCH' },
  };

  // --- GESTION IMPORT FICHIER (EXCEL) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      
      // On prend la première feuille
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      // On convertit tout le tableau en texte CSV (tabulé) pour le passer dans notre moteur
      // Cela permet de garder la même logique de détection que le copier-coller
      const data = XLSX.utils.sheet_to_csv(ws, { FS: " " }); // FS: " " remplace les séparateurs par des espaces
      
      setInputText(data);
    };
    reader.readAsBinaryString(file);
  };

  // --- LOGIQUE DE TRAITEMENT (Moteur existant) ---
  const processText = () => {
    const lines = inputText.split('\n');
    let results = [];
    let errors = [];

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      let detectedBrand = null;
      let brandConfig = null;

      const lowerLine = cleanLine.toLowerCase();
      
      for (const [key, config] of Object.entries(BRAND_RULES)) {
        if (config.keywords.some(k => lowerLine.includes(k))) {
          detectedBrand = key;
          brandConfig = config;
          break;
        }
      }

      if (!detectedBrand) {
        errors.push({ line: cleanLine, reason: "Marque non identifiée" });
        return;
      }

      // Nettoyage des virgules/points-virgules qui traînent depuis l'import CSV
      const cleanParts = cleanLine.replace(/[,;]/g, ' ').split(/[\s\t]+/).filter(p => !brandConfig.keywords.includes(p.toLowerCase()));
      
      let refRaw = "";
      let qty = 1;

      cleanParts.forEach(part => {
        if (/^\d+$/.test(part) && part.length < 5) {
            qty = parseInt(part, 10);
        } else {
            refRaw = part;
        }
      });

      if (!refRaw || refRaw.length < 3) {
        errors.push({ line: cleanLine, reason: "Référence trop courte ou absente" });
        return;
      }

      let cleanRef = refRaw.replace(/-/g, '');
      if (brandConfig.format) cleanRef = brandConfig.format(cleanRef);
      if (brandConfig.prefix && !cleanRef.toUpperCase().startsWith(brandConfig.prefix.toUpperCase())) {
        cleanRef = brandConfig.prefix + cleanRef;
      }

      results.push({
        brand: detectedBrand,
        originalRef: refRaw,
        finalRef: cleanRef,
        qty: qty
      });
    });

    // Regroupement
    const aggregated = Object.values(results.reduce((acc, curr) => {
      if (!acc[curr.finalRef]) {
        acc[curr.finalRef] = { ...curr };
      } else {
        acc[curr.finalRef].qty += curr.qty;
      }
      return acc;
    }, {}));

    setProcessedData(aggregated);
    setInvalidRefs(errors);
  };

  // --- EXPORT ODS ---
  const exportODS = () => {
    const header = [
      "Numéro d'offre", "Quantité", "Référence", "Code article", "Désignation", 
      "Marque", "Groupe", "Prix Net", "Unité d'affichage", "Devise", 
      "Délais", "Délais 2", "Nuaff", "Commentaire", "Mini F", "Cdt"
    ];

    const rows = processedData.map(item => [
      offerNumber,
      item.qty,
      item.finalRef,
      "", "",
      item.brand.toUpperCase(),
      "", "", "U", "",
      "", "", "", "", "", ""
    ]);

    const wsData = [header, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    XLSX.utils.book_append_sheet(wb, ws, "Import_ETN");
    
    // Écriture en .ODS
    XLSX.writeFile(wb, `Import_${offerNumber}.ods`, { bookType: 'ods' });
  };

  const clearAll = () => {
    setInputText("");
    setFileName("");
    setProcessedData([]);
    setInvalidRefs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <PageContainer>
      <BrandHeader 
        title="Générateur d'Offre" 
        subtitle="Import Excel/PDF -> Export ODS formaté Gesco"
        icon={Table}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLONNE GAUCHE : IMPORT */}
        <div className="space-y-4">
            <SectionCard title="1. Source des Données">
                
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">Numéro d'offre</label>
                    <input 
                        type="text" 
                        value={offerNumber} 
                        onChange={(e) => setOfferNumber(e.target.value)}
                        className="w-full border p-2 rounded mt-1 font-mono text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white"
                    />
                </div>

                {/* ZONE DE DRAG & DROP / UPLOAD */}
                <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer mb-4 ${fileName ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-slate-300 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800'}`}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept=".xlsx, .xls, .csv" 
                        className="hidden" 
                    />
                    
                    {fileName ? (
                        <div className="text-green-700 dark:text-green-400 font-bold flex flex-col items-center">
                            <FileSpreadsheet size={32} className="mb-2" />
                            <span>Fichier chargé :</span>
                            <span className="text-sm underline">{fileName}</span>
                        </div>
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Upload size={32} className="mb-2 text-indigo-500" />
                            <span className="font-bold text-sm">Cliquez pour importer un Excel</span>
                            <span className="text-xs mt-1 opacity-70">ou glissez votre fichier ici</span>
                        </div>
                    )}
                </div>

                {/* ZONE TEXTE (Editable si besoin) */}
                <div className="relative">
                     <textarea 
                        className="w-full h-40 p-3 border rounded font-mono text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                        placeholder="Le contenu du fichier apparaîtra ici. Vous pouvez aussi coller du texte brut (PDF)..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                        <button onClick={clearAll} className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded border shadow-sm">
                            <Trash2 size={14}/>
                        </button>
                    )}
                </div>

                <button 
                    onClick={processText}
                    disabled={!inputText}
                    className="w-full mt-4 bg-indigo-600 disabled:bg-slate-300 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700 font-bold transition-colors"
                >
                    <Play size={18} /> Traiter les données
                </button>
            </SectionCard>
            
            {/* LOG D'ERREURS */}
            {invalidRefs.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 animate-in slide-in-from-bottom-2">
                    <h4 className="text-red-700 dark:text-red-300 font-bold text-sm flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} /> Lignes ignorées ({invalidRefs.length})
                    </h4>
                    <ul className="max-h-32 overflow-y-auto list-disc list-inside text-[10px] text-red-600 dark:text-red-400 font-mono">
                        {invalidRefs.map((err, i) => (
                            <li key={i}><span className="opacity-70">{err.line.substring(0, 30)}...</span> : <b>{err.reason}</b></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* COLONNE DROITE : RESULTATS */}
        <div className="space-y-4">
            <SectionCard title="2. Prévisualisation & Export" className="h-full flex flex-col">
                {processedData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-300 dark:text-slate-600 min-h-[300px]">
                        <Table size={48} className="mb-4 opacity-50" />
                        <p className="italic">En attente de traitement...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-bold uppercase text-slate-500">{processedData.length} articles détectés</span>
                        </div>
                        
                        <div className="flex-1 overflow-auto max-h-[400px] border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 mb-4">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="p-3 text-slate-500">Marque</th>
                                        <th className="p-3 text-slate-500">Réf Finale</th>
                                        <th className="p-3 text-right text-slate-500">Qté</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {processedData.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px]">{row.brand}</td>
                                            <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{row.finalRef}</td>
                                            <td className="p-3 text-right text-slate-700 dark:text-slate-300 font-mono">{row.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button 
                            onClick={exportODS}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-emerald-700 flex justify-center items-center gap-2 transition-transform active:scale-95"
                        >
                            <Download size={20} /> Télécharger .ODS
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            Format OpenDocument compatible LibreOffice & Excel
                        </p>
                    </>
                )}
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default GénérateurOffre;