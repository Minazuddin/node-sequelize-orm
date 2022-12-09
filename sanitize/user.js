const { Users } = require('../models');
const { checkDuplicateEmail, comparePassword } = require("../utils/helper");

exports.create = async (data) => {
    try {
        const {
            email,
            password,
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
        } else if (!password) {
            return {
                code: 400,
                message: 'User password is required!'
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

        const duplicateEmailErr = await checkDuplicateEmail(email);

        if (duplicateEmailErr) return duplicateEmailErr;

        return false;

    } catch (err) {

        console.error(err);

        return {
            code: 500,
            message: 'Internal Server Error!'
        };
    }
};

exports.login = async (data) => {
    try {
        //1. Assertion
        if (!data.email) return [{ code: 400, message: 'Email is Required!' }, null]
        if (!data.password) return [{ code: 400, message: 'Password is Required!' }, null]

        //2. Validation (Email)
        const user = await Users.findOne({
            where: {
                email: data.email
            }
        });
        if (!user) return [{ code: 401, message: 'Incorrect Email!' }, null]

        //3. Validation (Password)
        const isMatch = comparePassword(data.password, user.password);
        if (!isMatch) return [{ code: 401, message: 'Incorrect Password!' }, null]

        return [null, user._id];

    } catch (err) {
        console.error(err);

        return [{
            code: 500,
            message: 'Internal Server Error!'
        }, null]
    }
};