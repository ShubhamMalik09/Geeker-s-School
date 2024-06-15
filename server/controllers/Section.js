const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) =>{
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields required",
            });
        };

        const newSection = await Section.create({sectionName});
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                        courseId,
                                        {
                                            $push:{
                                                courseContent:newSection._id
                                            }
                                        },
                                        {new:true}); 

        return res.status(200).json({
            success:true,
            message:"section created successfully",
            data:updateCourseDetails
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:err.message
        })
    }
}

exports.updateSection = async (req,res) =>{
    try{
        
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields required",
            });
        };

        const section = await Section.findByIdAndUpdate(
                                    sectionId,
                                    {sectionName:sectionName},
                                    {new:true});

        return res.status(200).json({
            success:true,
            message:"section updated successfully", 
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:err.message
        })
    }
}

exports.deleteSection = async (req,res) =>{
    try{
        
        const {sectionId} = req.params ;

        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields required",
            });
        };

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"section deleted successfully", 
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
            error:err.message
        })
    }
}