const Category = require("../models/Categories");


exports.createCategory = async (req,res) =>{
    try{
        const {name,description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        };

        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"created successfully"
        });


    } catch (err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.showAllCategories = async (req,res) =>{
    try{
        const allTags = await Category.find({},{name:true, description:true});

        return res.status(200).json({
            success:true,
            message:"All Categories returned successfully",
            tags:allTags,
        })

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};

exports.categoryPageDetails = async (req,res) =>{
    try{
        const {CategoryId} = req.body;
        const selectedCategory= await Category.findById(CategoryId)
                                                .populate("courses")
                                                .exec();
        if(!selectedCategory){
            console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
        }

        if(selectedCategory.courses.length===0){
            console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
        }

        const selectedCourse = selectedCategory.courses;

        const categoriesExceptSelected = await Category.find(
            {_id:{$ne:CategoryId},})
            .populate("courses");

        let differentCourses = [];
        for(const category of categoriesExceptSelected){
            differentCourses.push(...category.courses);
        }

        const allCategories = await Category.find().populate("courses");
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
                            .sort((a,b) => b.sold - a.sold)
                            .slice(0,10);
        
        res.status(200).json({
            selectedCourses: selectedCourse,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
        });
        } catch(err){
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
    }
}