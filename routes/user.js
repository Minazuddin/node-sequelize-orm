const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const Middleware = require('../utils/middleware');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.get('/', Middleware.Authorize, UserController.get);

router.patch('/', Middleware.Authorize, UserController.update);

router.delete('/', Middleware.Authorize, UserController.delete);

module.exports = router;

