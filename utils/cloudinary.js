const cloudinary = require ('cloudinary');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
    });


const cloudinaryUploadingImg = async (fileToUpload) =>{
    return new Promise ((resolve) =>{
        cloudinary.uploader.upload(fileToUpload, (result) =>{
            resolve (
            {
                url: result.secure_url,
                asset_id: result.asset._id,
                public_id: result.public_id
            },
            {
                resource_type: "auto"
            });
        });
    });
}

const cloudinaryDeleteImg = async (fileToUpload) =>{
    return new Promise ((resolve) =>{
        cloudinary.uploader.destroy(fileToDelete, (result) =>{
            resolve (
            {
                url: result.secure_url,
                asset_id: result.asset._id,
                public_id: result.public_id
            },
            {
                resource_type: "auto"
            });
        });
    });
}


module.exports = { cloudinaryUploadingImg, cloudinaryDeleteImg }