const userModel = require('../models/user.model');
const apartmentModel = require('../models/apartment.model');
const commentModel = require('../models/comment.model');
const messageModel = require('../models/message.model');
const contactModel = require('../models/contact.model');
const roleModel = require('../models/role.model');
const bcrypt = require('bcrypt');

const adminController = {
   // Dashboard Management
   renderdashboardPage: async (req, res) => {
      const renderUsers = await userModel.find({
         is_varified: { $eq: 1 },
      });
      const post = await apartmentModel.find();
      const comment = await commentModel.find();
      const message = await messageModel.find();
      const contact = await contactModel.find();
      // const contact = await contactModel.find();
      const numOfUser = renderUsers.length - 1;
      const numOfPost = post.length;
      const numOfComment = comment.length;
      const numOfMessage = message.length;
      const numOfContact = contact.length;
      if (req.cookies.user) {
         const userId = req.cookies.user.user_id;
         const role = await roleModel.findOne({ userId: userId });
         if (role.name !== 'customer') {
            res.render('admin.layouts/cover', {
               title: 'Dashboard Admin',
               content: '../admin/dashboard',
               role,
               numOfUser,
               numOfPost,
               numOfComment,
               numOfMessage,
               numOfContact,
               alert: req.flash('success'),
               fail: req.flash('fail'),
            });
         } else {
            res.redirect('/error');
         }
      } else {
         req.flash('fail', 'bạn chưa đăng nhập');
         res.redirect('/login');
      }
   },

   //  Start Management Users Page
   getAllUsers: async (req, res) => {
      try {
         var search = '';
         if (req.query.search) {
            search = req.query.search;
         }
         const renderRoles = await roleModel.find({});

         const renderUsers = await userModel.find({
            email: { $not: { $regex: 'admin' } },
            is_varified: { $eq: 1 },
            $or: [
               { email: { $regex: '.*' + search + '.*', $options: 'i' } },
               { phonenumber: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/users',
                  renderUsers,
                  renderRoles,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');
            res.redirect('/login');
         }
      } catch (err) {
         console.log(err);
      }
   },
   deleteUsers: async (req, res) => {
      await userModel
         .deleteOne({ _id: req.query.id })
         .then(() => {
            req.flash('success', 'Xóa người dùng thành công');
            res.redirect('/dashboard/users');
         })
         .catch((err) => {
            res.status(500).send(err);
         });
   },
   //  End Management Users Page
   // Start management Roles Page
   getCreatePage: async (req, res) => {
      try {
         if (req.cookies.user) {
            const users = await userModel.find();
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/create',
                  users,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');
            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   createUser: async (req, res) => {
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
         res.redirect('/dashboard/create');
      } else if (checkPassword !== confirmPassword) {
         req.flash('fail', 'Mật khẩu không trùng khớp');
         res.redirect('/dashboard/create');
      } else {
         let password = hashed;
         userModel
            .create({
               email: email,
               fullname: fullname,
               phonenumber: phonenumber,
               password: password,
               is_varified: 1,
            })
            .then((data) => {
               const roleNew = {
                  userId: data._id.valueOf(),
                  name: 'manager',
               };
               const roleSave = new roleModel(roleNew);
               roleSave.save();
               req.flash('success', 'Tạo tài khoản thành công');
               res.redirect('/dashboard/users');
            })
            .catch((error) => {
               console.log(error);
               req.flash('fail', 'Tạo tài khoản thất bại');
               res.redirect('/dashboard/create');
            });
      }
   },

   // End management Roles Page

   // Start Management Apartment Page
   getAllPosts: async (req, res) => {
      try {
         var search = '';
         if (req.query.search) {
            search = req.query.search;
         }
         const userUpload = await userModel.find();
         const renderApartment = await apartmentModel.find({
            $or: [
               { region: { $regex: '.*' + search + '.*', $options: 'i' } },
               { heading: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/viewApartment',
                  renderApartment,
                  userUpload,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');

            res.redirect('/login');
         }
      } catch (error) {
         console.log('error: ', error);
      }
   },
   updateApartment: async (req, res) => {
      try {
         const apartmentId = req.params.id;
         const userId = req.cookies.user.user_id;

         const apartment = await apartmentModel.findOne({ _id: apartmentId });
         const phases = apartment.phase;
         role = await roleModel.findOne({ userId: userId });
         if (role.name !== 'customer') {
            res.render('admin.layouts/cover', {
               title: 'Dashboard Admin',
               content: '../admin/update',
               apartment,
               phases,
               alert: req.flash('success'),
               fail: req.flash('fail'),
            });
         }
      } catch (error) {
         console.log(error);
      }
   },
   update: async (req, res) => {
      try {
         const apartment = req.body;
         const apartmentId = req.params.id;
         apartment.userId = req.cookies.user.user_id;

         let phase = req.body.phase;
         let phases = [];
         for (let i = 0; i < phase.length; i++) {
            phases.push({ percent: phase[i] });
         }
         apartment.phase = phases;
         let files = req.files;
         if (files.length !== 0) {
            let images = [];
            for (let i = 0; i < files.length; i++) {
               images.push({ url: files[i].path });
            }
            apartment.images = images;
         }
         const update = await apartmentModel.updateOne({ _id: apartmentId }, apartment);
         if (update) {
            req.flash('success', 'Cập nhật thành công');
            res.redirect('/dashboard/viewApartment');
         }
      } catch (err) {
         req.flash('fail', 'Cập nhật thất bại');
         res.redirect('/dashboard/viewApartment');
      }
   },

   deleteApartment: async (req, res) => {
      await apartmentModel.deleteOne({ _id: req.query.id });
      await commentModel
         .deleteMany({ apartmentId: req.query.id })
         .then(() => {
            req.flash('success', 'Xóa căn hộ thành công');
            res.redirect('/dashboard/viewApartment');
         })
         .catch((err) => {
            res.status(505).send(err);
         });
   },
   //  End Management Apartment Page

   //  Start Management Posts Apartment Page
   getUploadPage: async (req, res) => {
      try {
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/upload',
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');

            res.redirect('/login');
         }
      } catch (error) {
         res.status(500).json({ msg: error });
      }
   },
   postUpload: async (req, res) => {
      try {
         const apartment = req.body;
         apartment.userId = req.cookies.user.user_id;
         let phase = req.body.phase;
         let phases = [];
         for (let i = 0; i < phase.length; i++) {
            phases.push({ percent: phase[i] });
         }
         apartment.phase = phases;

         let files = req.files;
         let images = [];
         for (let i = 0; i < files.length; i++) {
            images.push({ url: files[i].path });
         }
         apartment.images = images;
         const newApartment = new apartmentModel(apartment);
         await newApartment.save();
         user = req.cookies.user;
         req.flash('success', 'Đăng căn hộ thành công');
         res.redirect('/dashboard/viewApartment');
      } catch (error) {
         req.flash('fail', 'Đăng căn hộ thất bại');
         res.redirect('/dashboard/upload');
      }
   },
   //  End Management Posts Apartment Page

   // Start Management Comment Page
   getCommentPage: async (req, res) => {
      try {
         var search = '';
         if (req.query.search) {
            search = req.query.search;
         }

         const renderComment = await commentModel.find({
            $or: [
               { content: { $regex: '.*' + search + '.*', $options: 'i' } },
               { userName: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });
         const apartment = await apartmentModel.find();
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/comment',
                  renderComment,
                  apartment,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');

            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   deleteComment: async (req, res) => {
      await commentModel
         .deleteOne({ _id: req.query.id })
         .then(() => {
            req.flash('success', 'Xóa bình luận thành công');
            res.redirect('/dashboard/comment');
         })
         .catch((e) => {
            res.status(500);
         });
   },
   // End Management Comment Page

   // Start Management Message Page
   getMessagePage: async (req, res) => {
      try {
         var search = '';
         if (req.query.search) {
            search = req.query.search;
         }
         const message = await messageModel.find({
            $or: [
               { username: { $regex: '.*' + search + '.*', $options: 'i' } },
               { phonenumber: { $regex: '.*' + search + '.*', $options: 'i' } },
               { email: { $regex: '.*' + search + '.*', $options: 'i' } },
               { content: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });

         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/message',
                  message,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');

            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   deleteMessage: async (req, res) => {
      await messageModel
         .deleteOne({ _id: req.query.id })
         .then(() => {
            req.flash('success', 'Xóa tin nhắn thành công');
            res.redirect('/dashboard/message');
         })
         .catch((err) => {
            res.status(505).send(err);
         });
   },
   // End Management Message Page

   // Start Management Contact Page
   getContactPage: async (req, res) => {
      try {
         const contact = await contactModel.find();

         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
            if (role.name !== 'customer') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/contact',
                  contact,
                  alert: req.flash('success'),
                  fail: req.flash('fail'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            req.flash('fail', 'bạn chưa đăng nhập');

            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   deleteContact: async (req, res) => {
      await contactModel
         .deleteOne({ _id: req.query.id })
         .then(() => {
            req.flash('success', 'Xóa thông tin thành công');
            res.redirect('/dashboard/contact');
         })
         .catch((err) => {
            res.status(505).send(err);
         });
   },
   // End Management Contact Page
};

module.exports = adminController;
