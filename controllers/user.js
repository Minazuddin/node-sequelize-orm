const { User, Vehicle } = require('../models')

User.hasMany(Vehicle);

const handleError = (err, res) => {
    console.error(err);

    res.status(500).json({
        message: err.message
    })
}

const controller = {};

controller.create = async (req, res) => {
    try {
        const data = req.body;

        const user = await User.create(data);

        return res.status(201).json({
            message: 'User Created!',
            user
        });
    } catch (err) {
        handleError(err, res);
    }
};

controller.update = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;

        await User.update(data, { where: { id } });

        return res.status(200).json({
            message: 'User Updated!',
        })
    } catch (err) {
        handleError(err, res);
    }
};

controller.getAll = async (req, res) => {
    try {
        const users = await User.findAll();

        return res.status(200).json({
            users
        })
    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await User.destroy({
            where: { id }
        });

        if (!result) {
            return res.status(404).json({
                message: 'User Not Found!',
            })
        }

        return res.status(200).json({
            message: 'User Deleted!',
        })
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = controller;