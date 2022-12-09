const express = require('express');
const Middleware = require('../utils/middleware');

const VehicleController = require('../controllers/vehicle');

const router = express.Router();

router.get('/:userId', Middleware.authenticate, VehicleController.getAllVehiclesByUser);

router.post('/:userId', Middleware.authenticate, VehicleController.create);

router.patch('/:id', Middleware.authenticate, VehicleController.update);

router.delete('/:id', Middleware.authenticate, VehicleController.delete);

module.exports = router;