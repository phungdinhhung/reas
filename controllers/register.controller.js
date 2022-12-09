const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const registerController = {
   renderRegisterPage: (req, res) => {
      res.render('../views/layouts/register', {
         title: 'Register page',
         alert: req.flash('success'),
         fail: req.flash('fail'),
      });
   },

   userRegister: async (req, res) => {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      let fullname = req.body.fullname;
      let email = req.body.email;
      let phonenumber = req.body.phonenumber;
      let checkPassword = req.body.password;
      let confirmPassword = req.body.confirmPassword;
      let checkEmail = await userModel.findOne({
         email: email,
      });
      if (checkEmail) {
         req.flash('fail', 'Email đã sử dụng');
         res.redirect('/register');
      } else if (checkPassword !== confirmPassword) {
         req.flash('fail', 'Mật khẩu không trùng khớp');
         res.redirect('/register');   
      } else{
         let password = hashed;
         userModel
            .create({
               email: email,
               fullname: fullname,
               phonenumber: phonenumber,
               password: password,
            })

            .then(() => {
               req.flash('success', 'Tạo tài khoản thành công');
               res.redirect('/login');
            })

            .catch((error) => {
               console.log(error);
               req.flash('fail', 'Tạo tài khoản thất bại');
               res.redirect('/register');
            });
      }
   },
};
module.exports = registerController;
