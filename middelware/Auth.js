var jwt = require('jsonwebtoken')

exports.verifyToken = async(req,res,next)=>{

    const token = req.body.token || req.query.token || req.headers['authorization']
    if(!token){  
        res.status(400).json({
            success:false,
            msg:" A token for required for authentication"
        })
    }

    try {
        const Bearer =  token.split(' ');
        const bearerToken = Bearer[1];

        const decodedData = jwt.verify(bearerToken,"your_access_token_secret");
        req.user = decodedData;
        return next()
    } catch (error) {
        res.status(400).json({
            success:false,
            msg:"Invalid token"
        })
    }
   

}