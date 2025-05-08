# GOWEB : Test FullStack

Projet réalisé dans le cadre d'un test technique FullStack.

Cettte application a pour but de de qualifier un chantier de dépannage grâce à un système dynamique de questions-réponses. Les utilisateurs peuvent répondre aux questions, voir un récapitulatif, puis envoyer leurs coordonnées pour être recontactés par un expert.

## Sommaire

- [Technologies utilisées](#technologies-utilisées)
- [Instructions d'installation](#instructions-dinstallation)
- [Fonctionnement Client / Serveur](#fonctionnement-client--serveur)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Architecture du projet](#architecture-du-projet)
- [Gestion des données](#gestion-des-données-via-json)
- [Sécurité et bonnes pratiques](#sécurité-et-bonnes-pratiques)
- [Consultation des réponses](#consultation-des-réponses)
- [Tests et vérifications](#tests-et-vérifications)
- [Améliorations possibles](#améliorations-possibles)

---

## Technolies utilisées 

 - Frontend : React.js + TypeScipt + Tailwind CSS
 - Banckend : Node.js + Express.js
 - Gestion de données : Fichier JSON
 - Communication : API REST
 - Deploiment local : Vite.js 

 ## Instruction d'installation 

 ### Frontend 
 ```
 cd frontend
 npm install 
 npm run dev
 ```

 Attention : la version de node doit être supérieur à la 18 

 ### Backend 

  ```
 cd backend 
 npm install 
 npm run dev
 ```

### Fonctionnement Client / Serveur

- L'utilisateur interagit avec un questionnaire dynamique.

- Les réponses sont stockées en mémoire via un Contexte React (QuestionnaireContext).

- Lors de la validation du formulaire de contact, toutes les données sont envoyées via POST /save-form au serveur Node.js.

- Le backend traite les données pour les sauvegarder ou les utiliser (sauvegarde simulée en local).

### Fonctionnalités principales 

- ✅ Système de questions dynamiques (les questions dépendent des réponses précédentes)
 
- ✅ Système de retour en arrière (Back navigateur et bouton)

- ✅ Formulaire final avec validation des champs

- ✅ Sauvegarde des réponses et des coordonnées utilisateur

- ✅ Interface responsive conforme aux maquettes Figma

### Architecture 
```
/frontend
  /src
    /components
    /context
    /pages
    /data
/backend
  /controllers
  /routes
  /models
  /server.js
```

## Gestion des données via JSON

### Gestion des questions

Pour gérer dynamiquement les questions/réponses du questionnaire, j'ai choisi d'utiliser un fichier questions.json au lieu d'une base de données.

Pourquoi utiliser un fichier JSON pour les questions ? 

- Simplicité : Données excel facilement et rapidement transformable en json. Idéale dans le context du text technique.

- Performance : Chargement rapide en mémoire pour un projet local ou MVP.

- Évolutivité : Cette structure est directement compatible avec une future migration vers une base de données.

Chaque question peut définir son chemin de navigation avec un nextQuestionId, permettant un parcours dynamique basé sur les réponses.

### Gestion des réponses utilisateur

Une fois le formulaire rempli, les réponses de l'utilisateur sont envoyées au backend sous format JSON via une requête HTTP POST (/save-form).

Pourquoi envoyer les réponses en JSON ?

- Standard universel : JSON est le format de communication standard pour les APIs REST modernes.

- Compatibilité : JSON est directement compréhensible par la plupart des serveurs backend (Node.js, PHP, Python, etc.).

- Facilité de traitement : Les réponses peuvent être facilement stockées, analysées ou transférées en base de données.

- Sérialisation rapide : Pas besoin de transformation complexe, on utilise simplement JSON.stringify() côté frontend et req.body côté serveur.

#### Remarque : 
Le choix d'utilsé json pour la gestion des data à été fais dans le contexte d'un test technique avec un dataset très léger. On pourra bien évidament utilisé une solution plus adapté pour un passage en prod avec par exemple MongoDB. 

## Sécurité et bonnes pratiques

Même si ce projet est prévu pour une utilisation locale ou en démonstration, plusieurs mesures de sécurité ont été mises en œuvre :

### Validation côté client 

Tous les champs du formulaire (email, téléphone, adresse, code postal) sont validés en temps réel côté frontend pour assurer une meilleure qualité de données et améliorer l'expérience utilisateur.
Cependant, c'est vérification sont assez simple et pourrai être largement amélioré en utilisant une API (exemple : vérifier si l'adresse existe bien). 

### Validation côté serveur

Le backend utilise la fonction validateAndSanitizeContact qui utilise ```validator``` ( bibliothèque ) pour :

- Vérifier que les champs obligatoires sont bien remplis.

- Nettoyer les entrées utilisateur pour éviter l'injection de caractères non désirés.

### Protection de l'accès aux soumissions 

L'accès à la route /submissions est protégé par une clé API (goweb2025 actuellement codée en dur).

👉 En production :

Cette clé devrait être stockée dans un fichier .env sécurisé et chargée via une librairie comme dotenv.

Il faudrait aussi utiliser HTTPS pour éviter toute fuite de clé lors des échanges.

### CORS et Rate Limiting

CORS est activé pour permettre la communication entre le frontend (localhost:5173) et le backend (localhost:3000).

Rate limiting (express-rate-limit) est en place pour :

Limiter à 5 requêtes par minute par IP.

Prévenir les abus et les attaques par déni de service (DoS) simples.

###  Sauvegarde locale
Les soumissions sont enregistrées dans un fichier responses.json.

#### Attention :

Pour rappel, ce n'est pas bien sécurisé pour un environnement de production.

👉 En production, il faudrait utiliser une base de données sécurisée (ex: PostgreSQL, MongoDB).
Pour une mise en production réelle, il faudrait donc renforcer encore certains points : stockage sécurisé des clés, base de données sécurisée, HTTPS obligatoire, validation étendue côté serveur.


## Consultation des réponses

Pour permettre à un artisan ou à un membre de l'équipe de visualiser les réponses enregistrées :

1. Ouvrir un navigateur internet.

2. Aller sur l'URL suivante :

```
http://localhost:3000/submissions?apiKey=goweb2025
```

🔒 Note : L'accès est protégé par une clé API "secrète" (apiKey=goweb2025).

Chaque réponse contient :

- L'horodatage (timestamp) de la soumission.

- Les coordonnées du client (nom, prénom, email, téléphone, adresse...).

- Toutes les réponses au questionnaire.

👉 En production, il serait préférable :

- De sécuriser encore plus l'accès à ces données (par exemple via un espace administrateur avec mot de passe).

- De stocker les réponses dans une base de données pour faciliter la consultation, le tri et l'export.


## Tests et vérifications
### Frontend (React)
- Test du bon affichage des composants (ex: ContactInput)

- Test du comportement des pages (ex: Contact et Result)

- Vérification de la désactivation du bouton d'envoi si le formulaire est invalide

- Vérification de la redirection automatique si l'utilisateur n'a pas répondu au questionnaire

Outils utilisés : Vitest, React Testing Library

#### Exécuter les tests frontend :
Depuis le dossier ```/frontend``` :

```
npm run test
```

### Backend (Express API)
✅ Les routes principales ont été testées avec Postman ou directement via fetch depuis le frontend.

#### Tests automatisés avec Jest + Supertest :

- Tests API /save-form :
  - Sauvegarde réussie avec des données valides.
  - Erreur 400 si formulaire incomplet ou invalide.

- Tests API /submissions :
  - Refus d'accès sans clé API (403).
  - Refus d'accès avec mauvaise clé API (403).
  - Accès aux données avec la bonne clé API (200 ou 404 si vide).

- Tests de validation des données (validateAndSanitizeContact) :
  - Validation correcte des contacts valides.
  - Détection des erreurs pour :
    - Email invalide
    - Numéro de téléphone invalide
    - Champs vides
- Nettoyage (sanitization) des tentatives d'injection de script (XSS).

Outils utilisés : Jest, Supertest

#### Exécuter les tests backend :
Depuis le dossier ```/backend``` :

```
npm run test
```

Les tests utiliseront automatiquement Jest + Supertest.

#### Remarque : 

Même si le projet ne nécessitait pas forcement de couverture totale, j'ai mis en place plusieurs tests automatisés côté client et serveur pour montrer ma capacité à produire un code testé et fiable.

###  Améliorations possibles
Même si le projet répond aux besoins initiaux, voici quelques pistes d'améliorations envisagées :

#### Backend :

- Mettre la clé API et la configuration serveur dans des variables d'environnement (.env) pour plus de sécurité.

- Remplacer la sauvegarde dans un fichier .json par une base de données (ex: MongoDB, PostgreSQL).

- Implémenter des tests d'intégration supplémentaires avec validation des erreurs réseau.

#### Frontend :

- Ajouter une gestion d'état avancée avec Redux ou Zustand si le projet devient plus complexe.

- Augmenter la couverture de tests (notamment pour la navigation entre pages et la soumission du formulaire).

- Mettre en place une gestion globale des erreurs d'API avec un Toast ou un Modal d'alerte.

- Ajouter une interface Front sécurisé Admin pour consulter les réponses des clients.

#### Sécurité :

- Ajouter une validation côté serveur plus stricte des données envoyées par le client.

- Protéger les routes critiques du backend avec une authentification (si besoin futur).

### 🎥 Mini démo : 

👉 [Cliquez ici pour voir une mini démo du projet](https://drive.google.com/file/d/1o_XlneRn7quD18-vXLbx06DlYD2qtvHF/view?usp=drive_link)

