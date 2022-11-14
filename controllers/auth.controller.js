const UserModel = require("../models/user.model")
const RoleModel = require("../models/role.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
    loginUser: async(req, res) => {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({email: email});
            if(user) {
              role = await RoleModel.findOne({
                userId: user.id
              })
            }
            if(!user) {
                return res.status(404).render("../views/layouts/login");
            }
            const validPassword = await bcrypt.compare(
                password,
                user.password
            );
            if(!validPassword) {
                return res.status(404).render("../views/layouts/login");
            }
            if( user && validPassword) {

                // res.status(200).json(user);
                const accessToken = jwt.sign(
                    {
                      user_id: user._id,
                      email: user.email,
                      createdAt: user.createdAt,
                      updatedAt: user.updatedAt,
                    },
                    process.env.JWT_ACCESS_KEY,
                    { expiresIn: "1h" }
                  );
                  const refreshToken = jwt.sign(
                    {
                      user_id: user._id,
                      email: user.email,
                      createdAt: user.createdAt,
                      updatedAt: user.updatedAt,
                    },
                    process.env.JWT_REFRESHTOKEN_KEY,
                    { expiresIn: "2h" }
                  );
                  const userInClient = {
                    user_id: user._id,
                    email: user.email,
                    userAvt: user.avatar,
                  };
                  res.cookie("user", userInClient, {
                    httpOnly: true,
                    sameSite: "strict",
                  });
                  res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "strict",
                  });
                  res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                  });
                  if(role.name == "customer") {
                    res.redirect("/")
                  } else {
                    res.redirect("/dashboard")
                  }
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    logOut: (req,res) => {
        res.clearCookie("user");
        res.clearCookie("accessToken");
        res.redirect("/");
    }
}

module.exports = authController