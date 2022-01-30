import bcrypt from 'bcryptjs';
import crypto from "crypto";
import User from '../models/user'
import Token from '../models/token';
import { NextFunction, Request, Response } from 'express';
import { Nodemailer } from '../services/nodemailer';
import { Directories } from '../directories';
import { HttpStatus } from '@serkans/status-codes';
import { JoiValidationError } from '@serkans/error-handler';
import { signinValidation, signupValidation } from '../validations/user';

export class UserController {
    public async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = signupValidation(req.body);
            if (validate) {
                console.log("signup");
                if (!validate.error) {
                    const { email, name, surname, password } = req.body
                    let user = await User.findOne({ email });
                    if (!user) {
                        user = await new User({ name, surname, password, email }).save();
                        if (user) {
                            const token = user.generateAuthToken();
                            req.session = { jwt: token };
                            res.status(HttpStatus.CREATED).send({ user });
                        }
                    } else {
                        throw new Error("user already registered.");
                    }
                } else {
                    throw new JoiValidationError(validate.error.details);
                }
            }
        } catch (error) {
            next(error);
        }
    }
    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = signinValidation(req.body);
            if (validate) {
                if (!validate.error) {
                    const { email, password } = req.body;
                    const user = await User.findOne({ email });
                    if (user) {
                        const result = await bcrypt.compare(password, user.password);
                        if (result) {
                            const token = user.generateAuthToken();
                            req.session = { jwt: token };
                            res.status(HttpStatus.OK).send({ user });
                        } else {
                            throw new Error("invalid authentication credentials");
                        }
                    } else {
                        throw new Error("user not found!");
                    }
                } else {
                    throw new JoiValidationError(validate.error.details);
                }
            }
        } catch (error) {
            next(error);
        }
    }
    public async signout(req: Request, res: Response, next: NextFunction) {
        try {
            req.session = null;
            res.send({})
        } catch (error) {
            next(error);
        }
    }
    public async getCurrentUser(req: Request, res: Response) {
        res.send({ currentUser: req.currentUser || null });
    }
    public async sendResetEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                let token = await Token.findOne({ userId: user._id });
                if (token) {
                    await token.deleteOne();
                }
                let resetToken = crypto.randomBytes(32).toString("hex");
                const hash = await bcrypt.hash(resetToken, 10);
                if (hash) {
                    await new Token({ userId: user._id, token: hash, createdAt: Date.now() }).save();
                }
                const link = `${req.headers.referer}/login?token=${resetToken}&id=${user._id}`;
                const path = `${Directories.scripts}/requestResetPassword.handlebars`
                const title = "Şifre Değiştirme Talebi";
                const sendEmailResult = await Nodemailer.sendEmailViaMailgun(user.email, title, { name: user.name, link: link }, path);
                if (sendEmailResult && sendEmailResult.indexOf("queued") == -1) {
                    res.status(HttpStatus.OK).json(sendEmailResult);
                }
            } else {
                throw new Error("user not found");
            }
        } catch (error) {
            next(error);
        }
    }
    public async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            let passwordResetToken = await Token.findOne({ userId: req.body.userId });
            if (passwordResetToken) {
                const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
                if (isValid) {
                    const hash = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT as any));
                    await User.updateOne({ _id: req.body.userId }, { $set: { password: hash } }, { new: true });
                    const user = await User.findById({ _id: req.body.userId });
                    if (user) {
                        const text = "Şifreniz başarıyla değiştirildi";
                        const path = `${Directories.scripts}/resetPassword.handlebars`
                        const sendEmailResult = await Nodemailer.sendEmailViaMailgun(user.email, text, { name: user.name }, path);
                        if (sendEmailResult && sendEmailResult.indexOf("queued") == -1) {
                            await passwordResetToken.deleteOne();
                            res.status(HttpStatus.OK).json(sendEmailResult);
                        }
                    }
                } else {
                    throw new Error("invalid or expired password reset token");
                }
            } else {
                throw new Error("invalid or expired password reset token");
            }
        } catch (error) {
            next(error);
        }
    }
}