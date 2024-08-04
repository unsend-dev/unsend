const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 2587,
    secure: false,
    auth: {
      user: "unsend",
      pass: "us_38de56vwa7_cc90a91b01a402de0c15516b3554adc1",
    },
    tls: {
        rejectUnauthorized: false,
    }
  });
  


const mailOptions = {
    to: "harsh121102@gmail.com",
    from: "hello@support.harshbhat.me",
    subject: "Testing SMTP",
    html: "<strong>THIS IS USING SMTP,</strong><p>Unsend is the best open source sending platform<p><p>check out <a href='https://unsend.dev'>unsend.dev</a>",
    text: "hello,\n\nUnsend is the best open source sending platform",
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});




