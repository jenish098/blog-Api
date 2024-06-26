var express = require('express');
var router = express.Router();
var userCantroller = require("../cantroller/usercantroller");
const { verifyToken } = require('../middelware/Auth');
const passport = require('passport');
const multer = require('multer');
require('../password')

const upload = multer({storage:multer.diskStorage({}),limits:{fileSize:5000000}});

router.get("/getAllUser",userCantroller.getAllUsers)
router.post("/userInsert",upload.single("image"),userCantroller.userinsert)
router.post("/login",userCantroller.userLogin)
router.get("/userProfile",verifyToken,userCantroller.userProfile)
router.post("/resetPassword",userCantroller.userResetPassword)
// router.get("/google/calback",userCantroller.googleAuth)

// router.get("/google/calback",passport.authenticate('google',{
//     successRedirect:'http://localhost:3000/users/google/calback',
//     failureRedirect:'/login'
// }))


module.exports = router;
