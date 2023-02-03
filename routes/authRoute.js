const express = require ('express');
const router = express.Router();
const { createUser, loginUserCtrl, getAllUser, getUser, updateUser, deleteUser } = require ('../controllers/user.Ctrl');
const { authMiddleware } = require ('../middlewares/authMiddleware')

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUser);
router.get ('/:id', authMiddleware, getUser);
router.put ('/:id', updateUser)
router.delete ('/:id', deleteUser);

module.exports = router;