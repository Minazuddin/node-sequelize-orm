const { Users, Vehicles } = require('../models');
const { handleError, sendResponse } = require('../utils/helper');
const sanitize = require('../sanitize/vehicle');

const controller = {};

controller.create = async (req, res) => {
    try {
        const vehicleData = req.body;

        const { userId } = req.params;

        const err = sanitize.create(vehicleData);

        if (err) return sendResponse(res, err.code, err.message);

        const user = await Users.findOne({ _id: userId });

        const vehicle = await user.createVehicle(vehicleData);

        return sendResponse(res, 201, 'Vehicle Added!', vehicle);

    } catch (err) {
        handleError(err, res);
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;

        const data = req.body;

        await Vehicles.update(data, { where: { _id: id } });

        return sendResponse(res, 200, 'Vehicle Updated!');

    } catch (err) {
        handleError(err, res);
    }
};

controller.getAllVehiclesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await Users.findOne({ where: { _id: userId } })

        if (!user) return res.status(404).json({ message: 'User Not Found!' })

        const vehicles = await Vehicles.findAll({ where: { userId } })

        return sendResponse(res, 200, 'User Vehicles!', vehicles);

    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Vehicles.destroy({ where: { _id: id } })
        
        if (!result) return sendResponse(res, 404, 'Vehicle Not Found!');

        return sendResponse(res, 200, 'Vehicle Deleted!');
    
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = controller;