const express = require('express');
const { createShow, getShowById } = require('../controllers/show.controller');
const router = express.Router();

router.post('/', createShow);
router.get('/:id', getShowById);

module.exports = router;
