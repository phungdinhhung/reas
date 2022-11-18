const registerRouter = require('./register');
const authRouter = require('./auth');
const homeRouter = require('./home');
const profileRouter = require('./profile');
const logOutRouter = require('./logOut');
const adminRouter = require('./admin');
const apartmentRouter = require('./apartment');
const favoriteRouter = require('./favoritelist');
const commentRouter = require('./comment');
const analysisRouter = require('./analysis');
function route(app) {
    app.use("/", homeRouter);
    app.use("/login", authRouter);
    app.use("/register", registerRouter);
    app.use("/profile", profileRouter);
    app.use("/logout", logOutRouter);
    app.use("/dashboard", adminRouter);
    app.use("/detail", apartmentRouter);
    app.use("/favorite", favoriteRouter);
    app.use("/comment", commentRouter);
    app.use("/analysis", analysisRouter);
}

module.exports = route;
