//Create Logger
const LogService = require("../services/log-service");
let log = LogService.createLogger("token");

//Services
const celoService = require('../services/celo-service');

//utils
const promiseUtil = require('../utils/promise-handle-util');



const celoTransactionInformation = async (req, res, next) => {

    const queryParms = req.query;
    const validParams = ["address", "network", "currency"];
    const validNetworkValue = ["main", "alfajores"];
    const validCurrencyValue = ["usd", "brl", "euro"];
    const queryParmKeys = Object.keys(queryParms);

    if (queryParmKeys.length > 0) {
        queryParmKeys.forEach((key, index) => {
            if (validParams.indexOf(key) === -1) {
                return res.status(400).json({
                    message: "Invalid Params",
                    result: null,
                    status: 0
                });
            }
        })
        if (queryParms.address === undefined) {
            return res.status(400).json({
                message: "Query Parameter address is required.",
                result: null,
                status: 0
            });
        }

        if (queryParms.network !== undefined) {
            if (validNetworkValue.indexOf(queryParms.network) === -1) {
                return res.status(400).json({
                    message: "Invalid Params",
                    result: null,
                    status: 0
                });
            }
        }

        if (queryParms.currency !== undefined) {
            if (validCurrencyValue.indexOf(queryParms.currency) === -1) {
                return res.status(400).json({
                    message: "Invalid Params",
                    result: null,
                    status: 0
                });
            }
        }

        // Get all token transfer transaction regarding to the param address
        const [tokenTransactions, tokenTransactionserr] = await promiseUtil.handle(celoService.getAllTransaction(queryParms));
        if (tokenTransactionserr) {
            return res.status(500).json({
                message: tokenTransactionserr.message,
                result: null,
                status: 0
            })
        }
        if (tokenTransactions.status == 0) {
            return res.status(400).json(tokenTransactions);
        }

        let tokenTransactionDetails = [];

        // Get all token transfer transaction Details
        if (tokenTransactions.result.length > 0) {
            let [tokenTransactionInfo, tokenTransactionInfoErr] = await promiseUtil.handle(celoService.getTransactionInfo(queryParms, tokenTransactions.result));

            if (tokenTransactionInfoErr) {
                return res.status(500).json({
                    message: tokenTransactionInfoErr.message,
                    result: null,
                    status: 0
                })
            }

            if (tokenTransactionInfo.length > 0) {
                tokenTransactionDetails = tokenTransactionInfo;
            }

        }

        if(tokenTransactionDetails.length === 0){
            return res.status(200).json({
                message: 'No Transaction Information found from Celo Punks, Celo Apes, Moo Punks NFT for this address and network',
                result: {
                    "tokenTransactionInfo": tokenTransactionDetails
                },
                status: 1
            })
        }

        return res.status(200).json({
            message: 'Successfully fetch Information from Celo Punks, Celo Apes, Moo Punks NFT',
            result: {
                "tokenTransactionInfo": tokenTransactionDetails
            },
            status: 1
        })

    } else {

        return res.status(400).json({
            message: "At least query parameter address is required. (Optional param: network, currency)",
            result: null,
            status: 0
        });
    }
}


module.exports = {
    celoTransactionInformation
};