const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const Middleware = require('../utils/middleware');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.get('/getAll', Middleware.authenticate, UserController.getAll);

router.patch('/:id', Middleware.authenticate, UserController.update);

router.delete('/:id', Middleware.authenticate, UserController.delete);

module.exports = router;

