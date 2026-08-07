# Dboy003.github.io

Portfolio personnel, en HTML/CSS/JS sur mesure (sans framework), pensé pour présenter mon parcours, mes réalisations, mes compétences et surtout mon profil de Data Scientist & GenAI Engineer.

**En ligne** : [mouradodorego.me](https://mouradodorego.me)

## Fonctionnalités

- **7 pages** en une seule application (Accueil, Parcours, Expériences, Projets, Compétences, Aspirations, Assistant IA), navigation par onglets sans rechargement
- **Bilingue FR/EN** intégral, préférence sauvegardée en local
- **Assistant IA conversationnel**, connecté à un vrai backend RAG ([mon-assistant-rag](https://github.com/Dboy003/mon-assistant-rag)) qui répond à partir de mon parcours réel, sans invention
- Formulaire de contact (Formspree), documents académiques téléchargeables

## Stack technique

Aucun framework : HTML/CSS/JS vanilla, par choix, pour garder un contrôle total sur chaque interaction et éviter le poids d'un build tool sur un site de cette taille.

| Composant | Choix |
|---|---|
| Structure | HTML5 sémantique, une page par `<section>` |
| Style | CSS custom properties (variables), pas de framework CSS |
| Interactions | JavaScript vanilla (pas de librairie) |
| Icônes | Devicon (CDN), avec repli en badges stylisés si un logo est indisponible |
| Formulaire de contact | Formspree |
| Chatbot | Backend RAG externe ([mon-assistant-rag](https://github.com/Dboy003/mon-assistant-rag)), appelé en `fetch()` |
| Hébergement | GitHub Pages, domaine personnalisé (`mouradodorego.me`) |

## Structure du projet

```
Dboy003.github.io/
├── index.html          # les 7 pages du site
├── css/
│   └── style.css
├── js/
│   └── script.js       # navigation, langue, chatbot, particules
└── assets/
    ├── CV_Mourad_Do_Rego.pdf
    ├── photo.jpeg
    └── docs/            # documents académiques téléchargeables
```

## Lancer en local

Aucune dépendance ni build : ouvrir directement `index.html` suffit pour la plupart des pages.

Pour tester le chatbot en local (il a besoin d'une vraie origine, pas `file://`, à cause des CORS de l'API), utiliser l'extension VS Code **Live Server** :

```
clic droit sur index.html → "Open with Live Server"

```

## Projet lié

[mon-assistant-rag](https://github.com/Dboy003/mon-assistant-rag) : le backend FastAPI + RAG qui alimente l'assistant IA de ce portfolio.

## Auteur

**Mourad Do Rego** · Data Scientist & GenAI Engineer
[mouradodorego.me](https://mouradodorego.me) · [mouwahiddorego@gmail.com](mailto:mouwahiddorego@gmail.com)
