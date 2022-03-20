const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const { isLoggedIn } = require('../../utils/middleware');
const wrapAsync = require('../../utils/wrapAsync');
const { userSchema } = require('../../schemas');
const ExpressError = require('../../utils/ExpressError');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

const mapIdentifierToUsername = wrapAsync(async (req, res, next) => {
    const { identifier } = req.body;
    const user = await User.findOne({ email: identifier });
    if (user) {
        req.body.username = user.username;
    } else {
        req.body.username = identifier;
    }
    next();
})

router.get('/register', (req, res, next) => {
    if (!req.app.locals.currentUser) {
        res.render('user/register');
    } else {
        req.flash('success', 'You are already logged in!');
        res.redirect('/');
    }
})
router.post('/register', validateUser, wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to apex9!');
            res.redirect(`/user/@${registeredUser.username}`);
        })
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

router.get('/login', (req, res, next) => {
    if (!req.app.locals.currentUser) {
        res.render('user/login');
    } else {
        req.flash('success', 'You are already logged in!');
        res.redirect('/');
    }
})

router.post('/login', mapIdentifierToUsername, passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), wrapAsync(async (req, res, next) => {
    try {
        const redirectUrl = req.session.originalUrl || '/';
        delete req.session.originalUrl;
        req.flash('success', 'Welcome back!');
        res.redirect(redirectUrl);
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
})

router.get('/@:username', isLoggedIn, wrapAsync(async (req, res, next) => {
    const { username } = req.params;
    const user = await User.findOne({ username: username });
    if (!user) {
        const redirectUrl = req.session.originalUrl || '/';
        delete req.session.originalUrl;
        req.flash('error', `We couldn't find the user @${username} , sorry :(`);
        return res.redirect(redirectUrl);
    }
    res.render('user/display', { user });
}))

module.exports = router;