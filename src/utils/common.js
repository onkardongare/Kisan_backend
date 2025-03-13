const passport = require('passport');

// Middleware to authenticate the user based on JWT
exports.isAuth = (req, res, next) => {
    // Passport JWT authentication middleware
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error', error: err });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;  // Attach the user object to the request
        return next();  // Proceed to the next middleware or route handler
    })(req, res, next);  // Pass the request to passport.authenticate
};

// Function to sanitize the user object (remove sensitive data)
exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role };  // Adjusted to match the structure of your user object
};

// Function to extract JWT token from the request's cookies
exports.cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];  // Token is expected to be stored in cookies
    }
    return token;
};
