const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: 'dstl37qsu',
    api_key: '366218157474424',
    api_secret: 'KS0jkCqwnS0Afo8FVDYk7ZqUU-w'
});



const uploadImage = async (fileName, publicid) => {
    try {
        let result
        if (fileName == undefined) {
            console.log("file name is not founde");
        }
        else {
            if (publicid) {
                result = await cloudinary.uploader.upload(fileName.path, { public_id: publicid })
            }
            else {
                result = await cloudinary.uploader.upload(fileName.path)
            }
        }
        return result ? result : null
    } catch (error) {
        console.log(error);
    }
}

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("result", result);
        return result ? result : null;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { uploadImage, deleteImage }