const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');


router.post('/', petController.registerPet);


router.get('/', petController.getPets);


router.get('/:id', petController.getPetById);


router.put('/:id', petController.updatePet);


router.delete('/:id', petController.deletePet);

module.exports = router;