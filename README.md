# K-Flow Backend

Backend Express léger pour synchroniser les données entre l'app mobile K-flow et l'extension QuickFlow.

## 🔧 Installation locale

```bash
git clone https://github.com/ton-utilisateur/k-flow-backend.git
cd k-flow-backend
npm install
npm start
```

Accès local : [http://localhost:3000/entries](http://localhost:3000/entries)

## 🚀 Déploiement sur Render

1. Crée un compte sur [https://render.com](https://render.com)
2. Clique sur "New Web Service"
3. Connecte ton dépôt GitHub contenant ce projet
4. Choisis :
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: (laisse vide si `server.js` est à la racine)
5. C’est tout ! Render déploiera automatiquement l'API à chaque push.

## 📦 Endpoints

| Méthode | URL                 | Description             |
|---------|---------------------|-------------------------|
| GET     | `/entries`          | Récupère toutes les entrées |
| POST    | `/entries`          | Ajoute une entrée JSON      |
| DELETE  | `/entries/:id`      | Supprime une entrée        |

## Exemple d'entrée
```json
{
  "id": "uuid",
  "type": "text", // ou "file"
  "content": "Hello world", // ou "url" pour fichier
  "date": "2025-05-12T12:00:00.000Z"
}
```

## ✅ Statut
Le backend est prêt pour Render et synchronisé avec K-flow mobile et QuickFlow extension.
