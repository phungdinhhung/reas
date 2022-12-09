const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
};

module.exports = authController;
