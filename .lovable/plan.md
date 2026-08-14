# Restaurer les accès V2, Prospects et Emails

## Problème confirmé
- La V2 existe toujours à `/ebook-planner`, et les pages **Prospects** (`/gestion-prospects`) et **Emails** (`/apercu-emails`) existent toujours derrière la protection administrateur.
- Ces accès sont présents dans certaines barres, mais pas de façon constante dans l’interface V3 réellement visible.
- Le bouton flottant V2/V3 a un comportement incorrect pour l’administrateur : depuis la V3, il propose « Dashboard admin » et renvoie vers `/admin` au lieu d’ouvrir la V2.

## Correction

### 1. Barre d’accès administrateur permanente
Ajouter sur les pages V3, uniquement lorsque le rôle administrateur est confirmé, une barre compacte et toujours visible avec quatre boutons explicites :

```text
[V2 — Générateur] [Prospects] [Emails] [Admin]
```

- **V2 — Générateur** → `/ebook-planner`
- **Prospects** → `/gestion-prospects`
- **Emails** → `/apercu-emails`
- **Admin** → `/admin`
- Affichage ordinateur et mobile, sans dépendre d’un sous-menu.
- Aucun de ces boutons ne doit passer par la page de vente.

### 2. Corriger la bascule flottante V2/V3
- Depuis une page V3, le bouton admin doit afficher clairement **Ouvrir V2** et ouvrir `/ebook-planner`.
- Depuis la V2, il doit afficher **Ouvrir V3** et ouvrir `/v3`.
- Supprimer le détour actuel par le tableau administrateur.

### 3. Clarifier les boutons déjà existants
- Renommer les libellés ambigus comme « Retour au générateur » en **Ouvrir EbookStudio V2**.
- Conserver les onglets **Prospects** et **Emails** dans la navigation admin existante.
- Ne supprimer ni déplacer aucune page métier.

## Validation réelle
Avec une session administrateur :
1. Ouvrir `/v3` et vérifier que les quatre boutons sont immédiatement visibles.
2. Tester successivement V2, Prospects, Emails et Admin.
3. Vérifier les URLs finales et le contenu de chaque page.
4. Revenir sur la V2 puis utiliser **Ouvrir V3**.
5. Confirmer qu’aucune action ne mène à `/commander`.
