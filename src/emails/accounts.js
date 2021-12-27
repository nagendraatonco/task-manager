var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelComeEmail = (email, name) =>{
  var mailOptions = {
    from: 'nagendraambig85@gmail.com',
    to: email,
    subject: 'Thank you for subscribing',
    text: `Hello ${name} welcome to my website, I hope you will enjoy our services`,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendCancellationEmail = (email, name) =>{
  var mailOptions = {
    from: 'nagendraambig85@gmail.com',
    to: email,
    subject: 'Unsubscribe mail',
    text: `good Bye ${name}, you won't receive any emails from now on`,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
module.exports = {
  sendWelComeEmail,
  sendCancellationEmail
}