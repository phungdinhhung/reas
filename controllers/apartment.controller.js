const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const commentModel = require('../models/comment.model');
const apartmentModel = require('../models/apartment.model');
const contactModel = require('../models/contact.model');
const favoriteModel = require('../models/favorite.model');
const apartmentController = {
   renderApartmentPage: async (req, res) => {
      try {
         const user = req.cookies.user;
         const apartmentId = req.params;
         const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
         const userInfor = await userModel.findOne({ _id: apartment.userId });
         const listComment = await commentModel.find({ apartmentId: apartmentId.id });
         let userId;
         if (user) {
            userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            role = role.name;
         }
         const like = await favoriteModel.findOne({ userId: userId, apartmentId: apartmentId.id });
         let isLike = false;
         if (like) {
            isLike = true;
         }
         res.status(200).render('../views/components/apartment', {
            apartment,
            user,
            userInfor,
            listComment,
            alert: req.flash('success'),
            isLike,
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({ msg: error });
      }
   },
   contactApartment: async (req, res) => {
      try {
         const apartmentId = req.params.id;

         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            const user = await userModel.findOne({ _id: userId });
            const apartment = await apartmentModel.findOne({ _id: apartmentId });
            contactModel.create({
               fullname: user.fullname,
               email: user.email,
               phonenumber: user.phonenumber,
               apartmentname: apartment.heading,
            });
            req.flash('success', 'Yêu cầu tư vấn căn hộ');
            res.redirect(`/detail/${apartmentId}`);
         } else {
            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = apartmentController;
