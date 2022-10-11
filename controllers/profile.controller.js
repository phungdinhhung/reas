const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt");

const profileController = {
    userInformation: async(req,res) => {
        try {
        let userId = req.cookies.user.user_id;
        let user;
        if(userId) {
            user = req.cookies.user.user_id;
        }
        if(user) {
            userId = req.cookies.user.user_id;
        }
        const userInfor = await UserModel.find({_id: userId});
        let msg1 = "";
        res.status(200).render('components/profile', {title:'Profile', msg1 , userInfor, user})
        // , userInfor, user
    } catch(e) {
        console.log(e)
    }
}
}

module.exports = profileController;