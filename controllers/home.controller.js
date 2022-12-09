const apartmentModel = require('../models/apartment.model');
const userModel = require('../models/user.model');
const favoriteModel = require('../models/favorite.model');
const homeController = {
   getHomePage: async (req, res) => {
      try {
         const user = req.cookies.user;
         let userId,
            textMessage,
            favorite = '';
         if (user) {
            userId = req.cookies.user.user_id;
            favorite = await favoriteModel.find({ userId: userId });
            textMessage = await userModel.findOne({ _id: userId });
         }
         const listRegion1 = await apartmentModel.find({
            region: 'Miền Bắc',
         });
         const listRegion2 = await apartmentModel.find({
            region: 'Miền Trung',
         });
         const listRegion3 = await apartmentModel.find({
            region: 'Miền Nam',
         });
         res.render('./components/index', {
            title: 'REAS',
            user,
            userId,
            textMessage,
            favorite,
            listRegion1,
            listRegion2,
            listRegion3,
            alert: req.flash('sucess'),
            fail: req.flash('fail'),
         });
      } catch (e) {
         console.log(e);
         res.status(500).json(e);
      }
   },
   getSearchPage: async (req, res) => {
      res.redirect('/search');
   },
};

module.exports = homeController;
