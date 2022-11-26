const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const bcrypt = require('bcrypt');

const registerController = {
   renderRegisterPage: (req, res) => {
      res.render('../views/layouts/register', { title: 'Register page', alert: req.flash('success') });
   },

   userRegister: async (req, res) => {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      let fullname = req.body.fullname;
      let email = req.body.email;
      let phonenumber = req.body.phonenumber;
      let password = hashed;
      let role = req.body.role;
      errs = [];
      userModel
         .findOne({
            email: email,
         })
         .then((data) => {
            if (data) {
               errs.push('Email already exist!');
            }
         });
      userModel
         .create({
            email: email,
            fullname: fullname,
            phonenumber: phonenumber,
            password: password,
         })
         .then((data) => {
            const roleBody = {
               userId: data._id.valueOf(),
               name: role,
            };
            const newUser = roleModel(roleBody);
            newUser.save();
            req.flash('success', 'Tạo tài khoản thành công');
            res.redirect('/register');
         })
         .catch((error) => {
            console.log(error);
            res.status(500).json('tao tai khoan that bai');
         });
   },
};
module.exports = registerController;
