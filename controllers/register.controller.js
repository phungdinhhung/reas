const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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
      } else {
         let password = hashed;
         const userNew = new userModel({
            email: email,
            fullname: fullname,
            phonenumber: phonenumber,
            password: password,
         });
         const userData = await userNew.save();
         if (userData) {
            sendVerifyMail(req.body.fullname, req.body.email, userData._id);
            req.flash('success', 'Vui lòng xác nhận Email');
            res.redirect('/login');
         } else {
            req.flash('fail', 'Tạo tài khoản thất bại');
            res.redirect('/register');
         }
      }
   },

   verifyMail: async (req, res) => {
      try {
         await userModel.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } });
         req.flash('success', 'Xác minh hoàn tất');
         res.redirect('/login');
      } catch (e) {
         console.log(e.message);
      }
   },
};
const sendVerifyMail = async (name, email, user_id) => {
   try {
      const transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 587,
         secure: false,
         requireTLS: true,
         auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD,
         },
      });
      const mailOptions = {
         from: process.env.EMAILUSER,
         to: email,
         subject: 'Xác minh tài khoản REAS',
         html:
            '<p>Xin chào ' +
            name +
            ', vui lòng nhấn <a href="http://localhost:5000/register/verify?id=' +
            user_id +
            '">vào đây</a> để xác minh tài khoản REAS. </p>',
      };
      transporter.sendMail(mailOptions, function (err, info) {
         if (err) {
            console.log(err);
         } else {
            console.log('Email has been sent:- ', info.response);
         }
      });
   } catch (e) {
      console.log(e.message);
   }
};
module.exports = registerController;
