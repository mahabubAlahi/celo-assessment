/**
 * Interact with Celo Mainnet or Test net explorer api
 */
require("dotenv").config();

const axios = require('axios')

//Create Logger
const LogService = require("./log-service");
let log = LogService.createLogger("celo-service");

//utils
const promiseUtil = require('../utils/promise-handle-util');


/*
* Get all token transfer transaction corresponding to an address from Celo explorer API
* @param {queryParam} object of query parameters
* @returns {array} array of all transaction object
*/
const getAllTransaction = async (queryParam) => {
    let contractNetUrl;
    if (queryParam.network === 'main' || queryParam.network === undefined) {
        contractNetUrl = process.env.CELO_MAINNET_BASE_API_URL;
    } else {
        contractNetUrl = process.env.CELO_TESTNET_BASE_API_URL;
    }

    let apiUrl = contractNetUrl + `?module=account&action=tokentx&address=${queryParam.address}`

    let config = {
        method: 'get',
        url: apiUrl
    };

    let [resAllTransaction, resAllTransacrionErr] = await promiseUtil.handle(axios(config));
    if (resAllTransacrionErr) {
        log.error('fail to fetch all transaction');
        log.error(resAllTransacrionErr)
        throw new Error('Feteching all transaction failed');
    }

    return resAllTransaction.data;

}


module.exports = {
    getAllTransaction
}