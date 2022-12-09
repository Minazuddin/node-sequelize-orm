const jwt = require('jsonwebtoken');
const { sendResponse } = require('./helper');

exports.authenticate = (req, res, next) => {
    try {
        if (!req.headers.hasOwnProperty('x-access-token')) return sendResponse(res, 400, `Header missing - x-access-token`)

        const token = req.headers['x-access-token'];
        
        if (!token) return sendResponse(res, 400, 'Token is Required!');

        req.decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        next();

    } catch (err) {
        
        console.error(err);

        return sendResponse(res, 401, 'Unauthorized Action!');
    }
};