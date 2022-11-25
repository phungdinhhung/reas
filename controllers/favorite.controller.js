const apartmentModel = require('../models/apartment.model');
const favoriteModel = require('../models/favorite.model');
const UserModel = require('../models/user.model');

const favoriteList = {
   getFavoritePage: async (req, res) => {
      try {
         let userId = '';
         if (req.cookies.user) {
            userId = req.cookies.user.user_id;
         }

         console.log(userId);
         const listApartmentId = await favoriteModel.find({ userId: userId });
         const listFavorite = [];
         for (let i = 0; i < listApartmentId.length; i++) {
            const myFavorite = await apartmentModel.findOne({ _id: listApartmentId[i].ApartmentId });
            if (myFavorite) {
               listFavorite.push(myFavorite);
            }
         }
         res.render('components/favoritelist', { title: 'Favorite List', listFavorite });
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = favoriteList;
