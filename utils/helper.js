const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { Users, Vehicles } = require('../models');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { JWK, JWS } = require('node-jose');
const JwkToPem = require('jwk-to-pem');


const PRIVATE_KEY_PATH = path.join(__dirname, '../keys', 'private.pem');
const PRIVATE_JWKS_PATH = path.join(__dirname, '../keys', 'jwks.json');
const PUBLIC_JWKS_PATH = path.join(__dirname, '../public', '.wellknown', 'jwks.json');

exports.generateJwkSet = async () => {
    try {
        if (fs.existsSync(PRIVATE_JWKS_PATH)) return;

        //1. Read private key file
        const privateKeyText = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');

        //2. Create empty keystore
        const keystore = JWK.createKeyStore();

        //3. Add private key to the keystore
        await keystore.add(privateKeyText, 'pem');

        //4. Write to ./keys/jwks.json file for private access

        // Export all keys
        const keyStoreObj = keystore.toJSON(true);

        // Write to ./keys/jwks.json
        fs.writeFileSync(PRIVATE_JWKS_PATH, JSON.stringify(keyStoreObj, null, "  "));

        //5. Write to ./public/keys/jwks.json file for public access

        // Import keystore from private jwk-set
        const privateJwksJson = fs.readFileSync(PRIVATE_JWKS_PATH, 'utf-8');
        const privateKeyStore = await JWK.asKeyStore(privateJwksJson.toString());

        // Export only public key
        const publicKeyObj = privateKeyStore.toJSON(false);

        // Write to ./public/keys/jwks.kson
        fs.writeFileSync(PUBLIC_JWKS_PATH, JSON.stringify(publicKeyObj, null, "  "));

    } catch (err) {
        console.error(err);
    }
};

exports.signJwt = async (payload) => {
    try {
    //1. Import private key store
    const privateJwksJson = fs.readFileSync(PRIVATE_JWKS_PATH, 'utf-8');
    const keyStore = await JWK.asKeyStore(privateJwksJson.toString());
    const [key] = keyStore.all({ use: "sig" });

    //2. Construct opts
    const opts = { compact: true, jwk: key, fields: { typ: "JWT" } };

    //3. Sign JWT with private key
        const token = await JWS.createSign(opts, key)
        .update(JSON.stringify(payload))
        .final();

        console.log(token);

        return [null, token];
        
    } catch (err) {
        console.error(err);
        return [{ code: 500, message: 'Internal Server Error!' }, null];
    }

};

exports.verifyJwt = (token) => {
    try {
        //1. Get public key from public jwks.json
        const privateJwksJson = fs.readFileSync(PUBLIC_JWKS_PATH, 'utf-8');
        const { keys } = JSON.parse(privateJwksJson);
        const [firstKey] = keys;

        //2. Convert public key to pem
        const publicKey = JwkToPem(firstKey);

        //3. verify token
        const decoded = JWT.verify(token, publicKey);
        return [null, decoded];

    } catch (err) {
        console.error(err);
        return [{ code: 500, message: err }, null];
    }
};

exports.comparePassword = (password, encPassword) => bcrypt.compareSync(password, encPassword);

exports.hashPassword = (password) => {
    try {
        return bcrypt.hashSync(password, process.env.HASH_SALT || 10)
    } catch (err) {
        console.error(err);
        return null;
    }
}

exports.handleError = (err, res, message = 'Internal Server Error!') => {
    console.error(err);

    res.status(500).json({
        status: false,
        message
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

    return false;
};

exports.checkDuplicatePlateNumber = async (plate_number) => {
    try {
        const vehicle = await Vehicles.findOne({
            where: {
                plate_number
            }
        });
    
        if (vehicle) {
            return {
                code: 409,
                message: 'Vehicle with same plate_number already exist!'
            };
        }
    
        return false;
    } catch (err) {
        console.error(err);
    }
};

