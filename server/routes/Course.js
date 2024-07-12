const express = require("express");
const router = express.Router();

const {createCourse, getAllCourses, getCourseDetails , editCourse, getFullCourseDetails, getInstructorCourses, deleteCourse} = require("../controllers/Course");
const {showAllCategories, createCategory, categoryPageDetails} = require("../controllers/Category");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/SubSection");
const {createRating, getAverageRating, getAllRatingReview} = require("../controllers/RatingAndReview");
const {auth, isInstructor, isStudent, isAdmin} = require("../middleware/auth");
const {updateCourseProgress} = require("../controllers/CourseProgress")


router.post("/createCourse",auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
router.delete("/deleteCourse", deleteCourse)

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview)


module.exports = router;
