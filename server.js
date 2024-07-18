const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const { color, size, email, address } = req.body;

    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'social.jrd@gmail.com',
            pass: 'luxurywatchessince2024'
        }
    });

    // Setup email data
    let mailOptions = {
        from: 'social.jrd@gmail.com',
        to: 'social.jrd@gmail.com',
        subject: 'New Purchase',
        text: `Color: ${color}\nSize: ${size}\nEmail: ${email}\nAddress: ${address}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});