const uuid = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3();
const express = require('express');
const s3Router = express.Router();

s3Router.get('/', (req, res) => {
  const { name, type } = req.query;
  const directory = 'myclientele-user-uploads';
  const bucket = 'f5-myclientele';

  const key = `${directory}/${uuid.v4()}`;
  return s3
    .getSignedUrlPromise('putObject', {
      Bucket: bucket,
      Key: name,
      ContentType: type,
      Expires: 30000,
    })
    .then((uploadUrl) => res.json({ url: uploadUrl, file_name: key }))
    .catch(error => res.json({error}));
});

module.exports = s3Router;
