const { User, Vehicle } = require('../models');
const { handleError } = require('../utils/helper');

const controller = {};

controller.create = async (req, res) => {
    try {
        const vehicleData = req.body;

        const { userId } = req.params;

        const user = await User.findOne({ _id: userId });

        const vehicle = await user.createVehicle(vehicleData);

        return res.status(201).json({ message: 'Vehicle Added!', vehicle })

    } catch (err) {
        handleError(err, res);
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;

        const data = req.body;

        await Vehicle.update(data, { where: { _id: id } });

        return res.status(200).json({ message: 'Vehicle Updated!' })

    } catch (err) {
        handleError(err, res);
    }
};

controller.getAllVehiclesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ where: { _id: userId } })

        if (!user) return res.status(404).json({ message: 'User Not Found!' })

        const vehicles = await user.getVehicles();

        return res.status(200).json({ message: 'User Vehicles', vehicles })

    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Vehicle.destroy({ where: { _id: id } })
        
        if (!result) {
            return res.status(404).json({
                message: 'Vehicle Not Found!',
            })
        }

        return res.status(200).json({
            message: 'Vehicle Deleted!',
        })
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = controller;