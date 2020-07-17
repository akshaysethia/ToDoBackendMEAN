const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');

router.post('/register', (req, res) => {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username
    });

    User.findOne({ username: user.username })
        .then((found) => {
            if (found) {
                res.json({ success: false, message: 'User already exists !' });
            } else {
                bcrypt.genSalt(10)
                    .then((salt) => {
                        bcrypt.hash(req.body.password, salt)
                            .then((hash) => {
                                user.password = hash;
                                User.create(user)
                                    .then((newuser) => {
                                        if (newuser) {
                                            res.json({ success: true, message: 'User created Successfully !' });
                                        } else {
                                            res.json({ success: false, message: 'User could not be created !' });
                                        }
                                    })
                                    .catch((err) => console.log('An Error Occured !', err));
                            })
                            .catch((err) => console.log('An Error Occured !', err));
                    })
                    .catch((err) => console.log('An Error Occured !', err));
            }
        })
        .catch((err) => console.log('An Error Occured !', err));
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('An Error Occured !', err);
        } else if (user == null) {
            res.json({ success: false, message: 'No User with such Username !' });
        } else {
            bcrypt.compare(password, user.password)
                .then((retuser) => {
                    if (!retuser) {
                        res.json({ success: false, message: 'Incorrect Password !' });
                    } else {
                        const siuser = { _id: user._id, username: user.username }
                        const token = jwt.sign(siuser, process.env.SECRET, {
                            expiresIn: 36000000
                        });
                        res.json({
                            success: true,
                            message: 'User Login Successful',
                            token: 'JWT ' + token,
                            user: {
                                name: user.name,
                                username: user.username,
                                email: user.email
                            }
                        });
                    }
                })
                .catch((err) => console.log('An Error Occured !', err));
        }
    });
});

router.get('/checkToken', (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            console.log('An Error Occured !', err);
        } else if (!user) {
            res.json({ success: false, message: 'Invalid JWT', user: false });
        } else {
            res.json({ success: true, message: 'Valid JWT !', user: { name: user.name, username: user.username, email: user.email } });
        }
    })(req, res);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: {
            name: req.user.name,
            username: req.user.username,
            email: req.user.email
        }
    });
});

module.exports = router;