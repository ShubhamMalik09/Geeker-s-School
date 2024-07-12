const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file,folder,height,quality) =>{
    const options = {asset_folder:folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    console.log("options->",options)
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}