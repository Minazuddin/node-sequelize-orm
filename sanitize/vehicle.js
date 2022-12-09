exports.create = (data) => {
    if (!data.brand) return { code: 400, message: 'Vehicle Brand is Required!' }
    if (!data.model) return { code: 400, message: 'Vehicle Model is Required!' }
    return false;
};