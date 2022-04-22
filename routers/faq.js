const express = require('express');
const router = express.Router();
const faqs = require('../controllers/faqs');
const wrapAsync = require('../utils/wrapAsync');

//#region Website Routes
router.get('/', wrapAsync(faqs.index));
//#endregion

//#region API Routes
//#endregion

module.exports = router;