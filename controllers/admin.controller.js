const userModel = require('../models/user.model');
const apartmentModel = require('../models/apartment.model');
const commentModel = require('../models/comment.model');
const messageModel = require('../models/message.model');
const contactModel = require('../models/contact.model');
const adminController = {
   // Dashboard Management
   renderdashboardPage: async (req, res) => {
      const renderUsers = await userModel.find();
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
         console.log(userId);
         user = await userModel.findOne({ _id: userId });
         console.log(user);
         if (user.role == 'admin') {
            res.render('admin.layouts/cover', {
               title: 'Dashboard Admin',
               content: '../admin/dashboard',
               numOfUser,
               numOfPost,
               numOfComment,
               numOfMessage,
               numOfContact,
               alert: req.flash('empty'),
            });
         } else {
            res.redirect('/error');
         }
      } else {
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

         const renderUsers = await userModel.find({
            $or: [
               { email: { $regex: '.*' + search + '.*', $options: 'i' } },
               { phonenumber: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/users',
                  renderUsers,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
   getRolesPage: async (req, res) => {
      try {
         if (req.cookies.user) {
            const users = await userModel.find();
            const userId = req.cookies.user.user_id;
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/roles',
                  users,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
            res.redirect('/login');
         }
      } catch (e) {
         console.log(e);
      }
   },
   updateRoles: async (req, res) => {
      try {
         const userId = req.query.id;
         res.redirect('/dashboard/roles');
      } catch (e) {
         console.log(e);
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

         const renderApartment = await apartmentModel.find({
            $or: [
               { region: { $regex: '.*' + search + '.*', $options: 'i' } },
               { heading: { $regex: '.*' + search + '.*', $options: 'i' } },
            ],
         });
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/viewApartment',
                  renderApartment,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
         user = await userModel.findOne({ _id: userId });
         if (user.role == 'admin') {
            res.render('admin.layouts/cover', {
               title: 'Dashboard Admin',
               content: '../admin/update',
               apartment,
               phases,
               alert: req.flash('success'),
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
            phases.push({ percent: phase[i], moneyPhase: (apartment.price * phase[i]) / 100 });
         }
         apartment.phase = phases;

         let files = req.files;
         let images = [];
         for (let i = 0; i < files.length; i++) {
            images.push({ url: files[i].path });
         }
         apartment.images = images;
         const update = await apartmentModel.updateOne({ _id: apartmentId }, apartment);
         if (update) {
            req.flash('success', 'Cập nhật thành công');
            res.redirect('/dashboard/viewApartment');
         }
      } catch (err) {
         console.log(err);
      }
   },

   deleteApartment: async (req, res) => {
      await apartmentModel
         .deleteOne({ _id: req.query.id })
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
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/upload',
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
            phases.push({ percent: phase[i], moneyPhase: (apartment.price * phase[i]) / 100 });
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
         console.log(error);
         res.status(500).json({ msg: error });
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
         if (req.cookies.user) {
            const userId = req.cookies.user.user_id;
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/comment',
                  renderComment,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/message',
                  message,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
            user = await userModel.findOne({ _id: userId });
            if (user.role == 'admin') {
               res.render('admin.layouts/cover', {
                  title: 'Dashboard Admin',
                  content: '../admin/contact',
                  contact,
                  alert: req.flash('success'),
               });
            } else {
               res.redirect('/error');
            }
         } else {
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
