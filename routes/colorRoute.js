const express = require ('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require ('../middlewares/authMiddleware');
const {
    createColor,
    getAllColor,
    getColor,
    updateColor,
    deleteColor
} = require ('../controllers/color.Ctrl');

router.post ('/',authMiddleware, isAdmin, createColor);

router.get ('/', getAllColor);
router.get ('/:id', getColor);

router.put ('/:id', authMiddleware, isAdmin, updateColor);

router.delete ('/:', authMiddleware, isAdmin, deleteColor);

module.exports = router;