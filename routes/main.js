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
const searchRouter = require('./search');
function route(app) {
   app.use('/', homeRouter);
   app.use('/search', searchRouter);

   app.use('/login', authRouter);
   app.use('/register', registerRouter);
   app.use('/logout', logOutRouter);

   app.use('/profile', profileRouter);

   app.use('/dashboard', adminRouter);

   app.use('/detail', apartmentRouter);
   app.use('/comment', commentRouter);
   app.use('/analysis', analysisRouter);

   app.use('/favorite', favoriteRouter);
}

module.exports = route;
