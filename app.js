'use strict';

// Variables and libraries
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./movie.json');
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  // api token 
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }
  // move to the next middleware
  next();
});


// Endpoints
app.get('/movie', (req, res) => {
  const {genreQuery, countryQuery, avg_voteQuery} = req.query;
  let results = MOVIEDEX;

  if(genreQuery){
    results = results.filter(movieGenre => 
      movieGenre.genre.toLowerCase().includes(genreQuery.toLowerCase()));
  }

  if(countryQuery){
    results = results.filter(movieCountry => 
      movieCountry.country.toLowerCase().includes(countryQuery.toLowerCase()));
  }
  if(avg_voteQuery){
    results = results.filter(movieVote => 
      movieVote.avg_vote >= avg_voteQuery
    );}


  res.json(results);
});


module.exports = app;




