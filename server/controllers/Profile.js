const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req,res) =>{
    try{
        const {dateOfBirth="",about="",contactNumber} = req.body;
        const id = req.user.id;

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Profile not updated, please try again",
            error:err.message
        })
    }
}

exports.deleteAccount = async (req,res) =>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found",
            });
        };

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
            profileDetails,
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Profile not updated, please try again",
            error:err.message
        })
    }
};

exports.getAllUserDetails = async (req,res) =>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"users details fetched successfully",
            userDetails,
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:"error while fetching all user details",
            error:err.message
        })
    }
};

exports.updateDisplayPicture = async (req,res) =>{
    try{
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            100
        );
        console.log(image);

        const updatedProfile = await User.findByIdAndUpdate({_id:userId},
                                                    {image:image.secure_url},
                                                    {new:true}
        );

        res.send({
            success:true,
            message:"image updated successfully",
            data:updatedProfile,
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};

exports.getEnrolledCourses = async (req,res) =>{
    try{
        const userId = req.user.id;
        const userDetails = await User.findOne({_id:userId})
                                    .populate("courses")
                                    .exec();
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find user with id: ${userDetails}`,
            })
        }

        return res.status(200).json({
            success:true,
            data:userDetails.courses,
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    } 
}