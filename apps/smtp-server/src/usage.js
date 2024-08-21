const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.unsend.dev",
  port: 2587,
  secure: false,
  auth: {
    user: "unsend",
    pass: "us_123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const mailOptions = {
  to: "sender@example.com",
  from: "hello@example.com",
  subject: "Testing SMTP",
  html: "<strong>THIS IS USING SMTP,</strong><p>Unsend is the best open source sending platform<p><p>check out <a href='https://unsend.dev'>unsend.dev</a>",
  text: "hello,\n\nUnsend is the best open source sending platform",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});
