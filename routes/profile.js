const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const dotenv = require('dotenv');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

const upload = multer({ storage: storage });

router.get("/", profileController.userInformation);
router.post('/avatar', upload.single("file"), profileController.updateAvatar);
router.put('/update', profileController.updateInfor);
router.put('/update', profileController.changePassword);
module.exports = router;