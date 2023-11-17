const jwt = require('jsonwebtoken');
const { sendResponse, verifyJwt } = require('./helper');

exports.Authorize = (req, res, next) => {
    try {
        if (!req.headers.hasOwnProperty('x-access-token')) return sendResponse(res, 400, `Header is missing, x-access-token`)
        
        const token = req.headers['x-access-token'];
        if (!token) return sendResponse(res, 400, 'Token is Required!');
        
        const [err, decoded] = verifyJwt(token);
        if (err) return sendResponse(res, err.code, err.message)
        
        console.log({
            decoded
        })

        req.decoded = decoded;
        next();
    } catch (err) {
        console.error(err);
        return sendResponse(res, 401, 'Unauthorized Action!');
    }
};