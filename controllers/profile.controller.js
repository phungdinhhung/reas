const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt");

const profileController = {
    userInformation: async(req,res) => {
        try {
            let userId = req.cookies.user.user_id
            const userData = await UserModel.findById({ _id: userId});

        // let userId = req.cookies.user.user_id;
        // let user;
        // if(userId) {
        //     user = req.cookies.user.user_id;
        // }
        // if(user) {
        //     userId = req.cookies.user.user_id;
        // }
        // const userInfor = await UserModel.find({_id: userId});
        let msg1 = "";
        res.status(200).render('components/profile', {title:'Profile', user: userData})
        // , userInfor, user
    } catch(e) {
        console.log(e)
    }
},
    updateAvatar: async (req, res, next) => {
    try {
        const userId = req.cookies.user.user_id
        let file = {};
        file = req.file;
        const userAvt = {
            avatar: file.path
        }
        await UserModel.where({_id: userId}).update(userAvt);
        console.log(file);
        let user;
        if(userId) {
            user = req.cookies.user.user_id;
        }
        const userInfor = await UserModel.find({_id: userId});
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
    }
},
    updateInfor: async (req, res) => { 
        try {
            const userId = req.cookies.user.user_id;
            const filter = {_id: userId};
            console.log(userId);
            const userData = await UserModel.findOneAndUpdate(filter, {$set:{fullname: req.body.fullname, phonenumber: req.body.phonenumber}}, {new: true});
            // const userInfor = await UserModel.find({_id: userId});
            await userData.save();
            console.log(userData);
            console.log(userData._id);
            console.log(userData.fullname);
            console.log(userData.phonenumber);
            res.redirect("/profile")
        }catch(err) {
            console.log(err.message);
        }
    },
    changePassword: async (req, res) => {

    }
}

module.exports = profileController;