const express = require('express');
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauce');

router.post('/', auth, multer, saucesCtrl.createSauce);  
router.put('/:id', auth, saucesCtrl.modifySauce);  
router.delete('/:id', auth, saucesCtrl.deleteSauce);  
router.get('/:id', auth, saucesCtrl.getOneSauce);  
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.addLike)

module.exports = router;