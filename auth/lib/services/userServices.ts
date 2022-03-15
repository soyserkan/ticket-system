const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const mg = require("nodemailer-mailgun-transport");

export default class UserService {
    constructor() {
    }
    public async sendEmail(params: { email: string, subject: string, payload: object, templatePath: string }) {
        if (process.env.MAILGUN_APIKEY && process.env.MAILGUN_DOMAIN && process.env.FROM_EMAIL) {
            const transporter = nodemailer.createTransport(mg({ auth: { api_key: process.env.MAILGUN_APIKEY, domain: process.env.MAILGUN_DOMAIN } }));
            const source = fs.readFileSync(params.templatePath, "utf8");
            const compiledTemplate = handlebars.compile(source);
            var response = await transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: params.email,
                subject: params.subject,
                html: compiledTemplate(params.payload),
            })
            if (response && response.message) {
                return response.message;
            }
        } else {
            return new Error("MAILGUN_APIKEY,MAILGUN_DOMAIN or FROM_EMAIL must be defined for sending email");
        }
    }
}