const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(404);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        next();
    });
}

module.exports = authenticationToken;