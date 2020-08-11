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

    // console.log('center', center);

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
    };

    return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?${querystring.stringify(params)}`)
      .then(response => {
        res.json(response.data.results);
      })
      .catch((error) => {
        res.json({error: error.message});
      });
  });

module.exports = PlacesRouter;