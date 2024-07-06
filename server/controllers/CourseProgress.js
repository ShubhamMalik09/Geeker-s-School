const SubSection = require("../models/SubSection")


exports.updateCourseProgress = async(req,res) =>{
    const {courseId,subSectionId} = req.body;
    const userId = req.user.id;

    try{
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(400).json({
                error:"Invalid SubSection"
            });
        }

        let courseProgress = await CourseProgress.fndOne({
            courseId:courseId,
            userId:userId,
        });

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course Progress does not exist"
            });
        }
        else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"SubSection already completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId);
        }
        await courseProgress.save();
        return res.status(200).json({
            success:true,
        })
    } catch(err){
        return res.status(400).json({
            error:"Internal Server Error"
        })
    }
}