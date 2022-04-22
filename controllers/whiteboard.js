const express = require('express');

//#region Website
module.exports.index = async (req, res, next) => {
    res.render('whiteboard/whiteboard');
}
//#endregion

//#region API
//#endregion