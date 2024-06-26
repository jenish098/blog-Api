var userSchema = require("../model/usemodel")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
var passport = require("passport")
require("../password")
const uploadImage = require('../cloudinery/uploadImage')

exports.googleAuth = async (req, res) => {
    try {
        passport.authenticate('google', {
            successRedirect: 'http://localhost:3000/users/google/callback',
            failureRedirect: '/login'
        })(req, res);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

exports.getAllUsers = async (req,res)=>{
    try {
        const data = await userSchema.find()
        if(data){
            res.status(200).json({
                status:true,
                data:data,
            })
        }
        else{
            res.status(400).json({
                msg:"No data found"
            })
        }
    } catch (error) {
        console.log("error",error);
    }
}

exports.userinsert = async (req, res) => {
    try {
        const image = await uploadImage.uploadImage(req.file)
        const isExist = await userSchema.findOne({ email: req.email })
        if (isExist) {
            return res.status(400).json({
                status: false,
                msg: "Email Already Exist"
            })
        }
        const { name, email, password } = req.body

        const hashPassword = await bcrypt.hash(password, 10)

        const userData = new userSchema({
            name,
            email,
            password: hashPassword,
            image: image.secure_url
        })
        const data = await userData.save()
        if (data) {
            res.status(200).json({
                status: true,
                msg: "User Create Sucessfully",
                data: data
            })
        } else {
            res.status(400).json({
                status: false,
                msg: "User Not Create",
            })
        }

    } catch (error) {
        res.status(400).json({
            status: false,
            msg: error.message
        })
    }
}

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, "your_access_token_secret")
    return token
}


exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await userSchema.findOne({ email })
        await bcrypt.compare(password, userData.password)
        const accessToken = await generateAccessToken({ user: userData })
        req.session.userName = userData.id
        res.status(200).json({
            status: true,
            msg: "Login Successfully",
            data: userData,
            accessToken: accessToken,
            tokenType: "Bearer"
        })


    } catch (error) {
        return res.status(400).json({
            status: false,
            msg: error.message
        })
    }
}

exports.userProfile = async (req, res) => {
    try {
        const userData = req.user.user
        if (userData) {
            return res.status(200).json({
                status: true,
                data: userData
            })
        } else {
            return res.status(400).json({
                status: false,
                msg: "User Not Found"
            })
        }


    } catch (error) {
        return res.status(400).json({
            status: false,
            msg: error.message
        })
    }
}

exports.userFollow = async (req, res) => {
    try {
        const id = req.params.id
        userSchema.findByIdAndUpdate(
            { $push: { followers: id } },
            { new: true }
        )
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

exports.userResetPassword = async (req, res) => {
    try {
        const { email, password, c_password } = req.body
        const hashPassword = await bcrypt.hash(c_password,10)
        if (email) {
            if (password == c_password) {
                const user = await userSchema.findOneAndUpdate(
                    { email },
                    { $set: { password: hashPassword } },
                    { new: true },
                )
                if (user) {
                    return res.status(200).json({
                        msg: "Your Password Has Been Change"
                    })
                } else {
                    return res.status(400).json({
                        msg: "Email Dose Not Existing"
                    })
                }
            }else{
                return res.status(400).json({
                    msg:"Confirm Passsword Dose Not Match"
                })
            }
        }
        else {
            return res.status(400).json({
                msg: "email is require"
            })
        }


    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

