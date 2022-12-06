const express = require('express');

const VehicleController = require('../controllers/vehicle');

const router = express.Router();

router.get('/:userId', VehicleController.getAllVehiclesByUser);

router.post('/vehicle/:userId', VehicleController.create);

router.patch('/vehicle/:id', VehicleController.update);

router.delete('/vehicle/:id', VehicleController.delete);

module.exports = router;