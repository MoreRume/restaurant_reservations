const methodNotAllowed = (req, res, next) =>{
    next({
        status: 405,
        messsage: `${req.method} not allowed for ${req.originalUrl}`,
    });
};

module.exports = methodNotAllowed;