const winston = require('winston');
const {combine, timestamp, label, json} = winston.format;
environment = process.env.ENVIRONMENT
const customFormat = json(({level, message, httpRequest, label, })=>{
    return{
        level, httpRequest, message, label,  //Reference from: https://cloud.google.com/logging/docs/structured-logging
    }
})
const logger = winston.createLogger({
  //level: 'info',
  format: combine(
    timestamp({ utc: true }),
    customFormat
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    //new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //new winston.transports.File({ filename: 'combined.log' }),
    // new winston.transports.File({ filename: '/var/log/webapp/combined.log' })
    environment !== "PROD" ? new winston.transports.File({ filename: 'combined.log'}) :
    new winston.transports.File({ filename: '/var/log/webapp/combined.log' }) 
    ,
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (environment !== 'PROD') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
module.exports = {logger}