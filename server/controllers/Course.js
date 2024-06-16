const Course = require("../models/Course");
const Category = require("../models/Categories");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader"); 

exports.createCourse = async (req,res) =>{
    try{
        // fetch data
        const userId = req.user.id;
        const {courseName, courseDescription, whatYouWillLearn, price,tag,category,status,instructions} = req.body;
        
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
            return res.status(400).json({
                success:false,
                message:"all fields required",
            });
        };

        if (!status || status === undefined) {
			status = "Draft";
		}

        const instructorDetails = await User.findById(userId,{accountType:"Instructor"});
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
            tag: tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status: status,
			instructions: instructions,
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
        await Category.findByIdAndUpdate(
            {_id: category},
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
};

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
};

exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

exports.getCourseDetails = async (req,res) =>{
    try{
        const {courseId} = req.body;

        const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course wih ${courseId}`
            })
        }

        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:courseDetails,
        })
    } catch(err){
        return res.status(400).json({
            success:false,
            message:err.message,
        })
    }
};