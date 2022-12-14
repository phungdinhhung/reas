const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const apartmentModel = require('../models/apartment.model');
const contactModel = require('../models/contact.model');
const favoriteModel = require('../models/favorite.model');
const roleModel = require('../models/role.model');
const apartmentController = {
   renderApartmentPage: async (req, res) => {
      try {
         const user = req.cookies.user;
         const apartmentId = req.params;
         const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
         const listComment = await commentModel.find({ apartmentId: apartmentId.id });
         let userId, textMessage, role;

         if (user) {
            userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            textMessage = await userModel.findOne({ _id: userId });
         }
         const like = await favoriteModel.findOne({ userId: userId, apartmentId: apartmentId.id });
         let isLike = false;
         if (like) {
            isLike = true;
         }
         res.status(200).render('../views/components/apartment', {
            apartment,
            user,
            role,
            listComment,
            textMessage,
            alert: req.flash('success'),
            fail: req.flash('fail'),
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
            req.flash('success', 'Y??u c???u t?? v???n c??n h???');
            res.redirect(`/detail/${apartmentId}`);
         } else {
            req.flash('fail', 'B???n c???n ph???i ????ng nh???p');
            res.redirect(`/detail/${apartmentId}`);
         }
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = apartmentController;
