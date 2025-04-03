const nodemailer = require('nodemailer');
const { generateToken } = require('./utils/JWTutils');

async function sendEmail(to, token) {
    console.log(`[sendEmail] Preparing to send email to: ${to}`);
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to:to,
        subject: 'Password Reset Token',
        text: `Use this token to reset your password: ${token}`
    };

    try {
        console.log(`[sendEmail] Sending email with token: ${token}`);
        await transporter.sendMail(mailOptions);
        console.log(`[sendEmail] Email successfully sent to: ${to}`);
    } catch (error) {
        console.error(`[sendEmail] Failed to send email to ${to}:`, error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function forgotPasswordHandler(req, res) {
    console.log('[ForgotPasswordHandler] Handler invoked.');

    const { email } = req.body;
    console.log(`[ForgotPasswordHandler] Received request for email: ${email}`);

    if (!email) {
        console.error('[ForgotPasswordHandler] Email is missing in the request.');
        return res.status(400).send('Email is required.');
    }

    console.log('[ForgotPasswordHandler] Generating token...');
    const token = generateToken({ email }); // Generate JWT token
    console.log(`[ForgotPasswordHandler] Token generated and stored for email: ${email}`);

    try {
        console.log(`[ForgotPasswordHandler] Attempting to send email to: ${email}`);
        await sendEmail(email, token);
        console.log(`[ForgotPasswordHandler] Reset token successfully sent to email: ${email}`);
        res.status(200).send('Reset token sent to your email.');
    } catch (error) {
        console.error(`[ForgotPasswordHandler] Failed to send email to ${email}:`, error);
        res.status(500).send('Failed to send email.');
    }

    console.log('[ForgotPasswordHandler] Handler execution completed.');
}

module.exports = { forgotPasswordHandler };
