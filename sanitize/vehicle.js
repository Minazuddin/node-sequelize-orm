const { Vehicles } = require('../models');
const { checkDuplicatePlateNumber } = require('../utils/helper');

exports.create = async (data) => {
    if (!data.brand) return { code: 400, message: 'Vehicle Brand is Required!' }
    if (!data.model) return { code: 400, message: 'Vehicle Model is Required!' }
    if (!data.plate_number) return { code: 400, message: 'Vehicle Plate Number is Required!' }

    const err =  await checkDuplicatePlateNumber(data.plate_number);
    if (err) return err;
    
    return false;
};