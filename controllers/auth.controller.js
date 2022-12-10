const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const random = require('randomstring');
const nodemailer = require('nodemailer');

const authController = {
   loginUser: async (req, res) => {
      const { email, password } = req.body;
      try {
         var validPassword = '';
         const user = await userModel.findOne({ email: email });
         if (user) {
            validPassword = await bcrypt.compare(password, user.password);
         }
         if (!user) {
            req.flash('fail', 'Email không chính xác');
            res.redirect('/login');
         } else if (!validPassword) {
            req.flash('fail', 'Mật khẩu không đúng');
            res.redirect('/login');
         } else if (user && validPassword) {
            if (user.is_varified == 1) {
               const accessToken = jwt.sign(
                  {
                     user_id: user._id,
                     email: user.email,
                     createdAt: user.createdAt,
                     updatedAt: user.updatedAt,
                  },
                  process.env.JWT_ACCESS_KEY,
                  { expiresIn: '1h' },
               );
               const refreshToken = jwt.sign(
                  {
                     user_id: user._id,
                     email: user.email,
                     createdAt: user.createdAt,
                     updatedAt: user.updatedAt,
                  },
                  process.env.JWT_REFRESHTOKEN_KEY,
                  { expiresIn: '2h' },
               );
               const userInClient = {
                  user_id: user._id,
                  email: user.email,
                  userAvt: user.avatar,
               };
               res.cookie('user', userInClient, {
                  httpOnly: true,
                  sameSite: 'strict',
               });
               res.cookie('accessToken', accessToken, {
                  httpOnly: true,
                  sameSite: 'strict',
               });
               res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  sameSite: 'strict',
               });

               if (user.role == 'customer') {
                  res.redirect('/');
               } else {
                  res.redirect('/dashboard');
               }
            } else {
               req.flash('fail', 'Bạn chưa xác minh Email');
               res.redirect('/login');
            }
         }
      } catch (err) {
         console.log(err);
         return res.status(500).json(err);
      }
   },
   logOut: (req, res) => {
      res.clearCookie('user');
      res.clearCookie('accessToken');
      res.redirect('/');
   },
   forgetPassword: async (req, res) => {
      try {
         const email = req.body.email;
         const userData = await userModel.findOne({ email: email });
         if (userData) {
            if (userData.is_varified === 0) {
               req.flash('fail', 'Vui lòng xác minh email');
               res.redirect('/login');
            } else {
               const randomString = random.generate();
               await userModel.updateOne({ email: email }, { $set: { token: randomString } });
               sendResetMail(userData.fullname, userData.email, randomString);
               req.flash('success', 'Vui lòng kiểu tra email');
               res.redirect('/login');
            }
         } else {
            req.flash('fail', 'Email không tồn tại');
            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   resetPassword: async (req, res) => {
      try {
         const token = req.query.token;
         const tokenData = await userModel.findOne({ token: token });
         if (tokenData) {
            res.render('../views/layouts/forgetPass', {
               user_id: tokenData._id,
               alert: req.flash('success'),
               fail: req.flash('fail'),
            });
         } else {
            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   newPassword: async (req, res) => {
      try {
         const password = req.body.password;
         const userId = req.body.user_id;
         const salt = await bcrypt.genSalt(10);
         const hashed = await bcrypt.hash(password, salt);
         const newPassword = hashed;
         await userModel.findByIdAndUpdate({ _id: userId }, { $set: { password: newPassword } });
         req.flash('success', 'Bạn đã đổi mật khẩu');
         res.redirect('/login');
      } catch (e) {
         console.log(e);
      }
   },
};
const sendResetMail = async (name, email, token) => {
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
         subject: 'Lấy lại mật khẩu',
         html:
            '<p>Xin chào ' +
            name +
            ', vui lòng nhấn <a href="http://localhost:5000/login/password?token=' +
            token +
            '">vào đây</a> để lấy mã. </p>',
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

module.exports = authController;
