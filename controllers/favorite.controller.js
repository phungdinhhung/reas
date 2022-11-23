const ApartmentModel = require('../models/apartment.model');
const UserModel = require('../models/user.model');

const favoriteList = {
   getFavoritePage: async (req, res) => {
      try {
         let userId = req.cookies.user.user_id;
         const user = await UserModel.findById({ _id: userId });
         res.status(200).render('components/favoritelist', { title: 'Favorite List', user });
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = favoriteList;
