module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.originalUrl = req.originalUrl;
        req.flash('error', 'You must be signed in to do this!');
        return res.redirect('/user/login');
    }
    next();
}