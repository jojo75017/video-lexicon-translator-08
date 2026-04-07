

## Plan: Finaliser le nettoyage UI (label Introduction)

Les corrections techniques (suppression préface du pipeline audio + nettoyage JSON) sont déjà en place. Il reste uniquement la clarification de l'interface.

### Modifications

**Fichier : `src/components/ebook/AudioExpressWorkflow.tsx`**

1. **Ligne 34** — Mettre à jour la description du step A1 : remplacer `'Titre, auteur, catégorie, introduction et contenu des chapitres'` par `'Titre, auteur, catégorie et contenu des chapitres'`

2. **Ligne 442** — Renommer le label du champ : remplacer `📖 Introduction / Résumé` par `📝 Notes internes (non lu dans l'audio)`

3. **Ligne 443** — Mettre à jour le placeholder : remplacer `Résumé ou introduction du livre audio...` par `Notes de projet, résumé interne... (ce texte ne sera pas lu dans l'audio)`

### Résultat
L'utilisateur comprend clairement que ce champ est informatif uniquement et ne sera jamais inclus dans la synthèse vocale.

