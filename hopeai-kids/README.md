# HopeAI Kids — démo front-end

Reconstruction complète de **HopeAI Kids**, une plateforme éducative bienveillante destinée à l'accompagnement d'enfants. Le projet est entièrement statique (HTML, CSS et JavaScript) et ne demande aucune installation.

## Ouvrir le projet

Ouvrir `index.html` dans un navigateur moderne ou, pour une navigation plus fiable entre les pages et les fonctionnalités du navigateur (microphone, téléchargement CSV), démarrer un serveur local :

```bash
cd hopeai-kids
python3 -m http.server 8080
```

Puis ouvrir [http://localhost:8080](http://localhost:8080).

## Compte de démonstration

- **E-mail :** `marie.dupont@hopeai.org`
- **Mot de passe :** `Admin123!`

Ces identifiants, comme toutes les données, sont fictifs et stockés seulement dans le `localStorage` du navigateur. Pour recommencer la démo, effacer les données du site dans les outils du navigateur.

## Pages incluses

| Page | Rôle |
|---|---|
| `index.html` | Accueil et présentation de HopeAI Kids |
| `login.html` | Connexion de démonstration |
| `dashboard.html` | Tableau de bord, statistiques, graphiques et activités |
| `assistant.html` | Assistant conversationnel simulé, détection d'émotions et synthèse vocale |
| `education.html` | Quiz interactifs et catalogue d'activités |
| `children.html` | Gestion des profils enfants |
| `attendance.html` | Appel, pointage et export CSV des présences |
| `settings.html` | Profil, utilisateurs, permissions, sécurité et données |

## Fonctionnalités de la démo

- Thème clair/sombre persistant.
- Navigation responsive : barre latérale sur ordinateur et barre basse sur mobile.
- Données de démonstration initialisées à la date d'ouverture afin que le tableau de bord et les présences restent pertinents.
- Ajout, modification et suppression de profils enfants via le stockage local.
- Quiz à choix multiples avec score et notifications.
- Chat simulé, réponses contextuelles, détection de mots-clés émotionnels, lecture à voix haute et saisie vocale lorsque le navigateur l'autorise.
- Export CSV de la journée depuis les présences.

## Limites importantes

C'est une maquette fonctionnelle front-end, **pas une application de production** : l'assistant n'appelle pas de modèle IA, l'authentification n'est pas sécurisée côté serveur, et les modules biométriques/caméra ne réalisent aucune reconnaissance faciale. Une version de production nécessiterait une API sécurisée, une base de données, une gestion d'identités, des contrôles d'accès et une approche conforme pour les données sensibles des enfants.

La spécification initiale est disponible dans [`SPEC.md`](SPEC.md).
