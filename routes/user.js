const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const Middleware = require('../utils/middleware');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.get('/', Middleware.authenticate, UserController.get);

router.get('/getAll', Middleware.authenticate, UserController.getAll);

router.patch('/', Middleware.authenticate, UserController.update);

router.delete('/', Middleware.authenticate, UserController.delete);

module.exports = router;

