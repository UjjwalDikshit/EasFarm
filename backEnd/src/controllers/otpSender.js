// const crypto = require('crypto');
// const nodemailer = require('nodemailer');


// const redisClient = require('../config/redis');


// const sendOtp = async(otp, emailId) => {
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: 'ujjwaldikshit1@gmail.com',

//             pass: process.env.GMAILPASS
//         }
//     });
//     console.log('try3');

//     await transporter.sendMail({
//         from: 'ujjwaldikshit1@gmail.com',
//         to: `${emailId}`,
//         subject: 'Your OTP Code for Verification at easFarm',
//         text: `Your OTP is ${ otp }.It expires in 5 minutes.`

//     });
//     console.log('try4');

// };

// const otpHandler = async(req, res) => {

//     try {
//         const emailId = req.body.emailId;
//         const otp = crypto.randomInt(100000, 999999).toString();
//         await redisClient.set(`emailOtp:${emailId}`, otp, { EX: 300 });
//         console.log('try1');
//         await sendOtp(otp, emailId);
//         console.log('try2');

//         res.status(200).send(`OTP sent successfully to your email: ${emailId}`);
//     } catch (err) {
//         res.status(500).send("Failed to send OTP. Try again.");
//     }

// }

// module.exports = otpHandler;

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const redisClient = require('../config/redis');

const sendOtp = async(otp, emailId) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ujjwaldikshit1@gmail.com',
            pass: process.env.GMAILPASS
        }
    });

    await transporter.sendMail({
        from: 'ujjwaldikshit1@gmail.com',
        to: emailId,
        subject: 'Your OTP Code for Verification at easFarm',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });
};

const otpHandler = async(req, res) => {
    try {
        const emailId = req.body.emailId;
        const otp = crypto.randomInt(100000, 999999).toString();

        await redisClient.set(`emailOtp:${emailId}`, otp, { EX: 300 });
        await sendOtp(otp, emailId);

        res.status(200).send(
            {success:true,
             message: `OTP sent successfully to your email: ${emailId}`
            }
        );
    } catch (err) {
        console.error('OTP send error:', err);
        res.status(500).send("Failed to send OTP. Try again.");
    }
};

module.exports = otpHandler;