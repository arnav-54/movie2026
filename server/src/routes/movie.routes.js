const express = require('express');
const { getMovies, getMovieById, createMovie } = require('../controllers/movie.controller');
const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);

module.exports = router;
