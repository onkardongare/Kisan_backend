const { User } = require('../models/userModel');
const crypto = require('crypto');
const { sanitizeUser } = require('../utils/common');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        // Check if user already exists
        console.log("something in createUser")
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists'});
        }

        // Generate salt and hash password
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                // Save the new user with hashed password and salt
                console.log('req.body',req.body)
                const user = new User({ ...req.body, password: hashedPassword.toString('hex'), salt });
                const doc = await user.save();

                // Create a JWT token after successfully creating the user
                const token = jwt.sign(sanitizeUser(doc), process.env.SECRET_KEY, { expiresIn: '1h' });

                // Send the JWT token back in the response
                res.status(201).json({
                    id: doc.id,
                    role: doc.role,
                    token,  // Send the JWT token
                });
            }
        );
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('something in login user')
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password
        const isPasswordValid = await crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256').toString('hex') === user.password;
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token after successful login
        const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY, { expiresIn: '1h' });

        // Send the JWT token in the response
        res.status(200).json({
            id: user.id,
            role: user.role,
            token,  // Send the JWT token to the client
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    // Since we're using JWT, we don't need to clear a session.
    // We just need to stop using the token on the client-side.
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.checkAuth = async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);  // Send back the user data if authenticated
    } else {
        res.status(401).json({ message: "Unauthorized" });  // Unauthorized if no user data
    }
};
