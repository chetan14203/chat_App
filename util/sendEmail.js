const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'fausto.hammes@ethereal.email',
        pass: '7DBPekACZXJ989xsmC'
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'choudharyc355@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;