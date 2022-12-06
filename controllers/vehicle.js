const { User, Vehicle } = require('../models');

const handleError = (err, res) => {
    console.error(err);

    res.status(500).json({
        message: err.message
    })
};

const controller = {};

controller.create = async (req, res) => {
    try {
        const vehicleData = req.body;

        const { userId } = req.params;

        const user = await User.findOne({ id: userId });

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

        await Vehicle.update(data, { where: { id } });

        return res.status(200).json({ message: 'Vehicle Updated!' })

    } catch (err) {
        handleError(err, res);
    }
};

controller.getAllVehiclesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ where: { id: userId } })

        if (!user) return res.status(404).json({ message: 'User Not Found!' })

        const vehicles = await Vehicle.findAll({ where: { userId } })

        return res.status(200).json({ message: 'User Vehicles', vehicles })

    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Vehicle.destroy({ where: { id } })
        
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