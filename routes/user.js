const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.getAll);

router.post('/user', UserController.create);

router.patch('/user/:id', UserController.update);

router.delete('/user/:id', UserController.delete);

module.exports = router;

