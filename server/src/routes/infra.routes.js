const express = require('express');
const { createTheatre, createScreen, getTheatres } = require('../controllers/infra.controller');
const router = express.Router();

router.post('/theatres', createTheatre);
router.get('/theatres', getTheatres);
router.post('/screens', createScreen);

module.exports = router;
