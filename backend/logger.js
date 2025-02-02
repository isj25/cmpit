const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

// Define the logs directory path
const logsDir = path.join(__dirname, '../logs');

// Create the logs directory if it does not exist
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} [${level}]: ${message} ${metaString}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logsDir, 'combined.log') })
    ]
});

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new transports.Console({
//         format: format.combine(
//             format.colorize(),
//             format.printf(({ timestamp, level, message, ...meta }) => {
//                 const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
//                 return `${timestamp} [${level}]: ${message} ${metaString}`;
//             })
//         )
//     }));
// }

module.exports = logger;