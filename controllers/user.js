const { Users, Vehicles } = require('../models');
const { handleError, sendResponse, checkDuplicateEmail, hashPassword, generateToken } = require('../utils/helper');
const sanitize = require('../sanitize/user');

Users.hasMany(Vehicles);

const controller = {};

controller.signup = async (req, res) => {
    try {
        const data = req.body;

        // 1. Sanitize inputs
        const sanitizeErr = await sanitize.create(data);
        if (sanitizeErr) return sendResponse(res, sanitizeErr.code, sanitizeErr.message);

        // 2. Hash password
        const [hashErr, hash] = hashPassword(data.password);
        if (hashErr) return sendResponse(res, hashErr.code, hashErr.message);

        // 3. Create user
        const userData = {
            email: data.email,
            password: hash,
            first_name: data.first_name,
            last_name: data.last_name,
            age: data.age,
            address: data.address
        };
        const user = await Users.create(userData);

        const response = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            address: user.address
        };
        return sendResponse(res, 201, 'User Created!', response);
    } catch (err) {
        handleError(err, res);
    }
};

controller.login = async (req, res) => {
    try {
        //1. Sanitize inputs
        const data = req.body;
        const [sanitizeErr, userId] = await sanitize.login(data);
        if (sanitizeErr) return sendResponse(res, sanitizeErr.code, sanitizeErr.message);
        
        //2. Generate token
        const [tokenErr, token] = generateToken({ _id: userId });
        if (tokenErr) return sendResponse(res, tokenErr.code, tokenErr.message);
        
        //3. Return response
        return sendResponse(res, 200, 'Logged in!', { token });
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

controller.getAll = async (req, res) => {
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