// import express
const express = require('express');

// import moogose pour gerer mongoDB + facilement
const mongoose = require('mongoose');

// import du routeur user
const saucesRoutes = require('./routes/sauce')

// import routeur sauce
const userRoutes = require('./routes/user');

// import path pour utiliser le chemin vers le dossier images
const path = require('path')

// import dotenv pour utiliser variables d'environnement
require('dotenv').config()

// utilisation mangoose pour connecter l'appli avec mongoDB
mongoose.connect(process.env.MONGODB,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// const express
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname,'images')))
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;