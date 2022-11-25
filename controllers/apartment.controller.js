const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const commentModel = require('../models/comment.model');
const apartmentModel = require('../models/apartment.model');
const contactModel = require('../models/contact.model');
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
         // let showSearch = "no";
         // const roomLike = await FavoriteRoom.findOne({userId: userId, roomId: roomId.id});
         // let isLike = false;
         // if(roomLike) {
         //     isLike = true;
         // }
         res.status(200).render('../views/components/apartment', {
            apartment,
            user,
            userInfor,
            listComment,
            // showSearch,
            // isLike,
            // numberNotification,
            // listCmt,
            // isChoose,
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({ msg: error });
      }
   },
   contactApartment: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const apartmentId = req.params.id;
         console.log(userId);
         console.log(apartmentId);
         // const user = await userModel.findOne({ _id: userId });
         // const apartment = await apartmentModel.findOne({ _id: apartmentId });
         contactModel.create({
            userId: userId,
            apartmentId: apartmentId,
         });
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = apartmentController;
