const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const apartmentModel = require('../models/apartment.model');

const apartmentController = {
    renderApartmentPage: async(req, res) => {
        try {
            const user = req.cookies.user;
            const apartmentId = req.params;
            const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
            const userInfor = await userModel.findOne({ _id: apartment.userId });
            // const listCmt = await Comment.find({roomId: roomId.id});
            const phoneNumber = userInfor.phoneNumber;
            let userId;
            if (user) {
              userId = req.cookies.user.user_id;
              role = await roleModel.findOne({ userId: userId });
              role = role.name;
            }
            // let showSearch = "no";
            // let numberNotification = await NotificationService.getNumberNotification(userId);
            // const roomLike = await FavoriteRoom.findOne({userId: userId, roomId: roomId.id});
            // let isLike = false;
            // if(roomLike) {
            //     isLike = true;
            // }
            // const isSelectRoom = await ChooseRoom.findOne({userId: userId, roomId: roomId.id});
            // let isChoose = false;
            // if(isSelectRoom) {
            //   isChoose = true;
            // }
              res.status(200)
              .render("../views/components/apartment", {
                apartment,
                user,
                phoneNumber,
                userInfor,
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
    
}

module.exports = apartmentController;