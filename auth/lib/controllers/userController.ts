import bcrypt from 'bcryptjs';
import crypto from "crypto";
import User, { validateUser } from '../models/user'
import Token from '../models/token';
import { NextFunction, Request, Response } from 'express';
import { Nodemailer } from '../services/nodemailer';
import { Directories } from '../directories';
import { HttpStatus } from '../enums/status';
import { JoiValidationError } from '../errors/joi-validation-error';

export class UserController {
    public async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = validateUser(req.body);
            if (validate) {
                if (!validate.error) {
                    const { email, name, surname, password } = req.body
                    let user = await User.findOne({ email });
                    if (!user) {
                        user = await new User({ name, surname, password, email }).save();
                        if (user) {
                            const token = user.generateAuthToken();
                            res.header("Authorization", "Bearer " + token).send({ user, token });
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
    public async getCurrentUser(req: Request, res: Response) {
        try {
            res.send('deneme currentuser!!')
        } catch (error) {

        }
    }
    public async signout(req: Request, res: Response) {
        try {
            res.send('deneme signout!!')
        } catch (error) {

        }
    }

    public async login(req: Request, res: Response) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" })
            } else {
                const result = await bcrypt.compare(req.body.password, user.password);
                if (!result) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid authentication credentials" })
                }
                const token = user.generateAuthToken();
                res.header("Authorization", "Bearer " + token).send({ token: token, email: user.email });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERVAL_SERVER_ERROR).json({ message: error })
        }
    }
    public async sendResetEmail(req: Request, res: Response) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" })
            }
            let token = await Token.findOne({ userId: user._id });
            if (token) {
                await token.deleteOne();
            }
            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(resetToken, parseInt(process.env.BCRYPT_SALT as any));
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
        } catch (error) {
            res.status(HttpStatus.INTERVAL_SERVER_ERROR).json(error);
        }
    }
    public async resetPassword(req: Request, res: Response) {
        try {
            let passwordResetToken = await Token.findOne({ userId: req.body.userId });
            if (!passwordResetToken) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid or expired password reset token" });
            }
            const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
            if (!isValid) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid or expired password reset token" });
            }
            const hash = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT as any));
            await User.updateOne({ _id: req.body.userId }, { $set: { password: hash } }, { new: true });
            const user = await User.findById({ _id: req.body.userId });
            if (user) {
                const text = "Şifreniz başarıyla değiştirildi";
                const path = `${Directories.scripts}/resetPassword.handlebars`
                const sendEmailResult = await Nodemailer.sendEmailViaMailgun(user.email, text, { name: user.name }, path);
                if (sendEmailResult && sendEmailResult.indexOf("queued") == -1) {
                    await passwordResetToken.deleteOne();
                    return res.status(HttpStatus.OK).json(sendEmailResult);
                }
            }
        } catch (error) {
            res.status(HttpStatus.INTERVAL_SERVER_ERROR).json(error);
        }
    }
    public async getUserByEmail(req: Request, res: Response) {
        try {
            const user = await User.findOne({ email: req.params.email as string });
            if (user) {
                res.status(HttpStatus.OK).json(user);
            }
        } catch (error) {
            res.status(HttpStatus.INTERVAL_SERVER_ERROR).json(error)
        }

    }
    public async updateUser(req: Request, res: Response) {
        try {
            if (req.body.password) delete req.body.password
            if (req.body.email) delete req.body.email;
            const user = await User.findOneAndUpdate({ id: req.query.id }, req.body);
            if (user) {
                res.status(HttpStatus.CREATED).json(user);
            }
        } catch (error) {
            res.status(HttpStatus.INTERVAL_SERVER_ERROR).json(error);
        }
    }
    public async updateImage(req: Request, res: Response) {
        try {
            if ((req as any).file) {
                var file = "/images/" + (req as any).file.filename;
                const result = await User.findByIdAndUpdate(req.params.id, { imageLink: file });
                if (result) {
                    res.sendStatus(HttpStatus.OK).json(result);
                }
            };
        } catch (error) {
            res.status(HttpStatus.INTERVAL_SERVER_ERROR).json(error);
        }
    }
}