import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Options CORS
const corsOptions = {
     origin: [
          'https://lamba-lia.vercel.app', // URL de votre application frontend déployée
          'http://localhost:5173' // Autorisez les requêtes depuis localhost:5173
     ],
     optionsSuccessStatus: 200, // Pour les anciens navigateurs
};

// Middleware
app.use(cors(corsOptions)); // Utilise CORS avec les options spécifiées
app.use(express.json()); // Middleware pour analyser le JSON

// Exemple de route pour la connexion

// Démarrer le serveur
app.listen(PORT, () => {
     console.log(`Le serveur fonctionne sur http://localhost:${PORT}`);
});

// Exporter l'application pour l'utiliser dans d'autres modules
export default app;