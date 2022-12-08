const express = require('express');

const VehicleController = require('../controllers/vehicle');

const router = express.Router();

router.get('/:userId', VehicleController.getAllVehiclesByUser);

router.post('/:userId', VehicleController.create);

router.patch('/:id', VehicleController.update);

router.delete('/:id', VehicleController.delete);

module.exports = router;