const express = require('express');
const tokenControllers = require('../controllers/token.controllers');
const router = express.Router();

router.get('/celo-trans-info', tokenControllers.celoTransactionInformation);

module.exports = router