# HopeAI Kids - Spécification Technique

## 1. Concept & Vision

HopeAI Kids est une plateforme éducative bienveillante conçue pour accompagner les enfants des orphelinats dans leur apprentissage quotidien. L'application combine une interface colorée et ludique adaptée aux enfants avec un système administratif robuste pour les éducateurs. Elle offre un assistant IA conversationnel sécurisé, des outils éducatifs interactifs, et une gestion complète des enfants et des présences.

L'expérience utilisateur vise à créer un sentiment de chaleur, d'espoir et de sécurité - comme un ami numérique de confiance toujours disponible pour aider.

## 2. Design Language

### Aesthetic Direction
Style "Nursery 2.0" - Un mélange de design scandinave épuré avec des touches de couleurs vives et joyeuses. Inspiré des applications éducatives premium comme Duolingo et Khan Academy Kids, mais avec une personnalité plus chaleureuse et inclusive.

### Color Palette
- **Primary**: `#6C63FF` (Violet chaleureux - confiance, créativité)
- **Secondary**: `#FF6B9D` (Rose doux - bienveillance, soin)
- **Accent 1**: `#00D9A5` (Turquoise - énergie, croissance)
- **Accent 2**: `#FFB547` (Orange doux - optimism, chaleur)
- **Background Light**: `#FAFBFF`
- **Background Dark**: `#1A1B2E`
- **Surface Light**: `#FFFFFF`
- **Surface Dark**: `#252640`
- **Text Primary Light**: `#2D3142`
- **Text Primary Dark**: `#F0F2FF`
- **Text Secondary**: `#8B8FA3`
- **Success**: `#00D9A5`
- **Warning**: `#FFB547`
- **Danger**: `#FF6B6B`

### Typography
- **Headings**: 'Nunito', sans-serif (rounded, friendly, excellent readability)
- **Body**: 'Quicksand', sans-serif (modern, clean, child-friendly)
- **Monospace**: 'JetBrains Mono' (pour les statistiques/code)

### Spatial System
- Base unit: 8px
- Border radius: 12px (cards), 8px (buttons), 50% (avatars)
- Shadows: layered soft shadows for depth
- Spacing scale: 8, 16, 24, 32, 48, 64, 96px

### Motion Philosophy
- **Transitions**: 300ms ease-out for most interactions
- **Micro-animations**: 150ms for hovers, 200ms for state changes
- **Page transitions**: 400ms slide + fade
- **Loading states**: Playful bouncing dots animation
- **Success feedback**: Confetti burst or stars animation
- **Emotion reactions**: Subtle floating emojis

### Visual Assets
- **Icons**: Phosphor Icons (duotone style for emphasis)
- **Illustrations**: Custom SVG illustrations with rounded shapes
- **Avatars**: Friendly character avatars for children
- **Decorative**: Floating shapes, gradient blobs, star patterns

## 3. Layout & Structure

### Page Architecture

#### Landing Page (index.html)
- Hero section avec illustration animée
- Features highlights en cards
- Témoignages/Statistiques
- CTA pour connexion
- Footer avec informations

#### Login Page (login.html)
- Design centré, minimaliste
- Formulaire de connexion élégant
- Options de réinitialisation
- Toggle dark/light mode

#### Dashboard (dashboard.html)
- Sidebar navigation fixe (collapsible sur mobile)
- Header avec profil et notifications
- Zone de contenu principale
- Widgets de statistiques en grille
- Graphiques interactifs
- Notifications/recent activities

#### Assistant IA (assistant.html)
- Interface de chat optimisée mobile
- Bulles de messages stylisées (enfant vs IA)
- Zone d'input avec microphone
- Indicateur de "typing"
- Bouton émotions avec feedback visuel
- Synthèse vocale toggle

#### Education (education.html)
- Navigation par catégories
- Grille de cartes d'activités
- Progress bar par section
- Badges de réussite
- Filter par âge

#### Gestion Enfants (children.html)
- Liste/tableau avec search
- Fiche détail en modal/slide-over
- Formulaire ajout/modification
- Historique d'activités
- Progression visualization

#### Présences (attendance.html)
- Vue calendrier
- Liste du jour avec heures
- Statut visuel (présent/absent/retard)
- Boutons actions rapides
- Export/rapports

#### Paramètres (settings.html)
- Onglets: Profil, Utilisateurs, Sécurité, Données
- Formulaires structurés
- Permissions matrix
- Toggle switches élégants

### Responsive Strategy
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1280px
- Sidebar → bottom navigation sur mobile
- Cards stack vertically
- Tables → cards sur mobile

## 4. Features & Interactions

### AI Assistant
- **Input text**: Taper message → envoi avec Enter ou bouton
- **Input vocal**: Clic microphone → recording indicator → transcription → envoi
- **Emotion detection**: Analyse des mots-clés (heureux, triste, peur, inquiet)
- **Response tone**: Adjust语气 selon émotion détectée
- **Text-to-Speech**: Bouton pour lire réponse à voix haute
- **Typing indicator**: Animation de 3 points qui bounce
- **Message states**: Envoi, envoyé, lu, erreur

