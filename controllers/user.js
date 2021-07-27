// import bcrypt pour crypter le password
const bcrypt = require('bcrypt');

// import jsonwebtoken pour sécuriser l'échange de données avec jeton d'authentification
const jwt = require('jsonwebtoken');
const User = require('../models/User')

// import maskdata pour masquer des données dans la bdd
const Maskdata = require('maskdata')
require('dotenv').config()

// enregistrement nouvel user
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: Maskdata.maskEmail2(req.body.email),
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// fonction log in
exports.login = (req, res, next) => {
  // comparaison email
  User.findOne({ email: Maskdata.maskEmail2(req.body.email) })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // comparaison password
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};