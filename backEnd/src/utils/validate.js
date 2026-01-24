const validator = require('validator');
const Farmer = require('../models/farmerSchema');


const validateFarmerInput = async(data) => {

    const requiredFields = [
        "fullName",
        "mobileNumber",
        "password",
        "villageOrCity",
        "district",
        "state",
        "pincode",
        "acceptTerms"
    ];

    const isAllowed = requiredFields.every((val) => Object.keys(data).includes(val));
    if (!isAllowed) throw new Error("Filled Missed");

    const errors = {};
    const addError = (field, message) => {
        errors[field] = errors[field] || [];
        errors[field].push(message);
    };

    // 1. Mandatory fields
    if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
        addError('fullName', 'Full name is required and cannot be empty');
    }

    if (!data.mobileNumber) {
        addError('mobileNumber', 'Mobile number is required');
    } else if (!validator.isMobilePhone(data.mobileNumber, 'en-IN')) {
        addError('mobileNumber', 'Please provide a valid 10-digit mobile number');
    } else {
        const existingFarmer = await Farmer.findOne({ mobileNumber: data.mobileNumber });
        if (existingFarmer) addError('mobileNumber', 'Mobile number already in use');
    }

    if (!data.password) {
        addError('password', 'Password/PIN is required');
    } else if (!validator.isLength(data.password, { min: 4, max: 10 })) {
        addError('password', 'Password must be between 4 and 10 characters');
    }

    ['villageOrCity', 'district', 'state'].forEach(field => {
        if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length === 0) {
            addError(field, `${field} is required and cannot be empty`);
        }
    });

    if (!data.pincode) {
        addError('pincode', 'Pincode is required');
    } else if (!validator.isPostalCode(data.pincode, 'IN')) {
        addError('pincode', 'Please provide a valid 6-digit pincode');
    }

    // 2. Optional fields
    if (data.alternateMobile && !validator.isMobilePhone(data.alternateMobile, 'en-IN')) {
        addError('alternateMobile', 'Please provide a valid 10-digit mobile number');
    }

    if (data.gpsLocation) {
    const coords = data.gpsLocation.coordinates;

        if (!Array.isArray(coords) || coords.length !== 2) {
            addError('gpsLocation.coordinates', 'Coordinates must be [longitude, latitude]');
        } else {
                const [lng, lat] = coords;

                if (typeof lat !== 'number' || !validator.isFloat(lat.toString(), { min: -90, max: 90 })) {
                addError('gpsLocation.coordinates[1]', 'Latitude must be between -90 and 90');
                }

                if (typeof lng !== 'number' || !validator.isFloat(lng.toString(), { min: -180, max: 180 })) {
                addError('gpsLocation.coordinates[0]', 'Longitude must be between -180 and 180');
                }
        }
    }


    if (data.allowDataSharing !== undefined && typeof data.allowDataSharing !== 'boolean') {
        addError('allowDataSharing', 'Allow data sharing must be a boolean value');
    }

    if (data.role && !['farmer', 'serprovider', 'admin'].includes(data.role)) {
        addError('role', 'Invalid role specified');
    }

    // 3. Consent
    if (data.acceptTerms !== true) {
        addError('acceptTerms', 'You must accept the Terms & Conditions to register');
    }

    // 4.error if any
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify({
            success: false,
            message: 'Validation failed',
            errors
        }));
    }
}

module.exports = validateFarmerInput;