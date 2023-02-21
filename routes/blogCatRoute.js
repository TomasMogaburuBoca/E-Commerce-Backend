const express = require ('express');
const { authMiddleware, isAdmin } = require ('../middlewares/authMiddleware')
const {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/blogCat.Ctrl');
const router = express.Router();

router.post('/',authMiddleware, isAdmin, createCategory);

router.get('/categories', getAllCategories);
router.get('/:id', getCategory);

router.put('/:id',authMiddleware, isAdmin, updateCategory)

router.delete('/:id',authMiddleware, isAdmin, deleteCategory)

module.exports = router;