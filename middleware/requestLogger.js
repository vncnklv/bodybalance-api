const requestLogger = (req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.originalUrl}, Time: ${new Date()}`);
    next();
};

module.exports = requestLogger;
