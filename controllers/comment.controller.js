const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const apartmentModel = require('../models/apartment.model');

const commentController = {
   newComment: async (req, res) => {
      try {
         const userId = req.cookies.user.user_id;
         const apartmentId = req.params.id;
         const { content } = req.body;
         const userComment = await userModel.findOne({ _id: userId });
         const userName = userComment.fullname;
         const userAvatar = userComment.avatar;
         let commentBody = {
            userId: userId,
            apartmentId: apartmentId,
            userName: userName,
            content: content,
            avatar: userAvatar,
         };

         const newComment = new commentModel(commentBody);
         await newComment.save();
         req.flash('success', 'Bình luận thành công');
         res.redirect(`/detail/${apartmentId}`);
      } catch (e) {
         console.log(e);
      }
   },
   deleteComment: async (req, res) => {
      try {
         const commentId = req.params.id;
         await commentModel.deleteOne({ _id: commentId });
         const apartmentId = req.params.apartmentId;
         req.flash('success', 'Đã xóa bình luận');
         res.redirect(`/detail/${apartmentId}`);
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = commentController;
