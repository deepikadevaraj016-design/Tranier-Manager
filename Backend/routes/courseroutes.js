const express =  require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')
const authMiddleware = require('../middleware/authmiddleware')

router.post("/", authMiddleware,courseController.createCourse);      
router.get("/", authMiddleware,courseController.getCourse);           
router.get("/:id",authMiddleware, courseController.getCourseById);    
router.put("/:id", authMiddleware,courseController.updateCourse);     
router.delete("/:id", authMiddleware,courseController.deleteCourse);  
module.exports = router