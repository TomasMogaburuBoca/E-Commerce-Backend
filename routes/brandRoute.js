const express = require ('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require ('../middlewares/authMiddleware');
const {
    createBrand,
    getAllBrand,
    getBrand,
    updateBrand,
    deleteBrand
} = require ('../controllers/brand.Ctrl');

router.post ('/',authMiddleware, isAdmin, createBrand);

router.get ('/', getAllBrand);
router.get ('/:id', getBrand);

router.put ('/:id', authMiddleware, isAdmin, updateBrand);

router.delete ('/:', authMiddleware, isAdmin, deleteBrand);

module.exports = router;