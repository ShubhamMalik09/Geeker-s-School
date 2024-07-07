const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email,title,body) =>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: "Geerker's School || Your Study Hub - by ShubhamSam",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        });
        console.log("mail sender info",info.response);
        return info;
    } catch(err){
        console.log("error in sending mail")
        console.log(err.message);
    }
};

module.exports = mailSender;