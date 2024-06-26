var blogSchema = require("../model/blogmodel")
var uploadImage = require("../cloudinery/uploadImage")
var userName = require("../cantroller/usercantroller")
var session = require("express-session")

exports.blogInsert = async (req, res) => {
    try {
        const image = await uploadImage.uploadImage(req.file)
        const { title, discription, cat_id } = req.body
        const public_id = image.public_id
        let upload_date = new Date()
        const user_Id = req.user.user._id
        const blog = new blogSchema({
            title,
            discription,
            cat_id,
            upload_date,
            image: image.secure_url,
            public_id,
            userId: user_Id
        })
        const result = await blog.save()
        console.log("blog", blog);
        res.status(200).json({
            msg: "blog inserted",
            data: result
        })

    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.getAllBlog = async (req, res) => {
    try {
        const data = await blogSchema.find().populate("userId").populate("cat_id")
        res.status(200).json({
            msg: "all blog",
            data: data,
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.getBlogForUserId = async (req, res) => {
    try {
        const userId = req.user.user._id
        const data = await blogSchema.find({ userId: userId }).populate("cat_id").populate("userId")
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params
        const data = await blogSchema.findById(id).populate("cat_id").populate("userId")
        res.status(200).json({
            msg: "single blog",
            data: data,
            user:req.user
        })

    } catch (error) {
        console.log(error.message);
    }
}

exports.updateBlog = async (req, res) => {
    try {
        let newPublic_id
        let image_url
        const { cat_id, title, discription } = req.body
        const { id } = req.params
        const image_data = await blogSchema.findById(id)
        const publicid = image_data.public_id;
        console.log("image_data", image_data);
        if (publicid !== req.body.image && req.body.image !== undefined) {
            const Image = await uploadImage.uploadImage(req.file, publicid)
            newPublic_id = Image.public_id
            image_url = Image.secure_url
        }

        const data = await blogSchema.findByIdAndUpdate(id, {
            cat_id,
            title,
            discription,
            public_id: newPublic_id,
            image: image_url
        })
        res.status(200).json({
            msg: "blog updated",
            data: data
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        const data = await blogSchema.findByIdAndDelete(id)
        const publicId = data.public_id;

        if (publicId) {
            await uploadImage.deleteImage(publicId);
        }
        res.status(200).json({
            msg: "blog deleted",
            data: data
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.addComment = async (req, res) => {
    try {
        const _id = req.params.id
        const username = userName.userName
        const data = await blogSchema.findByIdAndUpdate(_id, {
            $push: {
                "comment": { comment: req.body.comment, username: username }
            }
        })
        res.status(200).json({
            msg: "comment add successfully",
            data
        })

    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.addLike = async (req, res) => {
    try {

        const id = req.params.id
        const userId = req.user.user._id
        const findData = await blogSchema.findById(id)
        const findUser = findData.like.find((item) => item == userId)
        if (findUser) {
            const data = await blogSchema.findByIdAndUpdate(id, {
                $pull: {
                    "like": userId
                }
            }, { new: true })
            res.status(200).json({
                status: false,
                msg: "Unlike Post",
                data: data
            })
        } else {
            const data = await blogSchema.findByIdAndUpdate(id, {
                $push: {
                    "like": userId
                }
            }, { new: true })
            // console.log("data",data);
            res.status(200).json({
                status: true,
                msg: "like Post",
                data: data,
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

