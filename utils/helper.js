const { Op } = require('sequelize');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1d'
        });
        return [null, token];
    } catch (err) {
        console.error(err);
        return ['Internal Server Error!', null]
    }
};

exports.comparePassword = (password, encPassword) => bcrypt.compareSync(password, encPassword);

exports.handleError = (err, res) => {
    console.error(err);

    res.status(500).json({
        status: false,
        message: 'Internal Server Error!'
    })
};

exports.sendResponse = (res, code, message, data) => {
    let resPayload = {
        status: false,
        message,
        data
    };

    if (code === 200 || code === 201) {
        resPayload.status = true;
    }

    res.status(code).json(resPayload);
};

exports.checkDuplicateEmail = async (email, id) => {
    let query = {
        email
    };

    if (id) {
        query._id = {
            [Op.ne]: id
        }
    }

    const user = await Users.findOne({
        where: query,
        attributes: ['_id']
    });

    if (user) {
        return {
            code: 409,
            message: 'User with same email already exist!'
        };
    }
};