var cat_Schema =require("../model/categorymodel")


exports.insertCategory = async (req,res)=>{
    try {
        const data = await cat_Schema.create(req.body)
        if(data){
            res.status(200).json({
                msg:"category inserted successfully",
                data:data
            })
        }
        else{
            res.status(400).json({
                msg:'category not inserted'
            })
        }
    } catch (error) {
        res.status(400).json({
            msg:error.message
        })
    }
}

exports.getCategory = async(req,res)=>{
    try {
        const data = await cat_Schema.find()
        // console.log(data);
        if(data){
            res.status(200).json({
                data:data,
            })
        }else{
            res.status(400).json({
                msg:'category not found'
            })
        }
        
    } catch (error) {
        res.status(400).json({
            msg:error.message
        })
    }
}