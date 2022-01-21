const express = require('express');
const testControllers = require('../controllers/test.controllers');
const router = express.Router();

router.get('/', testControllers.test);

module.exports = router