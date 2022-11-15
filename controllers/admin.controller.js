const UserModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const apartmentModel = require("../models/apartment.model");
const adminController = {
    renderdashboardPage: async (req, res) => {
      const renderUsers = await UserModel.find();
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


//  Start Management Users Page
  getAllUsers: async(req,res) => {
  try {
    const renderUsers = await UserModel.find();
    res.render("admin/cover", {
      title: "Dashboard Admin",
      content: "../admin/users",
      renderUsers,
    });
  }catch(err) {
    console.log(err)
  }
},
  deleteUsers: async(req,res) => {
      await UserModel.deleteOne({ _id: req.query.id })
      .then(() => {
        res.redirect("/dashboard/users")
      })
      // res.render("admin/cover", {
      //   title: "Dashboard Admin",
      //   content: "../admin/users",
      //   renderUsers,
      // });
     .catch((err) => {
      res.status(500).send(err);
    });
},
//  End Management Users Page


// Start Management Apartment Page
   getAllPosts: async(req, res) => {
    try {
      const renderApartment = await apartmentModel.find();
      res.render("admin/cover", {
        title: "Dashboard Admin",
        content: "../admin/viewApartment",
        renderApartment
      });
    } catch (error) {
      console.log('error: ', error);
    }
},
  deleteApartment: async(req, res) => {
      await apartmentModel.deleteOne({_id: req.query.id})
      .then(() => {
        res.redirect("/dashboard/viewApartment")
      })
      .catch((err) => {
        res.status(505).send(err)
      })
},
//  End Management Apartment Page


//  Start Management Posts Apartment Page
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
                res.redirect("/dashboard/viewApartment")
          } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error });
          }
},
//  End Management Posts Apartment Page  



}

module.exports = adminController;