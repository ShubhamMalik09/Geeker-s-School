const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req,res) =>{
    try{
        const {title,timeDuration, description, sectionId} = req.body;
        const video = req.files.videoFile;

        if(!title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        };

        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        const newSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoURL:uploadDetails.secure_url
        });

        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                        {$push:
                                            {
                                            subSection: newSection._id,
                                            }
                                        },
                                        {new:true})
                                        .populate("subSection");
        return res.status(200).json({
            success:true,
            message:"Sub Section created successfully"
        })
        

    } catch(err){
        return res.status(500).json({
            success:true,
            message:"Error while creating sub section, please try again",
            error:err.message
        })
    }
}

exports.updateSubSection = async (req,res) =>{
    try{
        
        return res.status(200).json({
            success:true,
            message:"Sub Section updated successfully"
        })
        

    } catch(err){
        return res.status(500).json({
            success:true,
            message:"Error while updating sub section, please try again",
            error:err.message
        })
    }
}