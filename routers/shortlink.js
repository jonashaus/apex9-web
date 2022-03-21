const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Shortlink = require('../models/shortlink/shortlink');
const ShortlinkAccess = require('../models/shortlink/shortlinkaccess');
const { isLoggedIn } = require('../utils/middleware');
const wrapAsync = require('../utils/wrapAsync');
const { userSchema } = require('../schemas');
const requestInfo = require('request-info');
const geoIP = require('geoip-lite');
const ExpressError = require('../utils/ExpressError');

router.get('/', isLoggedIn, wrapAsync(async (req, res, next) => {
    const shortlinks = await Shortlink.find({});
    res.render('shortlink/shortlinks', { shortlinks });
}))

router.get('/track/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const shortlink = await Shortlink.findById(id);
        if (!shortlink) {
            const redirectUrl = req.session.originalUrl || '/';
            delete req.session.originalUrl;
            req.flash('error', `We couldn't find that shortlink , sorry :(`);
            return res.redirect(redirectUrl);
        }
        const owner = await User.findById(shortlink.owner);
        const accesses = await ShortlinkAccess.find({ shortlink: shortlink.id })
        res.render('shortlink/track', { shortlink, owner, accesses });
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('shortlink/create');
})

router.post('/create', wrapAsync(async (req, res, next) => {
    try {
        const { description, name, destinationURL } = req.body;
        const newURL = req.protocol + '://' + req.get('host') + "/s/@" + encodeURI(name.replace(/ /g, '_'));
        const newShortlink = await new Shortlink({ name, newURL, description, destinationURL, owner: req.app.locals.currentUser }).save();
        req.flash('success', 'Shortlink created!');
        res.redirect(`/s/track/${newShortlink.id}`);
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

router.get('/delete/:id', wrapAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const shortlink = await Shortlink.findByIdAndDelete(id);
        if (!shortlink) {
            const redirectUrl = req.session.originalUrl || '/';
            delete req.session.originalUrl;
            req.flash('error', `We couldn't find that shortlink , sorry :(`);
            return res.redirect(redirectUrl);
        }
        res.redirect('/s');
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

router.get('/terms', isLoggedIn, (req, res, next) => {
    res.render('shortlink/terms');
})

router.get('/privacy', isLoggedIn, (req, res, next) => {
    res.render('shortlink/privacy');
})

router.get('/@:name', wrapAsync(async (req, res, next) => {
    try {
        const { name } = req.params;
        const shortlink = await Shortlink.findOne({ name });
        if (!shortlink) {
            req.flash('error', `This shortlink doesn't exist, sorry :(`);
            return res.redirect('/');
        } else {
            const reqInfo = requestInfo(req);
            reqInfo.ip = '87.102.164.101'; //REMOVE LATER
            if (process.env.NODE_ENV !== "production") {
                reqInfo.ip = '87.102.164.101';
            }
            if (reqInfo.ip.substr(0, 7) == "::ffff:") {
                reqInfo.ip = reqInfo.ip.substr(7)
            }
            const geodata = geoIP.lookup(reqInfo.ip);
            console.log('forwarded-for: ' + req.header('x-forwarded-for'));
            console.log('socket remote: ' + req.socket.remoteAccess);
            console.log('connect remote:' + req.connection.remoteAddress);
            console.log('req.ip:        ' + req.ip);
            console.log('req.ips:       ' + req.ips);
            console.log('--------------------------------')
            console.log(reqInfo);
            console.log(geodata);
            shortlinkaccess = await new ShortlinkAccess({
                shortlink: shortlink,
                timestamp: new Date(),
                ip: reqInfo.ip,
                location: geodata.city + " (" + geodata.country + ")",
                device: reqInfo.ua.device.model,
                browser: reqInfo.ua.browser.name,
                coordinates: geodata.ll
            }).save();
            res.redirect(shortlink.destinationURL);
        }
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}))

module.exports = router;