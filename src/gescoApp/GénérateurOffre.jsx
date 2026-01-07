import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { Table, Play, Download, AlertTriangle, Upload, FileSpreadsheet, Loader2, CheckCircle2, Info } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard } from '../components/UI';

// Worker PDF
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const GénérateurOffre = () => {
  const [processedData, setProcessedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [offerNumber, setOfferNumber] = useState("OFF-2025-XXXX");
  const fileInputRef = useRef(null);

  // --- REGLES MARQUES (Pour nettoyage) ---
  const BRAND_RULES = {
    wago: { keywords: ['wago', 'wag'], prefix: 'WAG' },
    siemens: { keywords: ['siemens', 'sie', '6es', '6sl', '6av'], prefix: 'SIE' },
    hirschmann: { keywords: ['hirschmann', 'hir', '942'], prefix: 'HIR' },
    tecknomega: { keywords: ['tecknomega', 'teknomega', 'tek'], prefix: 'TEK' },
    phoenix: { keywords: ['phoenix', 'pxc', 'contact'], prefix: 'PXC' },
    schneider: { keywords: ['schneider', 'sch', 'se', 'lc1', 'a9f'], prefix: 'SCH' },
    legrand: { keywords: ['legrand', 'leg', '077'], prefix: 'LEG' },
    capri: { keywords: ['capri', 'cap'], prefix: 'CAP' },
  };

  // --- 1. LECTURE PDF AVEC COORDONNÉES (X, Y) ---
  const extractItemsFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let allItems = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // On normalise : Y=0 en haut (PDFJS met 0 en bas)
      const viewport = page.getViewport({ scale: 1.0 });
      
      const pageItems = textContent.items.map(item => ({
        text: item.str.trim(),
        x: item.transform[4], // Position Gauche
        y: viewport.height - item.transform[5], // Position Haut (inversée pour lecture naturelle)
        w: item.width,
        h: item.height,
        page: i
      })).filter(i => i.text.length > 0);

      allItems = [...allItems, ...pageItems];
    }
    return allItems;
  };

  // --- 2. ANALYSE PAR COLONNES (LE CERVEAU) ---
  const analyzeData = (items) => {
    let rowsFound = [];
    let debugLog = [];

    // Etape A : Détection des En-têtes (Pour trouver les positions X des colonnes)
    // On cherche des mots clés typiques d'en-tête
    const headers = items.filter(i => /^(Code|Ref|Réf|Article|Désignation|Qté|Quantité|Prix|Montant)/i.test(i.text));
    
    // On essaie de grouper les en-têtes par ligne Y (tolérance 5px)
    let headerY = -1;
    let headerCandidates = {}; // y -> count
    headers.forEach(h => {
        const yKey = Math.floor(h.y / 5) * 5;
        headerCandidates[yKey] = (headerCandidates[yKey] || 0) + 1;
    });
    
    // La ligne Y qui a le plus de mots-clés est probablement la ligne d'en-tête
    const bestHeaderY = Object.keys(headerCandidates).reduce((a, b) => headerCandidates[a] > headerCandidates[b] ? a : b, -1);
    
    let columnMap = { refX: -1, qtyX: -1, descX: -1 };
    
    if (bestHeaderY !== -1) {
        // On récupère les positions X des colonnes identifiées
        const headerRow = headers.filter(h => Math.abs(h.y - bestHeaderY) < 20);
        
        headerRow.forEach(h => {
            const txt = h.text.toLowerCase();
            if (txt.includes('code') || txt.includes('ref') || txt.includes('article')) columnMap.refX = h.x;
            if (txt.includes('qt') || txt.includes('quant')) columnMap.qtyX = h.x;
            if (txt.includes('désign') || txt.includes('design')) columnMap.descX = h.x;
        });
        debugLog.push(`En-têtes détectés à Y=${bestHeaderY}. Colonnes : Ref(X=${Math.floor(columnMap.refX)}), Qté(X=${Math.floor(columnMap.qtyX)})`);
    }

    // Etape B : Reconstruction des Lignes (Row Building)
    // On groupe les items par "Ligne visuelle" (même Y à +/- 5px)
    let rows = {};
    items.forEach(item => {
        // On ignore l'en-tête lui-même
        if (bestHeaderY !== -1 && Math.abs(item.y - bestHeaderY) < 20) return;

        const yKey = Math.floor(item.y / 10) * 10; // Tolérance ligne 10px
        if (!rows[yKey]) rows[yKey] = [];
        rows[yKey].push(item);
    });

    // Etape C : Extraction des Données
    Object.keys(rows).sort((a,b) => Number(a) - Number(b)).forEach(y => {
        const rowItems = rows[y];
        
        // 1. Chercher la QUANTITÉ (Priorité absolue)
        // Stratégie : Soit dans la colonne Qté (si détectée), soit par Regex "Nombre isolé"
        let qtyCandidate = null;
        
        // Si on a une colonne Qté, on regarde qui est dedans (Tolérance X +/- 50px)
        if (columnMap.qtyX !== -1) {
            qtyCandidate = rowItems.find(i => Math.abs(i.x - columnMap.qtyX) < 100 && /^[0-9]+([.,][0-9]+)?$/.test(i.text.replace(/\s/g,'')));
        }
        
        // Fallback Regex (ex: "2,000 PIECE")
        if (!qtyCandidate) {
            qtyCandidate = rowItems.find(i => /^[0-9]+([.,][0-9]+)?\s*(PC|U|M|ST|PIECE)?$/i.test(i.text.trim()) && !i.text.includes('/'));
        }

        // Si pas de quantité sur la ligne, c'est probablement du blabla -> On ignore la ligne
        if (!qtyCandidate) return;

        // Nettoyage valeur quantité
        let qtyVal = parseFloat(qtyCandidate.text.replace(',', '.').replace(/[^\d.]/g, ''));
        // Correction "2.000" (US/FR) -> Si > 1000 et entier pile (ex 2000), c'est suspect pour une pièce unitaire, mais possible pour du câble.
        // Dans votre cas Ferry, "2,000" = 2.
        if (qtyCandidate.text.includes(',') && qtyCandidate.text.split(',')[1].length === 3) {
             // C'est souvent un format FR 3 décimales (2,000 = 2)
             // On garde le float parse standard, JS gère "2.000" comme 2.
        }

        // 2. Chercher la RÉFÉRENCE
        let refCandidate = null;
        let brandCandidate = null;

        // Stratégie A : Colonne Réf (Si table propre comme DEMPRIX)
        if (columnMap.refX !== -1) {
            // On cherche l'item le plus proche de la colonne Ref
            refCandidate = rowItems.find(i => Math.abs(i.x - columnMap.refX) < 80 && i !== qtyCandidate);
        }

        // Stratégie B : Anchor (Si table complexe comme Ferry avec "N/Ref.:")
        if (!refCandidate) {
            // On cherche un item qui contient "Ref" ou "Code" sur la ligne
            const anchor = rowItems.find(i => /(Ref\.|N\/Ref|Code)/i.test(i.text));
            if (anchor) {
                // La ref est souvent DANS le même item (ex: "N/Ref.:1234") ou JUSTE APRES
                const parts = anchor.text.split(/[:.]/);
                if (parts.length > 1 && parts[parts.length-1].trim().length > 2) {
                    refCandidate = { text: parts[parts.length-1].trim() };
                } else {
                    // Sinon on prend l'item suivant (trié par X)
                    const sortedRow = rowItems.sort((a,b) => a.x - b.x);
                    const anchorIdx = sortedRow.indexOf(anchor);
                    if (anchorIdx < sortedRow.length - 1) {
                        refCandidate = sortedRow[anchorIdx + 1];
                    }
                }
            }
        }

        // Stratégie C : Détection Pattern (Dernier recours)
        if (!refCandidate) {
            // On cherche un mot qui ressemble à une ref (alphanumerique, >3 chars, pas un mot commun)
            refCandidate = rowItems.find(i => 
                i !== qtyCandidate && 
                i.text.length > 4 && 
                /[A-Z0-9]/.test(i.text) && 
                !/(Désignation|Article|Prix|Montant|Délai|PIECE)/i.test(i.text)
            );
        }

        if (refCandidate && qtyVal > 0) {
            // Nettoyage Ref
            let cleanRef = refCandidate.text.replace(/[:.]/g, '').trim();
            
            // Détection Marque
            let detectedBrand = '?';
            for (const [key, config] of Object.entries(BRAND_RULES)) {
                if (config.keywords.some(k => cleanRef.toLowerCase().includes(k)) || (config.prefix && cleanRef.startsWith(config.prefix))) {
                    detectedBrand = key;
                    if(config.format) cleanRef = config.format(cleanRef); // Nettoyage spécifique (ex: Enlever SIE)
                    break;
                }
            }

            rowsFound.push({
                qty: qtyVal,
                ref: cleanRef.toUpperCase(),
                brand: detectedBrand.toUpperCase(),
                raw: `Ligne Y=${y}`
            });
        }
    });

    // Agrégation
    const aggregated = Object.values(rowsFound.reduce((acc, curr) => {
        if (!acc[curr.ref]) acc[curr.ref] = { ...curr };
        else acc[curr.ref].qty += curr.qty;
        return acc;
    }, {}));

    setProcessedData(aggregated);
    setLogs(debugLog);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setIsProcessing(true);
    setProcessedData([]);

    try {
        if (file.name.toLowerCase().endsWith('.pdf')) {
            const items = await extractItemsFromPdf(file);
            analyzeData(items);
        } else {
            // Pour Excel, on garde le simple parsing car Excel est déjà structuré
            const reader = new FileReader();
            reader.onload = (evt) => {
                const wb = XLSX.read(evt.target.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Tableau de tableaux
                // Conversion format items pour réutiliser analyzeData (simulation)
                let items = [];
                json.forEach((row, rowIndex) => {
                    row.forEach((cell, colIndex) => {
                        if(cell) items.push({ text: String(cell), x: colIndex * 100, y: rowIndex * 20, page: 1 });
                    });
                });
                analyzeData(items);
            };
            reader.readAsBinaryString(file);
        }
    } catch (err) {
        console.error(err);
        setLogs(["Erreur critique lecture fichier."]);
    }
    setIsProcessing(false);
  };

  const exportODS = () => {
    const header = ["Numéro d'offre", "Quantité", "Référence", "Code article", "Désignation", "Marque", "Groupe", "Prix Net", "Unité", "Devise", "Délais", "Délais 2", "Nuaff", "Commentaire", "Mini F", "Cdt"];
    const rows = processedData.map(item => [
      offerNumber, item.qty, item.ref, "", "", item.brand === '?' ? '' : item.brand, "", "", "U", "", "", "", "", "", "", ""
    ]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Import_Gesco");
    XLSX.writeFile(wb, `Import_${offerNumber}.ods`, { bookType: 'ods' });
  };

  return (
    <PageContainer>
      <BrandHeader title="Générateur d'Offre 3.0" subtitle="Moteur 'Columnar' : Haute précision PDF/Excel" icon={Table} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
            <SectionCard title="1. Import Intelligent">
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">N° Offre Cible</label>
                    <input type="text" value={offerNumber} onChange={(e) => setOfferNumber(e.target.value)} className="w-full border p-2 rounded mt-1 text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white"/>
                </div>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${fileName ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 hover:border-indigo-500'}`} onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.xlsx,.xls" className="hidden" />
                    {isProcessing ? <div className="flex flex-col items-center text-indigo-600"><Loader2 className="animate-spin mb-2" size={32}/><span className="text-sm font-bold">Détection des colonnes...</span></div> : fileName ? <div className="text-emerald-700 dark:text-emerald-400 font-bold flex flex-col items-center"><CheckCircle2 size={32} className="mb-2"/><span>{fileName}</span></div> : <div className="text-slate-500"><Upload size={32} className="mx-auto mb-2"/>Glisser PDF ou Excel</div>}
                </div>
                {logs.length > 0 && <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono text-slate-500 h-24 overflow-y-auto">{logs.map((l,i) => <div key={i}>{l}</div>)}</div>}
            </SectionCard>
        </div>

        <div className="space-y-4">
            <SectionCard title="2. Résultats" className="h-full flex flex-col">
                {processedData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[300px]"><Info size={40} className="mb-2 opacity-50"/><p className="text-sm">En attente...</p></div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2 px-1"><span className="text-xs font-bold text-slate-500">{processedData.length} articles détectés</span></div>
                        <div className="flex-1 overflow-auto max-h-[500px] border rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                                    <tr><th className="p-3">Marque</th><th className="p-3">Réf</th><th className="p-3 text-right">Qté</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {processedData.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3"><span className="font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{row.brand}</span></td>
                                            <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{row.ref}</td>
                                            <td className="p-3 text-right font-bold text-slate-700 dark:text-slate-200">{row.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={exportODS} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 flex justify-center items-center gap-2 transition-transform active:scale-95 shadow-md"><Download size={20}/> Exporter ODS</button>
                    </>
                )}
            </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default GénérateurOffre;