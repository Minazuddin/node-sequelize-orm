const express = require('express');
const router = express.Router();
const controller = require('../controllers/jwks');

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'jwks end point working!'
    })
});
router.get('/generate-jwk-set', controller.generateJwkSet);
router.post('/sign', controller.signJwt);
router.get('/verify', controller.verifyJwt);

module.exports = router;