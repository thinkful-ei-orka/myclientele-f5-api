require("dotenv").config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const PlacesRouter = express.Router();


PlacesRouter
  .get('/', (req, res) => {
    const {
      searchTerm,
      center,
      radius
    } = req.query;


    let api_key = process.env.PLACES_API_KEY;
    const params = {
      key: api_key,
      query : searchTerm,
      //fields: 'name,formatted_address,geometry,opening_hours',
      // location: center,
      location: center,
      // radius: 5000,
      // radius: radius >= 50000 ? 50000 : radius
      rankby: 'distance'
    };

    return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?${querystring.stringify(params)}`)
      .then(response => {
        res.json(response.data.results);
      })
      .catch((error) => {
        res.json({error: error.message});
      });
  })
  .get('/photo_reference', (req, res) => {
    const {
      photo_reference,
      max_width,
    } = req.query;


    let api_key = process.env.PLACES_API_KEY;
    const params = {
      key: api_key,
      photoreference : photo_reference,
      maxwidth: max_width,
    };

    return axios.get(`https://maps.googleapis.com/maps/api/place/photo?${querystring.stringify(params)}`)
      .then(response => {
        // this gets the image url
        res.json(response.request.res.responseUrl);
      })
      .catch((error) => {
        res.json({error: error.message});
      });
  });

module.exports = PlacesRouter;
