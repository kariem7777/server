// server.js
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import cors

const app = express();
app.use(cors({
    origin: 'http://localhost:3001',  // Allow requests from this origin
    methods: ['GET', 'POST'],        // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'], // Allow specific headers
}));
app.use(cors({
    origin: 'https://cloud-computing-inky.vercel.app/',  // Allow requests from this origin
    methods: ['GET', 'POST'],        // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'], // Allow specific headers
}));
app.use(bodyParser.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cloud-bd55b.firebaseio.com'
});

const messaging = admin.messaging();

app.post('/subscribe', (req, res) => {
    const { token, topic } = req.body;
    messaging.subscribeToTopic(token, topic)
        .then((response) => res.send(response))
        .catch((error) => res.status(500).send(error));
});

app.post('/unsubscribe', (req, res) => {
    const { token, topic } = req.body;
    messaging.unsubscribeFromTopic(token, topic)
        .then((response) => res.send(response))
        .catch((error) => res.status(500).send(error));
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
