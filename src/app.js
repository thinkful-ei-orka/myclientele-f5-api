const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const userRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const clientRouter = require('./client/client-router');
const reportRouter = require('./report/report-router');
const companyRouter = require('./companies/companies-router');
const placesRouter = require('./places/places-router');
const photoRouter = require('./photo/photo-router');
const s3Router = require('./s3/s3-router');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3();

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/api/companies', companyRouter);
app.use('/api/reports', reportRouter);
app.use('/api/places', placesRouter);
app.use('/api/photos', photoRouter);

app.use('/api/presignedurl', s3Router);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'server error' };
  } else {
    console.error(error);
    response = { error: error.message, details: error };
  }
  res.status(500).json(response);
});

module.exports = app;
