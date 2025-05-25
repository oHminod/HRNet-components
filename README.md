# HRNet DatePicker Components Library

Cette librairie propose le composant DatePicker, accessible sur npm sous forme de package :

1. **DatePicker**  
   Permet de saisir une date, d’ouvrir un calendrier interactif et de transmettre la valeur sélectionnée via un champ caché.

   - **Propriétés** :
     - `name?: string`
     - `value?: string` (valeur initiale, format "JJ/MM/AAAA")
     - `placeholder?: string`
     - `onChange?: (value: string) => void`
   - Affiche un champ texte, un bouton pour ouvrir le calendrier, et insère automatiquement un champ `<input type="hidden">` pour la soumission en formulaire.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- React (version 18 ou supérieure)
- ReactDOM (version 18 ou supérieure)

## Gestion du projet global

Cette section explique comment ajouter un composant, compiler la CSS, construire la librairie et la publier sur npm.

### 1. Ajouter un composant

- Créer un fichier sous `src/lib` pour votre nouveau composant.
- L’exporter dans `src/lib/index.tsx` pour l’inclure dans la librairie.

### 2. Compiler la CSS

- La compilation Tailwind génère components.css.
- Pour régénérer ce fichier, exécutez :
  ```sh
  npm run build-css
  ```
  (Voir `package.json` pour la définition du script.)

### 3. Construire la librairie

- Pour construire la librairie, exécutez :
  ```sh
  npm run build
  ```
  Cela compile votre code TypeScript et copie les fichiers nécessaires dans le dossier `dist`.

### 4. Publier sur npm

- Ajuster le numéro de version dans `package.json`.
- Pour publier sur npm, authentifiez-vous puis exécutez :
  ```sh
  npm publish
  ```
  Vous pouvez ainsi distribuer vos composants sous forme de package npm, prêt à être utilisé dans d’autres projets.
