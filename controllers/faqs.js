const express = require('express');

//#region Website
module.exports.index = async (req, res, next) => {
    res.render('faq/faq');
}
//#endregion

//#region API
//#endregion