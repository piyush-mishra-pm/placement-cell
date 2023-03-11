import * as KEYS from './config/envKeys';

import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { configureRouter } from './api/v1/routes';
import ErrorObject from './utils/ErrorObject';
import * as UserModel from './models/UserModel';
import morgan from 'morgan';

mongoose
  .connect(KEYS.MONGO_DB_URL || 'mongodb://localhost:27017/auth_node_react')
  .then(() => console.log('Connected to db'))
  .catch(() => console.log('Error connecting to DB'));

const app = express();

app.use(morgan('combined'));

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// CORS relevant:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, PUT, PATCH, DELETE, OPTIONS');
  
  // Preflight response OK.
  // When browser creates an OPTIONS request just before making actual non-GET requests ()like POST, PATCH, DELETE).
  if(req.method==='OPTIONS'){
    return res.status(200).end();
  }
  next();
});

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
