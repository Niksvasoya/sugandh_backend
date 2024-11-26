const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");


class EmailHandler {
    async emailSend(email, body, subject, cc = "", attachments = []) {
        try {
            const transporter = nodemailer.createTransport(
                smtpTransport({
                    host: process.env.SMTP_HOST,
                    secure: false,
                    port: process.env.SMTP_PORT,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },

                })
            );

            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error, success);
                    return false;
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
            const mailOptions = {
                from: process.env.SMTP_MAIL_FROM,
                to: email,
                subject,
                html: body,
            };
            if (attachments.length > 0) {
                mailOptions["attachments"] = attachments;
            }

            if (cc != "") {
                mailOptions["cc"] = cc;
            }
            await transporter.sendMail(mailOptions).then(
                (result) => {
                    console.log("email success:: ", result.accepted);
                    return result;
                },
                (error) => {
                    console.log("email error:: ", error);
                    return false;
                }
            );
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
module.exports = new EmailHandler();