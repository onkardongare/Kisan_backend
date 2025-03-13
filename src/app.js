require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const connectDB = require("./config/db");

// routing objects
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const fieldRouter = require('./routes/fieldRoutes');
const newsRouter = require('./routes/newsRoutes');
const weatherRouter = require("./routes/weatherRoutes");

const { User } = require('./models/userModel');
const { isAuth, sanitizeUser } = require('./utils/common');
console.log("something")

//connection to databse
connectDB();

// express instance
const server = express();

// Configure Passport JWT Strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract token from Authorization header
    secretOrKey: process.env.SECRET_KEY,  // Secret key for verifying JWT
};

// Passport JWT strategy to authenticate the user
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user));  // Attach user to req.user
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.error('Error in JWT strategy:', err);
            return done(err, false);
        }
    })
);

// Middleware Setup
server.use(cookieParser());
server.use(
    cors({
        origin: "*",  // Allow all origins (or specify frontend URL)
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["X-Total-Count"],
    })
);
server.use(express.json());
server.use(passport.initialize());  // Initialize Passport

// auth middleware
const authMiddleware = () => passport.authenticate('jwt', { session: false });

// Routes
server.use('/auth', authRouter.router);  // Authentication Routes
server.use('/user', authMiddleware(), userRouter.router);  // Protect user routes
server.use('/field', fieldRouter); // field routes
server.use('/news', newsRouter); // farming related news
server.use('/weather', weatherRouter); // weather routes


module.exports = server;
