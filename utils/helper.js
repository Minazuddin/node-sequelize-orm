const { Op } = require('sequelize');
const { Users } = require('../models');

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
        resPayload.status = false;
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

exports.sanitize = {
    createUserPayload: async (data) => {
        try {
            const {
                email,
                first_name,
                last_name,
                age,
            } = data;
            // Assertions
            if (!email) {
                return {
                    code: 400,
                    message: 'User email is required!'
                };
            } else if (!first_name) {
                return {
                    code: 400,
                    message: 'User first_name is required!'
                };
            } else if (!last_name) {
                return {
                    code: 400,
                    message: 'User last_name is required!'
                };
            } else if (!age) {
                return {
                    code: 400,
                    message: 'User age is required!'
                };
            }

            const duplicateEmailErr = await this.checkDuplicateEmail(email);

            if (duplicateEmailErr) return duplicateEmailErr;

            return false;
        } catch (err) {
            console.error(err);

            return {
                code: 500,
                message: 'Internal Server Error!'
            };
        }
    },
    createVehiclePayload: (data) => {
        if (!data.brand) return { code: 400, message: 'Vehicle Brand is Required!' }
        if (!data.model) return { code: 400, message: 'Vehicle Model is Required!' }
        return false;
    },
};