//Create Logger
const LogService = require("../services/log-service");
let log = LogService.createLogger("token");



const celoTransactionInformation = async (req, res, next) => {

    return res.status(200).json({
        message: 'CeloTransactionInformation',
        result: null,
        status: 1
    })
    
}



module.exports = {
    celoTransactionInformation
};