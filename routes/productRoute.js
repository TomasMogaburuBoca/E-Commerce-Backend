const express = require ('express');
const router = express.Router();
const { isAdmin,authMiddleware } = require('../middlewares/authMiddleware');
const { createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages,
    deleteImages
} = require ('../controllers/product.Ctrl');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');


router.get ('/', getAllProducts);
router.get ('/:id', getProduct);
router.put ('/upload',authMiddleware, isAdmin, uploadPhoto.array('images',10), productImgResize, uploadImages)

router.post ('/', authMiddleware, isAdmin, createProduct);

router.put ('/:id',authMiddleware, isAdmin, updateProduct);
router.put ('/wishlist', authMiddleware, addToWishList);
router.put ('/rating', authMiddleware, rating);

router.delete ('/:id',authMiddleware, isAdmin, deleteProduct);
router.delete ('/delete-image/:id',authMiddleware, isAdmin, deleteImages);

module.exports = router;