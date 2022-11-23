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

         res.redirect(`/detail/${apartmentId}`);
      } catch (e) {
         console.log(e);
         res.status(500).json(e);
      }
   },
};

module.exports = commentController;
