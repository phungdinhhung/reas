const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const apartmentModel = require("../models/apartment.model");
const adminController = {
    renderdashboardPage: async (req, res) => {
      const renderUsers = await userModel.find({ deleted: false });
      const post = await apartmentModel.find();
      const numOfUser = renderUsers.length;
      const numOfPost = post.length;
        res.render("admin/cover", {
          title: "Dashboard Admin",
          content: "../admin/dashboard",
          numOfUser,
          numOfPost
        });
},
  getAllUsers: async(req,res) => {
    const renderUsers = await userModel.find();
  // renderUsers.forEach((item, index) => {
  //   if(item.username === "admin1") renderUsers.splice(index, 1);
  // })
  const roleUserId = await roleModel.find();
  res.render("admin/cover", {
    title: "Dashboard Admin",
    content: "../admin/users",
    renderUsers,
    roleUserId,
  });
  },
   getAllPosts: async(req, res) => {
    try {
      const post = await apartmentModel.find();
      res.render("admin/cover", {
        title: "Dashboard Admin",
        content: "../admin/viewApartment",
        post
      });
    } catch (error) {
      console.log('error: ', error);
    }
  },
    getUploadPage: async (req, res) => {
    try {
    const user = req.cookies.user;
    let userId = "",
      role = "";
    if (user) {
      userId = req.cookies.user.user_id;
      role = await roleModel.findOne({ userId: userId });
      role = role.name;
    }
    res.render("admin/cover", { 
      title: "Dashboard Admin",
      content: "../admin/upload",
        user,
        role,
        userId
      });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
},
    postUpload: async (req, res) => {
        try {
            const apartment = req.body;
            const address =
              req.body.beach +
              ", " +
              req.body.address +
              ", " +
              req.body.ward +
              ", " +
              req.body.district +
              ", " +
              req.body.city;
            apartment.address = address;
            apartment.userId = req.cookies.user.user_id;
            let files = req.files;
            let images = [];
            for (let i = 0; i < files.length; i++) {
              images.push({ url: files[i].path });
            }
            apartment.images = images;
            const newApartment = new apartmentModel(apartment);
            await newApartment.save();
            const user = req.cookies.user;
                let userId, role, showSearch = "no";
                if(user) {
                    userId = req.cookies.user.user_id
                    role = await roleModel.findOne({userId: userId});
                    role = role.name;
                }
                let perPage = 4; 
                let page = req.params.page || 1;
            await apartmentModel.find({userId: userId}).skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, listapartment) => {
                    apartmentModel.countDocuments((err, count) => {
                        if(err) return next(err);
                        // res.status(200).render("manageapartment", {title: "Dream Boarding House", listapartment, current: page, pages: Math.ceil(count / perPage), user, role, listapartment, showSearch, numberNotification})
                    })
                });
                res.status(200).json({msg: "Success"})
          } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error });
          }
},
}

module.exports = adminController;