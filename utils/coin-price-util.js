
require("dotenv").config();

const axios = require('axios')

//Create Logger
const LogService = require("../services/log-service");
let log = LogService.createLogger("coin-price-util-service");

//utils
const promiseUtil = require('./promise-handle-util');

/*
* Convert tokenAmount value to specified Currency value
* @param {currencyName, tokenAmount, currencyId, fromRate, toRate} 
* @returns {convertedTokenAmount} Converted Token Amount Value to specified currency value
*/

const convertTokenToCurrency = async (currencyName, tokenAmount, currencyId, fromRate, toRate) => {

    // Get specified token value in USD from Coin Gecko open api
    let apiUrl = process.env.COIN_GECKO_API_URL + `/simple/price?ids=${currencyId}&vs_currencies=usd`

    let config = {
        method: 'get',
        url: apiUrl
    };

    let usdValue;
    let [priceInfo, priceInfoErr] = await promiseUtil.handle(axios(config));
    if (priceInfoErr || priceInfo.data === undefined || priceInfo.data === null) {
        usdValue = process.env.Default_COIN_PRICE_IN_USD // If could not fetch info from coingecko server use default value
    } else{
        usdValue = priceInfo.data[currencyId].usd
    }

    let tokenAmountInUsd =  usdValue * tokenAmount;

    if(currencyName == 'USD'){
        return tokenAmountInUsd; 
    } 
    
    let convertedTokenAmount = ((toRate / fromRate) * tokenAmountInUsd);

    return convertedTokenAmount;
}

module.exports = {
    convertTokenToCurrency
}