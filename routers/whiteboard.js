const express = require('express');
const router = express.Router();
const whiteboard = require('../controllers/whiteboard');
const wrapAsync = require('../utils/wrapAsync');

//#region Website Routes
router.get('/', wrapAsync(whiteboard.index));
//#endregion

//#region API Routes
//#endregion

module.exports = router;