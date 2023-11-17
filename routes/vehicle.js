const express = require('express');
const Middleware = require('../utils/middleware');

const VehicleController = require('../controllers/vehicle');

const router = express.Router();

router.get('/getAll', Middleware.Authorize, VehicleController.getAllVehiclesByUser);

router.post('/', Middleware.Authorize, VehicleController.create);

router.patch('/:id', Middleware.Authorize, VehicleController.update);

router.get('/:id', Middleware.Authorize, VehicleController.getVehicleById);

router.delete('/:id', Middleware.Authorize, VehicleController.delete);

module.exports = router;