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
const coinPriceUtil = require('../utils/coin-price-util');
const dateUtil = require('../utils/date-util');


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


/*
* Get all token transfer transaction information with details
* @param {queryParam, contractTransactions} object of query parameters and all transaction array
* @returns {array} array of all transaction info regarding Celo Punks, Moo Punks, Celo Apes
*/
const getTransactionInfo = async (queryParam, contractTransactions) => {

    let allTransactionDetails = [];

    let currencyName;

    if (queryParam.currency === undefined || queryParam.currency === 'usd') {
        currencyName = 'USD';
    } else if(queryParam.currency === 'brl') {
        currencyName = 'BRL';
    } else{
        currencyName = 'EUR'
    }

    //Get All Crypto Coin List Details From Coin Gecko
    let coinApiUrl = process.env.COIN_GECKO_API_URL + `/coins/list`

    let config = {
        method: 'get',
        url: coinApiUrl
    };
    let [coinDetails, coinDetailsErr] = await promiseUtil.handle(axios(config));
    if (coinDetailsErr || coinDetails.data === undefined || coinDetails.data === null) {
        coinDetails.data = [] //If could not fetch information from coingecko api default value needs to be used
    }

    //Get Coin Exchange rate coin exchange open api
    let coinExchangeConfig = {
        method: 'get',
        url: process.env.COIN_EXCHANGE_RATE_API_URL
    };

    let fromRate, toRate;
    let [coinExchangeInfo, coinExchangeInfoErr] = await promiseUtil.handle(axios(coinExchangeConfig));

    // If could not fetech coin exchange rate from open api use Default value
    if (coinExchangeInfoErr || coinExchangeInfo.data === undefined || coinExchangeInfo.data === null) {
        if(currencyName === 'USD') {
            fromRate = process.env.Default_USD_RATE
            toRate = process.env.Default_USD_RATE
        } else if(currencyName === 'BRL'){
            fromRate = process.env.Default_USD_RATE
            toRate = process.env.Default_USD_TO_BRL_RATE
        } else{
            fromRate = process.env.Default_USD_RATE
            toRate = process.env.Default_USD_TO_EURO_RATE
        }
    }else{
        fromRate = coinExchangeInfo.data.rates['USD'];
        toRate = coinExchangeInfo.data.rates[currencyName];
    }


    let visitedHash = [];

    for (let index = 0; index < contractTransactions.length; index++) {

        let tokenName = contractTransactions[index].tokenName;
        if (tokenName !== null && tokenName !== undefined) {
            tokenName = tokenName.replace(/\s/g, '');
            tokenName = tokenName.toLowerCase();
            if (tokenName.indexOf('celopunks') !== -1) {
                let currentHash = contractTransactions[index].hash;

                if (index != contractTransactions.length - 1 && visitedHash.indexOf(currentHash) === -1) {
                    for (let value = index + 1; value < contractTransactions.length; value++) {
                        if (currentHash === contractTransactions[value].hash) {
                            if (contractTransactions[value].value !== undefined && contractTransactions[value].value !== null) {
                                let tokenAmount = contractTransactions[value].value;
                                if (contractTransactions[value].tokenDecimal !== undefined && contractTransactions[value].tokenDecimal !== null) {
                                    tokenAmount = contractTransactions[value].value / Math.pow(10, contractTransactions[value].tokenDecimal);
                                }
                                let dateValue = dateUtil.convertTimestampToDate(contractTransactions[value].timeStamp);

                                //Set Default currencyId if id not found in the coingecko coin details
                                let currencyId = 'celo';

                                //Get Market value of the token
                                let requiredCoinDetail = coinDetails.data.find(val => val.name === contractTransactions[value].tokenName)
                               
                                if (requiredCoinDetail !== undefined && requiredCoinDetail !== null) {
                                    currencyId = requiredCoinDetail.id;
                                }
                                
                                let [marketValue, marketValueErr] = await promiseUtil.handle(coinPriceUtil.convertTokenToCurrency(currencyName, tokenAmount, currencyId, fromRate, toRate));
                                if (marketValueErr) {
                                    log.error(marketValueErr.message)
                                    throw new Error(marketValueErr.message);
                                }

                                let finalDetailValue = {
                                    "nftName": 'Celo Punks',
                                    "tokenName": contractTransactions[value].tokenName,
                                    "tokenTransferred": contractTransactions[value].tokenSymbol,
                                    "amount": tokenAmount,
                                    "marketValue": marketValue,
                                    "date": dateValue
                                }

                                allTransactionDetails.push(finalDetailValue);
                                visitedHash.push(currentHash);
                            }
                        }
                    }
                }

            } else if (tokenName.indexOf('moopunks') !== -1) {
                let currentHash = contractTransactions[index].hash;

                if (index != contractTransactions.length - 1 && visitedHash.indexOf(currentHash) === -1) {
                    for (let value = index + 1; value < contractTransactions.length; value++) {
                        if (currentHash === contractTransactions[value].hash) {
                            if (contractTransactions[value].value !== undefined && contractTransactions[value].value !== null) {
                                let tokenAmount = contractTransactions[value].value;
                                if (contractTransactions[value].tokenDecimal !== undefined && contractTransactions[value].tokenDecimal !== null) {
                                    tokenAmount = contractTransactions[value].value / Math.pow(10, contractTransactions[value].tokenDecimal);
                                }
                                let dateValue = dateUtil.convertTimestampToDate(contractTransactions[value].timeStamp);

                                //Set Default currencyId if id not found in the coingecko coin details
                                let currencyId = 'celo';

                                //Get Market value of the token
                                let requiredCoinDetail = coinDetails.data.find(val => val.name === contractTransactions[value].tokenName)
                                if (requiredCoinDetail !== undefined && requiredCoinDetail !== null) {
                                    currencyId = requiredCoinDetail.id;
                                }
                                let [marketValue, marketValueErr] = await promiseUtil.handle(coinPriceUtil.convertTokenToCurrency(currencyName, tokenAmount, currencyId, fromRate, toRate));
                                if (marketValueErr) {
                                    log.error(marketValueErr.message)
                                    throw new Error(marketValueErr.message);
                                }

                                let finalDetailValue = {
                                    "nftName": 'Moo Punks',
                                    "tokenName": contractTransactions[value].tokenName,
                                    "tokenTransferred": contractTransactions[value].tokenSymbol,
                                    "amount": tokenAmount,
                                    "marketValue": marketValue,
                                    "date": dateValue
                                }

                                allTransactionDetails.push(finalDetailValue);
                                visitedHash.push(currentHash);
                            }
                        }
                    }
                }

            } else if (tokenName.indexOf('celoapes') !== -1) {
                let currentHash = contractTransactions[index].hash;

                if (index != contractTransactions.length - 1 && visitedHash.indexOf(currentHash) === -1) {
                    for (let value = index + 1; value < contractTransactions.length; value++) {
                        if (currentHash === contractTransactions[value].hash) {
                            if (contractTransactions[value].value !== undefined && contractTransactions[value].value !== null) {
                                let tokenAmount = contractTransactions[value].value;
                                if (contractTransactions[value].tokenDecimal !== undefined && contractTransactions[value].tokenDecimal !== null) {
                                    tokenAmount = contractTransactions[value].value / Math.pow(10, contractTransactions[value].tokenDecimal);
                                }
                                let dateValue = dateUtil.convertTimestampToDate(contractTransactions[value].timeStamp);

                                //Set Default currencyId if id not found in the coingecko coin details
                                let currencyId = 'celo';

                                //Get Market value of the token
                                let requiredCoinDetail = coinDetails.data.find(val => val.name === contractTransactions[value].tokenName)
                                
                                if (requiredCoinDetail !== undefined && requiredCoinDetail !== null) {
                                    currencyId = requiredCoinDetail.id;
                                }
                                let [marketValue, marketValueErr] = await promiseUtil.handle(coinPriceUtil.convertTokenToCurrency(currencyName, tokenAmount, currencyId, fromRate, toRate));
                                if (marketValueErr) {
                                    log.error(marketValueErr.message)
                                    throw new Error(marketValueErr.message);
                                }

                                let finalDetailValue = {
                                    "nftName": 'Celo Apes',
                                    "tokenName": contractTransactions[value].tokenName,
                                    "tokenTransferred": contractTransactions[value].tokenSymbol,
                                    "amount": tokenAmount,
                                    "marketValue": marketValue,
                                    "date": dateValue
                                }

                                allTransactionDetails.push(finalDetailValue);
                                visitedHash.push(currentHash);
                            }
                        }
                    }
                }

            }
        }
    }
    return allTransactionDetails;

}


module.exports = {
    getAllTransaction,
    getTransactionInfo
}