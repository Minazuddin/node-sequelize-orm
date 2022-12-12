const { Users, Vehicles } = require('../models');
const { handleError, sendResponse, checkDuplicatePlateNumber } = require('../utils/helper');
const sanitize = require('../sanitize/vehicle');

const controller = {};

controller.create = async (req, res) => {
    try {
        const vehicleData = req.body;

        const userId = req.decoded._id;

        const err = await sanitize.create(vehicleData);

        if (err) return sendResponse(res, err.code, err.message);

        const user = await Users.findOne({ where: { _id: userId } });

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

        if (data.plate_number) {
            const err = await checkDuplicatePlateNumber(data.plate_number);
            if (err) return sendResponse(res, err.code, err.message);
        }

        await Vehicles.update(data, { where: { _id: id } });

        return sendResponse(res, 200, 'Vehicle Updated!');

    } catch (err) {
        handleError(err, res);
    }
};

controller.getVehicleById = async (req, res) => {
    try {
        const id = req.params.id;

        const vehicle = await Vehicles.findByPk(id)

        if (!vehicle) return res.status(404).json({ message: 'Vehicle Not Found!' })

        return sendResponse(res, 200, 'Vehicle Details!', vehicle);

    } catch (err) {
        handleError(err, res);
    }
};

controller.getAllVehiclesByUser = async (req, res) => {
    try {
        const userId = req.decoded._id;

        const user = await Users.findOne({ where: { _id: userId } })

        if (!user) return res.status(404).json({ message: 'User Not Found!' })

        let vehicles = await user.getVehicles();

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