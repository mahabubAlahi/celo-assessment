/**
 * Initialise log4js first, so we don't miss any log messages
 */
 const LogService = require('./services/log-service');
 let log = LogService.createLogger("startup");
 const bodyParser = require('body-parser');
 const express = require('express');
 const helmet = require('helmet');
 const http = require('http');
 const cors = require('cors');
 const { isCelebrate } = require('celebrate');

 // Routes

 const tokenRoutes = require('./routes/token.routes');
 
 
 /**
  * server configuration
  */
 const config = require('./config');
 
 
 /**
  * app instance initialization.
  */
 const app = express();

 /**
 * Middleware registration.
 */
 
 // allow cross origin requests
 app.use(cors());

 // secure express app
 app.use(helmet({
   dnsPrefetchControl: false,
   frameguard: false,
   ieNoOpen: false,
 }));
 
 // parsing the request bodys
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use(LogService.expressLogger());
 
 // Routes registration
 app.use('/api', tokenRoutes);
 


 /**
 * 404 handler.
 */

app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
  });

/**
 * Error handler registration.
 */

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = isCelebrate(err) ? 400 : err.status || 500;
    const message =
      config.app.env === 'production' && err.status === 500 ? 'Something Went Wrong!' : err.message;
  
    // eslint-disable-next-line no-console
    if (status === 500) console.log(err.stack);
  
    res.status(status).json({
      status: status >= 500 ? 'error' : 'fail',
      message,
    });
  });


/**
 * Create HTTP server.
 */
 
 const { port } = config.app;
 const server = http.Server(app);
 server.listen(port, () => {
   log.info("Connected to port: " + port);
 });


 /**
 * Set up log directory
 */
 
 try {
   require('fs').mkdirSync('./log');
 } catch (e) {
   if (e.code != 'EEXIST') {
     log.error("Could not set up log directory, error was: ", e);
     process.exit(1);
   }
 }