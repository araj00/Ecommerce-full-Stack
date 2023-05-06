import nodemailer from 'nodemailer'

export const sendEmail = async(data) => {

    try{

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_ID, // generated ethereal user
            pass: process.env.MP // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.txt, // plain text body
          html: data.html, // html body
        });
      
        console.log("Message sent: %s", info.messageId)
        
    }
    catch(err){
        console.log(err)
    }
}