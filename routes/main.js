const registerRouter = require('./register');
const authRouter = require('./auth');
const homeRouter = require('./home');
const profileRouter = require('./profile');
const logOutRouter = require('./logOut');
const adminRouter = require('./admin');
const apartmentRouter = require('./apartment');
function route(app) {
    app.use("/", homeRouter);
    app.use("/login", authRouter);
    app.use("/register", registerRouter);
    app.use("/profile", profileRouter);
    app.use("/logout", logOutRouter);
    app.use("/dashboard", adminRouter);
    app.use("/detail", apartmentRouter);
}

module.exports = route;
