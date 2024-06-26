var mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String
    },
    followers:{
        type:Object,
        ref:"User"
    },
    following:{
        type:Object,
        ref:"User"
    }
})


module.exports= mongoose.model("User",userSchema)