### Educational Space
- **Quiz interactif**: Questions multiples, feedback immédiat, score final
- **Histoires**: Narration avec images, choix de continuation
- **Aide devoirs**: Catégories matières, ressources par niveau
- **Jeux**: Memory, puzzles, associations
- **Progression**: XP system, badges, niveaux

### Child Management
- **Add child**: Multi-step form avec validation
- **Edit**: Pré-remplir formulaire, sauvegarde
- **View profile**: Slide-over avec tabs (info, activities, progress)
- **Delete**: Confirmation modale avec double opt-in

### Attendance
- **Check-in**: Sélection enfant → timestamp auto
- **Check-out**: Même interface avec heure
- **Manual edit**: Override avec reason
- **Face recognition**: Placeholder avec camera interface

### Dashboard
- **Real-time stats**: Mise à jour automatique
- **Charts**: Line chart (présences), Bar chart (activities), Pie (répartition)
- **Notifications**: Toast notifications avec actions
- **Quick actions**: Boutons shortcuts

### Authentication
- **Login**: Email + password, remember me
- **Roles**: Admin, Responsable, Éducateur
- **Permissions**: Matrix visible dans settings
- **Profile**: Avatar, infos, mot de passe

## 5. Component Inventory

### Buttons
- **Primary**: Background gradient, white text, hover scale + glow
- **Secondary**: Border only, hover fill
- **Ghost**: Text only, underline on hover
- **Icon**: Circle, centered icon
- **States**: Default, hover, active, disabled, loading (spinner)

### Cards
- **Base**: White surface, shadow-md, rounded-xl
- **Interactive**: Hover lift + shadow increase
- **Stats**: Icon + number + label
- **Profile**: Avatar + info stack
- **Activity**: Image + title + progress

### Form Elements
- **Input**: Rounded, icon prefix option, floating label
- **Select**: Custom dropdown avec search
- **Toggle**: Smooth slide animation
- **Checkbox/Radio**: Custom styled avec animation
- **File upload**: Drag & drop zone

### Navigation
- **Sidebar**: Fixed, collapsible, active state highlight
- **Bottom nav**: Mobile only, 5 items max
- **Breadcrumbs**: Slash separated, last item bold
- **Tabs**: Underline style, smooth indicator slide

### Feedback
- **Toast**: Slide in from top-right, auto-dismiss 5s
- **Modal**: Backdrop blur, scale-in animation
- **Tooltip**: Dark background, arrow pointer
- **Progress bar**: Animated fill, percentage label
- **Skeleton**: Pulse animation, matching content shape

### Data Display
- **Table**: Striped rows, hover highlight, sortable headers
- **Avatar**: Image or initials, size variants (sm/md/lg)
- **Badge**: Pill shape, color variants
- **Chart**: Animated on load, interactive tooltips

## 6. Technical Approach

### Architecture
```
/
├── index.html          # Landing page
├── login.html          # Authentication
├── dashboard.html      # Main dashboard
├── assistant.html      # AI Chatbot
├── education.html      # Educational space
├── children.html       # Child management
├── attendance.html     # Attendance tracking
├── settings.html       # Settings & users
├── css/
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Reset & base styles
│   ├── components.css  # UI components
│   └── pages.css       # Page-specific styles
├── js/
│   ├── app.js          # Main application logic
│   ├── auth.js         # Authentication
│   ├── router.js       # Client-side routing
│   ├── api.js          # API integration ready
│   ├── components.js   # Reusable components
│   ├── charts.js       # Chart initialization
│   └── utils.js        # Utility functions
└── assets/
    └── icons/          # SVG icons
```

### Future Integration Points

#### OpenAI API (chatbot)
```javascript
// api.js - ready for integration
const AI_CONFIG = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4',
  systemPrompt: 'You are a friendly AI assistant for children...'
};
```

#### Whisper (Speech-to-Text)
```javascript
// Microphone handling prepared
navigator.mediaDevices.getUserMedia({ audio: true });
// → Send audio blob to Whisper API
```

#### Text-to-Speech
```javascript
// Using Web Speech API as fallback
const utterance = new SpeechSynthesisUtterance(text);
speechSynthesis.speak(utterance);
```

#### PostgreSQL Schema (prepared)
```sql
-- Users, Children, Attendance, Activities tables
-- Ready for backend integration
```

#### Face Recognition
```javascript
// Camera interface prepared
// Integration point for InsightFace/MediaPipe
```

### State Management
- LocalStorage for persistence
- In-memory state for session
- Event-driven updates

### Security Preparations
- JWT token structure ready
- Form validation on all inputs
- XSS prevention with sanitization
- CSRF token placeholders
- Data consent checkboxes

### Demo Data
- 3 enfants avec profils complets
- 5 activités réalisées
- 7 jours de présence
- 3 utilisateurs (1 admin, 1 responsable, 1 éducateur)
