import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import { ResetUserModel } from '../models/ResetUserModel';
import { UserModel } from '../models/UserModel';
import ErrorObject from '../utils/ErrorObject';
import { TOKEN_VAILIDITY_DURATION_IN_MINUTES } from '../models/ResetUserModel';
import { defaultMailTemplate } from '../resources/mailTemplates';
import * as KEYS from '../config/envKeys';

export async function forgot(req: Request, res: Response, next: NextFunction) {
    let email;
    try {
        email = req.body.email;

        // Whether email registered?
        // todo: Shouldn't necessarily inform that email unregistered yet.
        // todo: just say that checkregistered email for forgot password, even if we don't find user.
        const foundEmailUser = await UserModel.findOne({ email });
        if (!foundEmailUser) {
            return next(new ErrorObject(400, 'No such email registered! Will not generate token.'));
        }
    } catch (e) {
        console.log(`Error during finding user by Email in Forgot Password: ${e}`);
        return next(new ErrorObject(500));
    }

    // todo: Better tokens with UUID library.
    const token = Math.random().toString(20).substring(2, 12);

    // in millisecs:
    const tokenValidityLimitEpoch = new Date().valueOf() + TOKEN_VAILIDITY_DURATION_IN_MINUTES * 60 * 1000;

    // Try saving the reset user model in DB:
    try {
        const newReset = new ResetUserModel({ email, token, validity: tokenValidityLimitEpoch });
        await newReset.save()
    } catch (e) {
        console.log(`Error during forgot password: ${e}`);
        return next(new ErrorObject(500));
    }

    // Try sending the Forgot password mail containing token:
    try {
        const redirectUrl = `${KEYS.FE_URI}/reset/${token}`;
        await defaultMailTemplate({ toMail: email, subject: 'Reset Auth-Node-React password!', html: `Click <a href="${redirectUrl}">here</a> to reset Password. Will expire at ${TOKEN_VAILIDITY_DURATION_IN_MINUTES} minutes.` });
        return res.status(200).send({ success: 'true', message: `Send token to your registered Email. Will expire in ${TOKEN_VAILIDITY_DURATION_IN_MINUTES} minutes.`, data: { validity: tokenValidityLimitEpoch } });
    } catch (e) {
        console.log(`Error during Forgot password mail generation: ${e}`);
        return next(new ErrorObject(500, 'Error during forgot password mail generation.'));
    }
}

export async function reset(req: Request, res: Response, next: NextFunction) {
    // Passwords don't match?
    if (req.body.password !== req.body.password_confirm)
        return next(new ErrorObject(400, `Invalid inputs. Passwords and Confirm-Password fields don't match.`));

    // Token stored?
    let foundResetData;
    try {
        if (!req.body.token) {
            return next(new ErrorObject(400, `Token missing in request body. Please use forgot password link sent in mail.`));
        }
        foundResetData = await ResetUserModel.findOne({ token: req.body.token });
        // Reset token has TTL of certain duration, and then its deleted from DB automatically.
        // So, if token not found, then:
        //  - Either token expired and got automatically deleted from DB.
        //  - Or Invalid, and never existed in DB.
        if (!foundResetData) {
            return next(new ErrorObject(400, `Invalid or expired token. Try regenerating from Forgot password page.`));
        }
    } catch (e) {
        console.log(`Error in finding reset user model while resetting password: ${e}`);
        return next(new ErrorObject(500));
    }

    // Email user found?
    const email = foundResetData.toJSON().email;

    // User found?
    let foundUser;
    try {
        foundUser = await UserModel.findOne({ email });
        if (!foundUser)
            return next(new ErrorObject(400, 'Cannot find any user with such an email id.'));
    } catch (e) {
        console.log(`Error in finding user email while resetting password: ${e}`);
        return next(new ErrorObject(500));
    }

    // Creating new password:
    const salt = await bcryptjs.genSalt(KEYS.SALT_ROUNDS ? parseInt(KEYS.SALT_ROUNDS) : 10);
    const hashedNewPassword = await bcryptjs.hash(req.body.password, salt);

    // Setting new password:
    try {
        foundUser.password = hashedNewPassword;
        foundUser.save();
    } catch (e) {
        console.log(`Error in saving new password while resetting password: ${e}`);
        return next(new ErrorObject(500));
    }

    // todo: Delete the token after it was used:
    try {
        await defaultMailTemplate({ toMail: email, subject: 'Successfully reset password!', html: `Successfully reset your Auth-Node-React password!` });
        res.status(200).send({ success: 'true', message: 'Successfully changed password' });
    } catch (e) {
        console.log(`Error during Reset password mail generation: ${e}`);
        return next(new ErrorObject(500, 'Error during reset password mail generation.'));
    }

    // todo: redirect, or clear cookies? So that tries to login again.
}
