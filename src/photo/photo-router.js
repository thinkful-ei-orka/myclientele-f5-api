const path = require('path');
const express = require('express');
const ReportService = require('../report/report-service');
const { requireAuth } = require('../middleware/jwt-auth');
const ClientsService = require('../client/client-service');
const { query } = require('express');
const PhotoService = require('./photo-service');
const photoRouter = express.Router();
const jsonParser = express.json();


photoRouter
    .route('/:report_id')
    .all(requireAuth)
    .get(async (req, res, next) => {
        console.log('report id', req.params.report_id);
    })