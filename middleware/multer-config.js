const multer = require('multer');

// extensions de fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// enregistrement sur le disk
const storage = multer.diskStorage({
  // destination de stockage
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // designe le nom du fichier à multer
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// export du middleware multer avec methode single 
module.exports = multer({storage: storage}).single('image');