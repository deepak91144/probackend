const nodemailer = require("nodemailer");
const nodeMailer = async (options) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,

    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });
  const message = {
    from: '"probackend 👻" <iamdj1111@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
  };
  // send mail with defined transport object
  return await transporter.sendMail(message);
};
module.exports = nodeMailer;
