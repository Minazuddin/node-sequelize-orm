const { Users, Vehicles, sequelize } = require('../models');
const { handleError, sendResponse, checkDuplicatePlateNumber } = require('../utils/helper');
const sanitize = require('../sanitize/vehicle');

const controller = {};

controller.create = async (req, res) => {
    let t;

    try {
        const vehicleData = req.body;

        const userId = req.decoded._id;

        const err = await sanitize.create(vehicleData);

        if (err) return sendResponse(res, err.code, err.message);

        const user = await Users.findOne({ where: { _id: userId } });

        if (!user) return sendResponse(res, 404, 'User Not Found!');

        t = await sequelize.transaction();

        const vehicle = await user.createVehicle(vehicleData, { transaction: t });

        await user.increment('vehicle_count', { by: 1 }, { transaction: t });

        t.afterCommit(() => sendResponse(res, 201, 'Vehicle Added!', vehicle));

        await t.commit();

    } catch (err) {

        await t.rollback();

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
    let t;

    try {
        const { id } = req.params;

        t = await sequelize.transaction();

        const user = await Users.findByPk(req.decoded._id, { transaction: t });

        if (!user) return sendResponse(res, 404, 'User Not Found!');

        const result = await Vehicles.destroy({ where: { _id: id } }, { transaction: t })

        if (!result) return sendResponse(res, 404, 'Vehicle Not Found!');

        if (user.vehicle_count > 0) await user.decrement('vehicle_count', { by: 1 }, { transaction: t });

        t.afterCommit(() => sendResponse(res, 200, 'Vehicle Deleted!'))

        await t.commit();

    } catch (err) {
        t.rollback();
        handleError(err, res);
    }
};

module.exports = controller;