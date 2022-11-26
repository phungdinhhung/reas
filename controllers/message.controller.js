const messageModel = require('../models/message.model');

const messageController = {
   postMessage: async (req, res) => {
      // Cách 1
      try {
         let message = req.body;

         const newMessage = new messageModel(message);
         await newMessage.save();
         req.flash('success', 'Bạn đã gửi thành công');
         res.redirect('/');
      } catch (e) {
         res.status(500).json('gui that bai');
      }

      /* Cách 2
      let { username, email, phonenumber, content } = req.body;

      messageModel.create({
         username: username,
         email: email,
         phonenumber: phonenumber,
         content: content,
      });
      res.redirect('/');
*/
   },
};
module.exports = messageController;
