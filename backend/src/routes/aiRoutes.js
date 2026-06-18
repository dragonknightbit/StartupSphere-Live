const express = require('express');
const { evaluateIdea } = require('../controllers/aiController');

const router = express.Router();

router.post('/evaluate', evaluateIdea);

module.exports = router;