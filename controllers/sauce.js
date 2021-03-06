// import du schéma Sauce
const Sauce = require('../models/Sauce')

// import fs file systeme
const fs = require('fs');

// crée nouvelle sauce
exports.createSauce = (req, res, next) => {    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce)
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};


// modifie une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
}

// supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error, message: 'nein !' }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// renvoie vers une sauce via son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

// donne la liste des sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
}

// system like dislike
exports.addLike = (req, res, next) => {

  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })

    .then(sauce => {
      // si l'utilisateur like
      switch(like) {
        case +1:
          Sauce.updateOne( // en fonction de l'user ajout +1
            { _id: req.params.id },
            { $push: { userLiked: userId }, $inc: { like: +1 }},
            console.log('1 pouce en +++')
          )
        .then(() => res.status(200).json({ message: 'Sauce liké !!' }))
        .catch(error => res.status(400).json({ error }))
        break;

        case -1:
          Sauce.updateOne( // en fonction de l'user ajout -1
            { _id: req.params.id },
            { $push: { userDisliked: userId }, $inc: { dislike: -1 }},
            console.log('1 pouce en ---')
          )
        .then(() => res.status(200).json({message: "Sauce disliké !!"}))
        .catch(error => res.status(400).json({ error }))
        break;

        case 0:
          Sauce.updateOne( // en fonction de l'user renvoi à 0 si l'utilisateur annule son choix
            { _id: req.params.id },
            { $push: { userCancel: userId }, $inc: { cancel: 0 }},
            console.log('-annulation-')
          )
        .then(() => res.status(200).json({message: "Like Dislike annulé !"}))
        .catch(error => res.status(400).json({ error }))
        break;
      }
    })     
};