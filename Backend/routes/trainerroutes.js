const express =  require("express")
const router = express.Router()

const trainerController = require('../controllers/trainercontroller');
const   authMiddleware = require("../middleware/authmiddleware")

router.post('/',authMiddleware, trainerController.createTrainer);
router.get('/', authMiddleware, trainerController.getTrainer);
router.put('/:id',authMiddleware, trainerController.updateTrainer);
router.delete('/:id',authMiddleware, trainerController.deleteTrainer);

module.exports=router
