const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const roleModel = require('../models/role.model');
const profileController = {
   userInformation: async (req, res) => {
      try {
         let userId = req.cookies.user.user_id;
         role = await roleModel.findOne({ userId: userId });
         const userData = await userModel.findById({ _id: userId });
         res.render('components/profile', {
            title: 'Profile',
            user: userData,
            role,
            alert: req.flash('success'),
            fail: req.flash('fail'),
         });
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
         await userModel.where({ _id: userId }).update(userAvt);
         req.flash('success', 'Cập nhật thành công');
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
         await userModel.where({ _id: userId }).update(body);
         req.flash('success', 'Cập nhật thành công');
         res.redirect('/profile');
      } catch (err) {
         console.log(err.message);
      }
   },
   changePassword: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const userInfor = await userModel.findOne({ _id: userId });
         const oldPassword = req.body.oldPassword;
         const salt = await bcrypt.genSalt(10);
         const newPassword = await bcrypt.hash(req.body.newPassword, salt);
         if (userInfor) {
            const validPassword = await bcrypt.compare(oldPassword, userInfor.password);
            if (validPassword) {
               const userData = await userModel.findByIdAndUpdate(
                  { _id: userId },
                  {
                     $set: {
                        password: newPassword,
                     },
                  },
               );
            }
            req.flash('success', 'Cập nhật thành công');
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
