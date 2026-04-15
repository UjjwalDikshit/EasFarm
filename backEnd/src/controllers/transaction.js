const Payment = require("../models/Payment");

module.exports = async function (req, res) {
    try {
        const userId = req.user._id;

        const doc = await Payment.find({ customer: userId }).lean();

        return res.status(200).json({
            success: true,
            data:doc
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};