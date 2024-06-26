var mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    title:{
        type:String
    },
    image:{
        type:String
    },
    discription:{
        type:String
    },
    upload_date:{
        type:String
    },
    comment:{
        type:Object
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    public_id:{
        type:String
    }
})

module.exports=mongoose.model("blog",blogSchema)