const nodemailer = require('nodemailer');

// Create a transporter using your email service's credentials
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // Default to Gmail if not specified
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

const sendRegistrationEmail = async (userEmail, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Confirmation: You are registered for ${eventTitle}!`,
      html: `
        <h1>Registration Successful</h1>
        <p>Hi,</p>
        <p>You have been successfully registered for the event: <strong>${eventTitle}</strong>.</p>
        <p>Thank you for registering!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendRegistrationEmail
};