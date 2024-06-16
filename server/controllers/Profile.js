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
}