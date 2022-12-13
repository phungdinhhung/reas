const mongoose = require('mongoose');

const user = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         minlength: 10,
         unique: true,
      },
      fullname: {
         type: String,
         required: true,
         minlength: 6,
      },
      phonenumber: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 6,
      },
      avatar: {
         type: String,
         default: 'https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg',
      },
      is_varified: {
         type: Number,
         default: 0,
      },
      token: {
         type: String,
         default: '',
      },
   },
   { timestamps: true },
);

module.exports = mongoose.model('User', user);
