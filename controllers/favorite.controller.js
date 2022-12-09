const apartmentModel = require('../models/apartment.model');
const favoriteModel = require('../models/favorite.model');
const userModel = require('../models/user.model');

const favoriteList = {
   getFavoritePage: async (req, res) => {
      try {
         let userId;
         const user = req.cookies.user;
         if (user) {
            userId = req.cookies.user.user_id;
         }

         const listApartmentId = await favoriteModel.find({ userId: userId });
         const listFavorite = [];
         for (let i = 0; i < listApartmentId.length; i++) {
            const myFavorite = await apartmentModel.findOne({ _id: listApartmentId[i].apartmentId });
            if (myFavorite) {
               listFavorite.push(myFavorite);
            }
         }
         res.render('components/favoritelist', {
            title: 'Favorite List',
            listFavorite,
            user,
            alert: req.flash('success'),
            fail: req.flash('fail'),
         });
      } catch (e) {
         console.log(e);
      }
   },
   postFavorite: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const apartmentId = req.params;
         const like = await favoriteModel.findOne({ userId: userId, apartmentId: apartmentId.id });
         if (like) {
            req.flash('success', 'Bạn đã yêu thích rồi');
         } else {
            const body = {
               userId: userId,
               apartmentId: apartmentId.id,
            };
            const newFavorite = new favoriteModel(body);
            await newFavorite.save();
            await apartmentModel
               .updateOne(
                  { _id: apartmentId.id },
                  {
                     $push: {
                        listLike: {
                           $each: [{ userId: userId }],
                        },
                     },
                  },
               )

               .then(() => {
                  req.flash('success', 'Đã thêm vào danh sách yêu thích');
               });
         }
      } catch (error) {
         res.status(500).json(error);
         console.log(error);
      }
   },
   deleteFavorite: async (req, res) => {
      try {
         const apartmentId = req.params;
         await favoriteModel.deleteOne({ apartmentId: apartmentId.id }).then(() => {
            req.flash('success', 'Bạn đã xóa căn hộ yêu thích');
            res.redirect('/favorite');
         });
      } catch (error) {
         res.status(500).json({ 'message: ': error });
         console.log('error: ', error);
      }
   },
};

module.exports = favoriteList;
