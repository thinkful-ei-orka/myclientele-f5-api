const uuid = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3();
const express = require('express');
const s3Router = express.Router();

s3Router.get('/', (req, res) => {
  const directory = 'myclientele-user-uploads';
  const bucket = 'myclientele';

  const key = `${directory}/${uuid.v4()}`;
  return s3
    .getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: 'image/*',
      Expires: 300,
    })
    .then((uploadUrl) => res.json({ url: uploadUrl }));
});

module.exports = s3Router;
