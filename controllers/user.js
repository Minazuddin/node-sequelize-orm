const { Op, Sequelize } = require('sequelize');
const { User, Vehicle, sequelize } = require('../models');
const { handleError } = require('../utils/helper');

User.hasMany(Vehicle);

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

        await User.update(data, { where: { _id: id } });

        return res.status(200).json({
            message: 'User Updated!',
        })
    } catch (err) {
        handleError(err, res);
    }
};

controller.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found!'
            })
        }
        
        return res.status(200).json({
            message: 'User Details!',
            user,
        })
    } catch (err) {
        handleError(err, res);
    }
};

controller.getAll = async (req, res) => {
    try {
        // const users = await User.findAll({
        //     attributes: ['age', [Sequelize.fn('COUNT', Sequelize.col('_id')), 'count']],
        //     group: "age",
        //     order: [['age', 'DESC']]
        // });

        const { count, rows } = await User.findAndCountAll({
            offset: 1,
            limit: 5,
        })

        return res.status(200).json({
            count,
            users: rows,
        })
    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await User.destroy({
            where: { _id: id }
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