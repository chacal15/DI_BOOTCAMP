# ORBIT//ZERO

Jeu d’arcade orbital original réalisé en **HTML, CSS et JavaScript natif**, sans dépendance ni ressource externe.

## Principe

Deux orbes opposés tournent autour d’un réacteur. Alignez-les avec les deux brèches des anneaux qui convergent vers le centre. Plus le passage est précis, plus le **Flux** (multiplicateur) et l’énergie augmentent. L’**Impulsion** permet de traverser brièvement un anneau en cas d’urgence.

## Lancer le jeu

Les fichiers JavaScript utilisent les modules ES natifs. Servez simplement le dossier avec un petit serveur local :

```bash
cd orbit-zero
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Contrôles

### Clavier

- `←` / `→` ou `A` / `D` (`Q` est également accepté sur AZERTY) : tourner
- `Espace` : impulsion
- `P` ou `Échap` : pause / reprendre
- `R` : rejouer depuis l’écran de fin
- `M` : activer / couper le son

### Tactile / souris

- Maintenir la zone gauche ou droite du canvas, ou utiliser les boutons directionnels
- Glisser horizontalement pour un ajustement direct
- Bouton **PULSE** : impulsion

## Fonctionnalités

- Boucle `requestAnimationFrame`, delta-time plafonné et rendu adapté au DPR
- Contrôles clavier, souris, stylet et multitouch
- Difficulté progressive avec anneaux statiques et rotatifs
- Score, combo, multiplicateur, énergie et bonus de précision
- Particules plafonnées, halos, flashs, screen shake et transitions CSS
- Audio procédural Web Audio (aucun fichier à charger)
- Pause automatique quand l’onglet perd le focus
- Écran d’accueil, pause, fin et redémarrage sans rechargement
- Top 5 et indicatif sauvegardés dans `LocalStorage`
- Mise en page responsive avec prise en charge des safe areas mobiles
- Mode `prefers-reduced-motion`

## Architecture

```text
orbit-zero/
├── index.html          # structure et accessibilité
├── styles.css          # interface, responsive et transitions
└── js/
    ├── main.js         # UI et contrôles
    ├── game.js         # simulation et rendu Canvas
    ├── particles.js    # système de particules plafonné
    ├── audio.js        # sons procéduraux Web Audio
    ├── storage.js      # scores et préférences locales
    └── utils.js        # fonctions mathématiques partagées
```

Le jeu ne nécessite aucun build : il fonctionne directement dans tous les navigateurs modernes.

## Droits d'utilisation

Copyright © 2026 chacal15. Tous droits réservés.

Le code source, le design, les textes et les éléments originaux d'ORBIT//ZERO
ne peuvent pas être copiés, redistribués, modifiés ou réutilisés sans
autorisation écrite de l'auteur.
