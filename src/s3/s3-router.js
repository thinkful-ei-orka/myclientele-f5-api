const uuid = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3();
const express = require('express');
const s3Router = express.Router();
const { bucket } = require('../config.js');

s3Router.get('/', (req, res) => {
  const { name, type } = req.query;
  return s3
    .getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: name,
      ContentType: type,
      Expires: 60,
    })
    .then((uploadUrl) => res.json({ url: uploadUrl }))
    .catch(error => res.json({error}));
});

module.exports = s3Router;
