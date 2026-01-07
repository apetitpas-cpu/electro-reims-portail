import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Table, Download, Trash2, Upload, Plus, FileSpreadsheet, FileX } from 'lucide-react';
import { PageContainer, BrandHeader, SectionCard, FormInput } from '../components/UI';

const GénérateurOffre = () => {
  // --- STATE ---
  const [items, setItems] = useState([]);
  const [offerNumber, setOfferNumber] = useState("OFF-2025-XXXX");
  const fileInputRef = useRef(null);

  // --- MOTEUR DE NETTOYAGE EXCEL ---
  const detectBrand = (text) => {
    if(!text) return "AUTRE";
    const t = text.toUpperCase();
    if(t.includes('WAGO') || t.startsWith('WAG')) return 'WAGO';
    if(t.includes('SIEMENS') || t.startsWith('SIE') || t.startsWith('6ES')) return 'SIEMENS';
    if(t.includes('SCHNEIDER') || t.startsWith('SCH') || t.startsWith('LC1')) return 'SCHNEIDER';
    if(t.includes('PHOENIX') || t.startsWith('PXC')) return 'PHOENIX';
    if(t.includes('LEGRAND') || t.startsWith('LEG')) return 'LEGRAND';
    return "AUTRE";
  };

  const formatRef = (ref, brand) => {
    let clean = ref.replace(/[\s\t]/g, '').toUpperCase(); // Supprime espaces
    if(brand === 'SIEMENS') clean = clean.replace(/^SIE/, '').replace(/O/g, '0');
    if(brand === 'WAGO') clean = clean.replace(/^WAG/, '');
    // Ajout prefixe standard
    const prefixMap = { 'WAGO': 'WAG', 'SIEMENS': 'SIE', 'SCHNEIDER': 'SCH', 'PHOENIX': 'PXC', 'LEGRAND': 'LEG' };
    if(prefixMap[brand] && !clean.startsWith(prefixMap[brand])) {
        return prefixMap[brand] + clean;
    }
    return clean;
  };

  // --- ACTIONS ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Tableau brut
            
            const newItems = [];
            // On essaie de trouver les colonnes intelligemment
            jsonData.forEach((row) => {
                // On cherche une ligne qui contient des données utiles (plus de 1 cellule remplie)
                if(row.length < 2) return;
                
                // Détection naïve : La cellule avec le plus de texte est souvent la désignation, 
                // celle avec des chiffres et lettres est la ref.
                let ref = "";
                let qty = 1;
                let brand = "AUTRE";

                row.forEach(cell => {
                    const txt = String(cell).trim();
                    // Si c'est un petit nombre -> Qté
                    if(/^[0-9]+([.,][0-9]+)?$/.test(txt) && parseFloat(txt) < 1000) {
                        qty = parseFloat(txt.replace(',', '.'));
                    }
                    // Si c'est alphanumérique > 4 chars -> Potentielle Ref
                    else if(txt.length > 4 && /[0-9]/.test(txt) && /[A-Z]/.test(txt.toUpperCase())) {
                        ref = txt;
                        brand = detectBrand(txt);
                    }
                });

                if(ref) {
                    newItems.push({
                        id: Date.now() + Math.random(),
                        brand,
                        ref: formatRef(ref, brand),
                        qty
                    });
                }
            });
            
            setItems(prev => [...prev, ...newItems]);
        } catch (error) {
            alert("Erreur lors de la lecture du fichier Excel.");
        }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // Reset input
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), brand: 'AUTRE', ref: '', qty: 1 }]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const exportODS = () => {
    const header = ["Numéro d'offre", "Quantité", "Référence", "Code article", "Désignation", "Marque", "Groupe", "Prix Net", "Unité", "Devise", "Délais", "Délais 2", "Nuaff", "Commentaire", "Mini F", "Cdt"];
    const rows = items.map(item => [
      offerNumber, item.qty, item.ref, "", "", item.brand, "", "", "U", "", "", "", "", "", "", ""
    ]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Import_Gesco");
    XLSX.writeFile(wb, `Import_${offerNumber}.ods`, { bookType: 'ods' });
  };

  return (
    <PageContainer>
      <BrandHeader title="Générateur d'Offre" subtitle="Import Excel & Saisie Rapide pour GESCO" icon={Table} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : OPTIONS */}
        <div className="space-y-6">
            <SectionCard title="1. Configuration">
                <FormInput label="Numéro d'Offre" value={offerNumber} onChange={(e) => setOfferNumber(e.target.value)} />
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Importer un fichier</label>
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="w-full py-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex flex-col items-center transition-all group"
                    >
                        <FileSpreadsheet className="text-slate-400 group-hover:text-indigo-500 mb-2" size={32} />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Fichier Excel (.xlsx)</span>
                        <span className="text-[10px] text-slate-400">Détection auto des colonnes</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h4 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-1 flex items-center gap-2">
                        <FileX size={16}/> Note sur les PDF
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                        L'import PDF a été désactivé pour garantir la fiabilité des données. Veuillez convertir vos PDF en Excel ou saisir les références manuellement ci-contre.
                    </p>
                </div>
            </SectionCard>

            <button onClick={exportODS} disabled={items.length === 0} className="w-full py-3 bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex justify-center items-center gap-2">
                <Download size={20}/> Générer le fichier .ODS
            </button>
        </div>

        {/* COLONNE DROITE : TABLEAU EDITABLE */}
        <div className="lg:col-span-2">
            <SectionCard title={`2. Panier (${items.length} articles)`} className="h-full flex flex-col">
                <div className="flex-1 overflow-auto max-h-[600px] min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3">Marque</th>
                                <th className="px-4 py-3">Référence</th>
                                <th className="px-4 py-3 w-20">Qté</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors">
                                    <td className="p-2">
                                        <input 
                                            type="text" 
                                            value={item.brand} 
                                            onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-2 py-1 outline-none font-bold text-slate-600 dark:text-slate-300 text-xs uppercase"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input 
                                            type="text" 
                                            value={item.ref} 
                                            onChange={(e) => updateItem(item.id, 'ref', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-2 py-1 outline-none font-mono text-indigo-600 dark:text-indigo-400 font-bold"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input 
                                            type="number" 
                                            value={item.qty} 
                                            onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))}
                                            className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded px-2 py-1 outline-none text-right font-bold"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Ligne d'ajout rapide */}
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                                <td colSpan="4" className="p-2">
                                    <button onClick={addItem} className="w-full py-2 text-slate-400 hover:text-indigo-600 flex justify-center items-center gap-2 font-bold text-xs transition-colors">
                                        <Plus size={16}/> Ajouter une ligne manuelle
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
};

export default GénérateurOffre;