const express = require ('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require ('../middlewares/authMiddleware');
const {
    createUser,
    loginUserCtrl,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logOut,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdminCtrl,
    getAddress,
    userCart
} = require ('../controllers/user.Ctrl');

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);
router.post('/cart', userCart);
router.put('/password', authMiddleware, updatePassword);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

router.get('/all-users', getAllUser);
router.get ('/refresh', handleRefreshToken);
router.get ('/logout', logOut);
router.get ('/:id', authMiddleware, isAdmin, getUser);

router.put ('/edit-user',authMiddleware, updateUser);
router.put ('/save-address',authMiddleware, getAddress);
router.put ('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put ('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);

router.delete ('/:id', deleteUser);

module.exports = router;