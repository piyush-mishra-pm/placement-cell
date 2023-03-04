import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import {sign} from 'jsonwebtoken';

import {UserModel} from '../models/UserModel';
import ErrorObject from '../utils/ErrorObject';
import { defaultMailTemplate } from '../resources/mailTemplates';
import * as KEYS from '../config/envKeys';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.password !== req.body.password_confirm) {
      return next(new ErrorObject(400, `Invalid inputs: passwords don't match`));
    }
    // Does user Already Exists?
    const existingUser = await UserModel.findOne({email: req.body.email});

    if (existingUser) {
      return next(new ErrorObject(400, 'Email already exists. Could not Signup the user!'));
    }

    // Salting Password:
    const salt = await bcryptjs.genSalt(KEYS.SALT_ROUNDS ? parseInt(KEYS.SALT_ROUNDS) : 10);
    const encryptedPassword = await bcryptjs.hash(req.body.password, salt);

    const newUser = new UserModel({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: encryptedPassword,
    });

    const saveDbResult = await newUser.save();
    const {password, ...savedDbResultWithoutPassword} = saveDbResult.toJSON();
    await defaultMailTemplate({ toMail: req.body.email, subject: 'Welcome to Auth-Node-React!', html: `Hi ${req.body.first_name} ${req.body.last_name}.</br>Welcome to Auth-Node-React.</br>Want to<a href='https://github.com/piyush-mishra-pm/auth-node-react'> visit the git repo</a>? </br> Link also here <pre>https://github.com/piyush-mishra-pm/auth-node-react</pre>` });
    return res.status(200).send({ success: "true", message: "Successfully created new user.", data: savedDbResultWithoutPassword });
  } catch (e) {
    console.log('SignUp failed: ', e);
    next(new ErrorObject(500, `Something went wrong in signUp!${e}`));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {

  try {
    // Whether User Found:
    const foundUser = await UserModel.findOne({email: req.body.email});
    if (!foundUser) {
      return next(new ErrorObject(400, 'Invalid Credentials!'));
    }

    // Whether Password matched:
    if (foundUser.password) {
      const isPasswordMatching = await bcryptjs.compare(req.body.password, foundUser.password);
      if (!isPasswordMatching) {
        return next(new ErrorObject(400, 'Invalid Credentials!'));
      }
    } else {
      return next(new ErrorObject(400, 'Invalid Credentials. Did you use oAuth instead?'));
    }

    // Create JWT:
    const token = sign({ _id: foundUser._id }, KEYS.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

    // Send JWT body:
    res.status(200).send({
      success: 'true',
      message: 'Successfully logged in!',
      data: {
        jwt: token,
        userId: foundUser._id,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        email: foundUser.email
      }
    });
  } catch (e: any) {
    console.log('Error in Login: ', e);
    return next(new ErrorObject(500, `Something went wrong during Login! ${e}`));
  }
}

// todo: token refresh when expired: Redirect to login or refresh token?
export async function user(req: Request, res: Response, next: NextFunction) {
  try {
    const userFound = await UserModel.findOne({_id: req.userData?._id});
    if (!userFound) {
      return next(new ErrorObject(400, 'Unauthenticated! Please register!'));
    }
    const { password, ...restUserDataWithoutPassword } = userFound.toJSON();

    return res.status(200).send({
      success: 'true', message: 'Successfully opened user!', data: {
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email
      }
    });
  } catch (e) {
    next(new ErrorObject(500, 'Something wrong happened while getting user.'));
  }
}