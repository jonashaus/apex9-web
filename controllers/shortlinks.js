const express = require('express');
const Shortlink = require('../models/shortlink/shortlink');
const ShortlinkAccess = require('../models/shortlink/shortlinkaccess');
const requestInfo = require('request-info');
const geoIP = require('geoip-lite');
const ExpressError = require('../utils/ExpressError');

//#region Website
module.exports.index = async (req, res, next) => {
    if (!req.app.locals.currentUser) {
        req.flash('warning', 'You are not logged in! Your Tracking Link will be the only way to access your shortlink analytics.');
        res.redirect('/s/create');
    } else {
        const shortlinks = await Shortlink.find({ owner: req.app.locals.currentUser });
        res.render('shortlink/shortlinks', { shortlinks });
    }
}

module.exports.trackShortlink = async (req, res) => {
    const { id } = req.params;
    const shortlink = await Shortlink.findById(id).populate({ path: 'owner' });
    if (!shortlink) {
        const redirectUrl = req.session.originalUrl || '/';
        delete req.session.originalUrl;
        req.flash('error', `We couldn't find that shortlink , sorry :(`);
        return res.redirect(redirectUrl);
    }
    const accesses = await ShortlinkAccess.find({ shortlink: shortlink.id });
    res.render('shortlink/track', { shortlink, accesses });
}

module.exports.renderCreateForm = (req, res, next) => {
    res.render('shortlink/create');
}

module.exports.createShortlink = async (req, res, next) => {
    const { description, name, destinationURL } = req.body;
    const newURL = req.protocol + '://' + req.get('host') + "/s/@" + encodeURI(name.replace(/ /g, '_'));
    const newShortlink = await new Shortlink({ name, newURL, description, destinationURL, owner: req.app.locals.currentUser }).save();
    req.flash('success', 'Shortlink created!');
    res.redirect(`/s/track/${newShortlink.id}`);
}

module.exports.deleteShortlink = async (req, res, next) => {
    const { id } = req.params;
    const shortlink = await Shortlink.findByIdAndDelete(id);
    if (!shortlink) {
        const redirectUrl = req.session.originalUrl || '/';
        delete req.session.originalUrl;
        req.flash('error', `We couldn't find that shortlink , sorry :(`);
        return res.redirect(redirectUrl);
    }
    res.redirect('/s');
}

module.exports.launchShortlink = async (req, res, next) => {
    const { name } = req.params;
    const shortlink = await Shortlink.findOne({ name });
    if (!shortlink) {
        req.flash('error', `This shortlink doesn't exist, sorry :(`);
        return res.redirect('/');
    } else {
        const reqInfo = requestInfo(req);
        if (process.env.NODE_ENV !== "production") {
            reqInfo.ip = '86.102.164.101';
        } else {
            reqInfo.ip = req.header('x-forwarded-for');
        }
        const geodata = geoIP.lookup(reqInfo.ip);
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
}
//#endregion

//#region API
module.exports.checkShortlinkDuplication = async (req, res, next) => {
    const { name, newURL } = req.body;
    const foundShortlinkName = await Shortlink.findOne({ name });
    const foundShortlinkNewURL = await Shortlink.findOne({ newURL });
    if (!foundShortlinkName && !foundShortlinkNewURL) {
        res.send({ duplicate: false });
    } else {
        res.send({ duplicate: true });
    }
}
//#endregion