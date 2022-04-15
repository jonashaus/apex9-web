const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../utils/middleware');
const shortlinks = require('../controllers/shortlinks');
const wrapAsync = require('../utils/wrapAsync');

//#region Website Routes
router.get('/', wrapAsync(shortlinks.index));
router.get('/track/:id', wrapAsync(shortlinks.trackShortlink));
router.get('/create', shortlinks.renderCreateForm);
router.post('/create', wrapAsync(shortlinks.createShortlink));
router.get('/delete/:id', wrapAsync(shortlinks.deleteShortlink));
router.get('/@:name', wrapAsync(shortlinks.launchShortlink));

router.get('/terms', isLoggedIn, (req, res, next) => { res.render('shortlink/terms'); });
router.get('/privacy', isLoggedIn, (req, res, next) => { res.render('shortlink/privacy') });
//#endregion

//#region API Routes
router.post('/api/checkduplication', shortlinks.checkShortlinkDuplication);
//#endregion

module.exports = router;