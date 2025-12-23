// index.js (Backend pour Render)
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Autorise ton site web à appeler le serveur
app.use(express.json());

// CONFIGURATION CAMPAY (Variables d'environnement Render)
const CAMPAY_API_KEY = process.env.CAMPAY_API_KEY;
const CAMPAY_APP_ID = process.env.CAMPAY_APP_ID;
const CAMPAY_ENV = "production"; // ou "dev"

// 1. Route de TEST (Indispensable pour Render)
app.get('/', (req, res) => res.send('API SocialBoost Active'));

// 2. Route de PAIEMENT
app.post('/pay', async (req, res) => {
    try {
        const { amount, phone, operator } = req.body;

        // Obtenir le Token CamPay
        const authResponse = await axios.post(`https://www.campay.net/api/token/`, {
            app_username: CAMPAY_API_KEY,
            app_password: CAMPAY_APP_ID
        });

        const token = authResponse.data.token;

        // Lancer la collecte
        const collectResponse = await axios.post(`https://www.campay.net/api/collect/`, {
            amount: amount,
            currency: "XAF",
            from: phone,
            description: "Recharge SocialBoost",
            external_reference: "SB-" + Date.now()
        }, {
            headers: { Authorization: `Token ${token}` }
        });

        res.json(collectResponse.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Échec CamPay" });
    }
});

// 3. Route de STATUT
app.get('/status/:reference', async (req, res) => {
    // Logique de vérification CamPay ici...
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur port ${PORT}`));