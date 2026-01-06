# Portail Technique Electro-Reims ⚡

Application web centralisant les outils d'ingénierie, calculateurs et procédures pour les techniciens et ingénieurs d'Electro-Reims.

![Logo Electro-Reims](/public/logo.svg)

## 🚀 Fonctionnalités

Le portail est divisé en 6 univers technologiques :

### 1. Siemens (Automatisme)
* **Calculateur Profinet** : Estimation de charge réseau et bande passante.
* **Sélecteur CPU** : Aide au choix (S7-1200/1500) et migration.
* **Procédures** : Mise à jour Firmware, Archivage DataLog.

### 2. Belden / Hirschmann (Réseau Industriel)
* **Générateur CLI** : Script de config rapide pour switchs HiOS (BRS/GRS).
* **Topologie MRP** : Concepteur visuel d'anneaux redondants.
* **Procédures** : Mise en œuvre MACsec (Chiffrement).

### 3. Etic Telecom (Interconnexion)
* **Simulateur NAT** : Visualisation interactive des flux (SNAT/DNAT).
* **Générateur VPN** : Configuration IPSec Site-à-Site.
* **Mise en service** : Assistant de connexion RAS (4G/Wi-Fi).

### 4. Stormshield (Cybersécurité)
* **Générateur de Règles** : Création de matrice de flux et export CSV.
* **Audit Hardening** : Checklist de sécurité ANSSI interactive.

### 5. GESCO (Interne)
* **Calculateur de Marge** : Simulation de prix de vente et rentabilité.
* **Générateur d'Offre** : Conversion de tableaux Excel vers import GESCO (.ODS).
* **Procédures** : Saisie des AR fournisseurs.

### 6. Boîte à Outils (Atelier)
* **Élec** : Calculateur de chute de tension, Loi d'Ohm, Puissance moteur.
* **Data** : Convertisseur Hex/Bin/Float, Mise à l'échelle (Scaling).
* **Instrumentation** : Table de conversion PT100.
* **Réseau** : Calculateur IP / CIDR.

---

## 🛠️ Installation & Démarrage

Ce projet utilise **React** + **Vite**.

### Pré-requis
* Node.js (v18 ou supérieur)
* npm (inclus avec Node.js)

### Installation
1.  Cloner le projet ou extraire l'archive.
2.  Ouvrir un terminal dans le dossier du projet.
3.  Installer les dépendances :
    ```bash
    npm install
    ```

### Lancer en développement (Local)
Pour tester l'application sur votre PC :
```bash
npm run dev