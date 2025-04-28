const nodemailer = require('nodemailer')

const sendEmail =async options =>{
    //1)create transporter
    // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "38a47af3aa0444",
      pass: "91d495992d6ce5"
    }
  });
    //2)define the email options
    const mailOptions = {
        from : 'SEEDART007 <dashranger60@gmail.com>',
        to:options.email,
        subject : options.subject,
        text:options.message,
        
    }
    //3)send the email
   await transport.sendMail(mailOptions)
}
module.exports=sendEmail;