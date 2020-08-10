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
const axios = require('axios');
const querystring = require('querystring');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/api/companies', companyRouter);
app.use('/api/reports', reportRouter);

app.get('/api/places', (req, res) => {
    //return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${api_key}&input=${this.state.searchTerm}`)
    const {
        searchTerm,
        center,
        radius
    } = req.query;

    console.log(center);

    let api_key = 'AIzaSyALTeDJY0y4Ui6Q8wtOE0hZooVKsPTapt0';
    const params = {
        key: api_key,
        query : searchTerm,
        //fields: 'name,formatted_address,geometry,opening_hours',
        // location: center,
        location: center,
        // radius: 5000,
        // radius: radius >= 50000 ? 50000 : radius
        rankby: 'distance'
    }

    return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?${querystring.stringify(params)}`)
    .then(response => {
        res.json(response.data.results)
    })
    .catch((error) => {
        res.json({error: error.message})
    })
})

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
