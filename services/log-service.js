let log4js = require("log4js");
log4js.configure("./config/log4js.json");

const expressLogger = () =>
    log4js.connectLogger(log4js.getLogger("http"), { level: "auto" });
const createLogger = (topic) => log4js.getLogger(topic);

module.exports = {
    expressLogger,
    createLogger,
};
