const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { Users, Vehicles } = require('../models');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { JWK, JWS } = require('node-jose');
const JwkToPem = require('jwk-to-pem');
const { sendResponse, handleError } = require('../utils/helper');

const PRIVATE_KEY_PATH = path.join(__dirname, '../keys', 'private.pem');
const PRIVATE_JWKS_PATH = path.join(__dirname, '../keys', 'jwks.json');
const PUBLIC_JWKS_PATH = path.join(__dirname, '../public', '.well-known', 'jwks.json');

exports.generateJwkSet = async (req, res) => {
    try {
        //1. Read private key file
        const privateKeyText = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');

        //2. Create empty keystore
        const keystore = JWK.createKeyStore();

        //3. Add private key to the keystore
        await keystore.add(privateKeyText, 'pem');

        //4. Write to ./keys/jwks.json file for private access

        // Export all keys
        const keyStoreJson = keystore.toJSON(true);

        // Write to ./keys/jwks.json
        fs.writeFileSync(PRIVATE_JWKS_PATH, JSON.stringify(keyStoreJson, null, "  "));

        //5. Write to ./public/keys/jwks.json file for public access

        // Import keystore from private jwk-set
        const privateJwksJson = fs.readFileSync(PRIVATE_JWKS_PATH, 'utf-8');
        const privateKeyStore = await JWK.asKeyStore(privateJwksJson.toString());

        // Export only public key
        const publicKeyJson = privateKeyStore.toJSON(false);

        // Write to ./public/keys/jwks.kson
        fs.writeFileSync(PUBLIC_JWKS_PATH, JSON.stringify(publicKeyJson, null, "  "));

        return sendResponse(res, 200, 'JWK set generated successfully!', publicKeyJson);
    } catch (err) {
        handleError(err, res, err.message);
    }
};

exports.signJwt = async (req, res) => {
    try {
        const { payload } = req.body;

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

        return sendResponse(res, 200, 'JWT signed successfully!', {
            token
        })

    } catch (err) {
        handleError(err, res, err.message);
    }
};

exports.verifyJwt = async (req, res) => {
    try {
        if (!req.headers.hasOwnProperty('x-access-token')) return sendResponse(res, 400, `[x-access-token] Header is missing`)
        
        const token = req.headers['x-access-token'];
        if (!token) return sendResponse(res, 400, 'Token is Required!');

        //1. Get public key from public jwks.json
        const privateJwksJson = fs.readFileSync(PUBLIC_JWKS_PATH, 'utf-8');
        const { keys } = JSON.parse(privateJwksJson);
        const [firstKey] = keys;

        //2. Convert public key to pem
        const publicKey = JwkToPem(firstKey);

        //3. verify token
        const decoded = JWT.verify(token, publicKey);

        return sendResponse(res, 200, 'JWT verified successfully!', {
            decoded
        });

    } catch (err) {
        handleError(err, res, err.message);
    }
};