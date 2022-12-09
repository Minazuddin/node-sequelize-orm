const { Users, Vehicles } = require('../models');
const { handleError, sanitize, sendResponse, checkDuplicateEmail } = require('../utils/helper');

Users.hasMany(Vehicles);

const controller = {};

controller.create = async (req, res) => {
    try {
        const data = req.body;

        // 1. Sanitize inputs
        const err = await sanitize.createUserPayload(data);
        if (err) return res.status(err.code).json({ status: false, message: err.message });

        // 2. Create user
        const user = await Users.create(data);
        return sendResponse(res, 201, 'User Created!', user);
    } catch (err) {
        handleError(err, res);
    }
};

controller.update = async (req, res) => {
    try {
        const data = req.body;
        
        const { id } = req.params;

        if (data.email) {
            const err = await checkDuplicateEmail(data.email, id);
            if (err) return sendResponse(res, 409, 'Email Already Exist!')  
        };

        await Users.update(data, { where: { _id: id } });
        
        return sendResponse(res, 200, 'User Updated!');
    
    } catch (err) {
        handleError(err, res);
    }
};

controller.getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();

        return  sendResponse(res, 200, 'User List!', users);
    
    } catch (err) {
        handleError(err, res);
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Users.destroy({
            where: { _id: id }
        });

        if (!result) return sendResponse(res, 404, 'Users Not Found!');

        return sendResponse(res, 200, 'User Deleted!')

    } catch (err) {
        handleError(err, res);
    }
};

module.exports = controller;
