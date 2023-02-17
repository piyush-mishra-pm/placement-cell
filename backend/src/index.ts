import * as KEYS from './config/envKeys';

import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { configureRouter } from './api/v1/routes';
import ErrorObject from './utils/ErrorObject';
import passport from 'passport';
import * as UserModel from './models/UserModel';

import oAuthRouter from './api/v1/oAuthRoutes';

mongoose
  .connect(KEYS.MONGO_DB_URL || 'mongodb://localhost:27017/auth_node_react')
  .then(() => console.log('Connected to db'))
  .catch(() => console.log('Error connecting to DB'));

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

const domainsFromEnv = KEYS.FE_ORIGIN || ""

const whitelist = domainsFromEnv.split(",").map(item => item.trim())

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Access-Control-Allow-Origin', 'Authorization', 'Content-Type'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}
app.options('*', cors(corsOptions));

app.use(cors(corsOptions))

import './services/passport';
app.use(passport.initialize());
app.use('/api/v1', oAuthRouter);

configureRouter(app);

// Default Error Handler:
app.use((error: ErrorObject, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.statusCode || 500);
  res.send({ success: 'false', message: error.message || 'Something wrong happened!', data: error.data });
});

// Path Not found:
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404)
  res.send('invalid path')
});

app.listen(KEYS.PORT || 8000, () => {
  console.log('listeing on port 8000');
});
