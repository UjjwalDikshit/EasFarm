const bcrypt = require('bcrypt');
const Farmer = require('../models/farmerSchema');
const validateFarmerInput = require('../utils/validate');



const signUp = async(req, res) => {
    try {

        const {
            fullName,
            mobileNumber,
            alternateMobile,
            password,
            villageOrCity,
            district,
            state,
            emailId,
            pincode,
            gpsLocation,
            acceptTerms,
            allowDataSharing
        } = req.body;

        await validateFarmerInput(req.body);

        console.log(gpsLocation.coordinates[1]);
        console.log(gpsLocation.coordinates[0]);

        const isPhoneNumberUniq = await Farmer.findOne({ mobileNumber });


        if (isPhoneNumberUniq) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists"
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new farmer document
        const farmer = await Farmer.create({
            fullName,
            mobileNumber,
            alternateMobile,
            password: hashedPassword,
            villageOrCity,
            district,
            state,
            emailId,
            pincode,
            gpsLocation,
            acceptTerms,
            allowDataSharing
        });

        res.status(201).send({
            success: true,
            message: "Registered Successfully"
        });


    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error in SignUp: " + err.message
        });
    }
}

module.exports = signUp;


/*

req = contains request metadata (headers, params, query, body, etc.)
req.body = contains the JSON or form data sent by the client.
If you destructure from req, all variables will be undefined because req doesn’t directly have these keys.

*/

/* for testing api
    
    {
    "fullName": "Rajesh Kumar",
    "mobileNumber": "9876543210",
    "alternateMobile": "9123456780",
    "password": "1234",
    "villageOrCity": "Rampur",
    "district": "Varanasi",
    "state": "Uttar Pradesh",
    "pincode": "221001",
    "gpsLocation": {
        "latitude": 25.3176,
        "longitude": 82.9739
    },
    "acceptTerms": true,
    "allowDataSharing": true
    }

 */