const Course = require("../models/Course");
const Category = require("../models/Categories");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader"); 

exports.createCourse = async (req,res) =>{
    try{
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price,category} = req.body;
        
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price ||!category ||!thumbnail) {
            return res.status(400).json({
                success:false,
                message:"all fields required",
            });
        };

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"instructor not found",
            })
        }
        console.log("instructor details",instructorDetails);

        // check given tag is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"category not found",
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME); 

        // create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url
        });

        // add the nre course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {$push:{
                courses:newCourse._id,
            }},
            {new:true}
        );

        // update the Tag Schema
        await Tag.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {$push:{
                course:newCourse._id,
            }},
            {new:true}
        );

        return res.status(200).json({
            success:false,
            message:"Course Created Successfully",
            data:newCourse
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"failed to create course",
            error:err.message
        })
    }
}

exports.showAllCourse = async (req,res) =>{
    try{

        const allCourses = await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReview:true,
                                                studentsEnrolled:true})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses
        });

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:err.message
        })
    }
}