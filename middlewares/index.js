let jwt = require('jsonwebtoken');

module.exports = {
    'authentictionMiddleware': (req, res, next) => {
        jwt.verify(req.headers.authorization, 'secretstring', (err, success) => {
            if(err) return res.status(401).json({message: 'Unautenticated'});
            res.locals.user = success;
            next();
        })

    },
    'authrisationMiddleware': (userTypes) => (req, res, next) => {
        if(res.locals.user && userTypes.indexOf(res.locals.user.userType) != -1)
        next();
        else
        return res.status(401).json({message: 'Unautherised'});
    }
}