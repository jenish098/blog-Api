var express = require('express');
var router = express.Router();
var cat_Schema=require("../cantroller/categorycantroller");
var blog_cantroller = require("../cantroller/blogcantroller")
var multer = require("multer")
var {verifyToken} = require('../middelware/Auth')


const upload = multer({storage:multer.diskStorage({}),limits:{fileSize:5000000}});

router.post("/addcategory",cat_Schema.insertCategory)
router.get("/getcategory",cat_Schema.getCategory)
router.post("/addblog",verifyToken,upload.single("image"),blog_cantroller.blogInsert)
router.get("/allblog",verifyToken,blog_cantroller.getAllBlog)
router.get("/singleblog/:id",verifyToken,blog_cantroller.getSingleBlog)
router.post("/updateblog/:id",verifyToken,upload.single("image"),blog_cantroller.updateBlog)
router.delete("/deleteblog/:id",verifyToken,blog_cantroller.deleteBlog)
router.post("/addcomment/:id",verifyToken,blog_cantroller.addComment)
router.post("/addlike/:id",verifyToken,blog_cantroller.addLike)
router.get("/getBlogForUserId",verifyToken,blog_cantroller.getBlogForUserId)



module.exports = router;
