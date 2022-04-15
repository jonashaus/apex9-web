const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../utils/middleware');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/', wrapAsync(async (req, res, next) => {
    if (!req.app.locals.currentUser) {
        res.render('life/intro');
    } else {
        res.redirect('/life/dashboard')
    }
}))

module.exports = router;