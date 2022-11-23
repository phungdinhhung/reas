const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const bcrypt = require('bcrypt');

const profileController = {
   userInformation: async (req, res) => {
      try {
         let userId = req.cookies.user.user_id;
         const userData = await UserModel.findById({ _id: userId });

         // let userId = req.cookies.user.user_id;
         // let user;
         // if(userId) {
         //     user = req.cookies.user.user_id;
         // }
         // if(user) {
         //     userId = req.cookies.user.user_id;
         // }
         // const userInfor = await UserModel.find({_id: userId});
         let msg1 = '';
         res.status(200).render('components/profile', { title: 'Profile', user: userData });
         // , userInfor, user
      } catch (e) {
         console.log(e);
      }
   },
   updateAvatar: async (req, res, next) => {
      try {
         const userId = req.cookies.user.user_id;
         let file = {};
         file = req.file;
         const userAvt = {
            avatar: file.path,
         };
         await UserModel.where({ _id: userId }).update(userAvt);
         console.log(file);
         let user;
         if (userId) {
            user = req.cookies.user.user_id;
         }
         const userInfor = await UserModel.find({ _id: userId });
         res.redirect('/profile');
      } catch (error) {
         console.log(error);
      }
   },
   updateInfor: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const { fullname, phonenumber } = req.body;
         const body = {
            fullname: fullname,
            phonenumber: phonenumber,
         };
         await UserModel.where({ _id: userId }).update(body);
         // console.log(userId);
         // const userData = await UserModel.findOneAndUpdate(filter, {$set:{fullname: req.body.fullname, phonenumber: req.body.phonenumber}}, {new: true});
         // // const userInfor = await UserModel.find({_id: userId});
         // await userData.save();
         console.log(body);
         res.redirect('/profile');
      } catch (err) {
         console.log(err.message);
      }
   },
   changePassword: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const userInfor = await UserModel.findOne({ _id: userId });
         const oldPassword = req.body.oldPassword;
         const salt = await bcrypt.genSalt(10);
         const newPassword = await bcrypt.hash(req.body.newPassword, salt);
         if (userInfor) {
            const validPassword = await bcrypt.compare(oldPassword, userInfor.password);
            if (validPassword) {
               const userData = await UserModel.findByIdAndUpdate(
                  { _id: userId },
                  {
                     $set: {
                        password: newPassword,
                     },
                  },
               );
            }
            res.redirect('/profile');
         } else {
            res.status(200).send({ success: false });
         }
      } catch (error) {
         res.status(400).send(error.message);
      }
   },
};

module.exports = profileController;
