const express = require('express');
const Middleware = require('../utils/middleware');

const VehicleController = require('../controllers/vehicle');

const router = express.Router();

router.get('/getAll', Middleware.authenticate, VehicleController.getAllVehiclesByUser);

router.post('/', Middleware.authenticate, VehicleController.create);

router.patch('/:id', Middleware.authenticate, VehicleController.update);

router.get('/:id', Middleware.authenticate, VehicleController.getVehicleById);

router.delete('/:id', Middleware.authenticate, VehicleController.delete);

module.exports = router;