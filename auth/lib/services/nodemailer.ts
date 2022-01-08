const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const mg = require("nodemailer-mailgun-transport");

export class Nodemailer {
    static async sendEmailViaMailgun(email, subject, payload, template) {
        try {
            const transporter = nodemailer.createTransport(mg({ auth: { api_key: process.env.MAILGUN_APIKEY, domain: process.env.MAILGUN_DOMAIN } }));
            const source = fs.readFileSync(template, "utf8");
            const compiledTemplate = handlebars.compile(source);
            var response = await transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            })
            if (response && response.message) {
                return response.message;
            }
        } catch (error) {
            return error;
        }
    };
}