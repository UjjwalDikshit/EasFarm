const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmerSchema')
const Login = async(req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).send({ success: false, message: "Invalid Credentials" });
        }

        const frmer = await Farmer.findOne({ mobileNumber });

        if (!frmer) {
            return res.status(401).send({ success: false, message: 'Farmer has not registered' });
        }

        const matchPassword = await bcrypt.compare(password, frmer.password);
        if (!matchPassword) {
            return res.status(401).send({ success: false, message: 'Invalid Credential' });
        }

        const secretKey = process.env.JWT_SECRET;
        const payload = {
            _id: frmer._id,
            role: frmer.role,
            mobileNumber: mobileNumber
        };

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 1000 });

        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            token: token // Sending the token in the response is also a good practice
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "Error in Login: " + err.message
        });
    }
};

module.exports = Login;
