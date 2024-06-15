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
}