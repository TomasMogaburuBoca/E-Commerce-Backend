const express = require ('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require ('../middlewares/authMiddleware');
const {
    createEnquiry,
    getAllEnquiry,
    getEnquiry,
    updateEnquiry,
    deleteEnquiry
} = require ('../controllers/enq.Ctrl');

router.post ('/',authMiddleware, isAdmin, createEnquiry);

router.get ('/', getAllEnquiry);
router.get ('/:id', getEnquiry);

router.put ('/:id', authMiddleware, isAdmin, updateEnquiry);

router.delete ('/:', authMiddleware, isAdmin, deleteEnquiry);

module.exports = router;