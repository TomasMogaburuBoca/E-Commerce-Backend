const User = require ('../models/userModel');
const ProductESchema = require ('../models/productModel');
const Cart = require ('../models/cartModal');
const asyncHandler = require ('express-async-handler');
const { generateToken } = require ('../config/jwToken');
const validateMongoDbId = require ('../utils/validateMongoDbId');
const { generateRefreshToken } = require ('../config/refreshToken');
const jwt = require ('jsonwebtoken');
const crypto = require ('crypto');
const sendEmail = require('./email.Ctrl');



const createUser = asyncHandler (async (req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser){
        const newUser = await User.create(req.body);
        //res.json(newUser);
        const newUserParser = JSON.parse(newUser)
        res.render(`'main', {newUserParser}`)///////////////////////////////////////////
    }else {
        throw new Error ('User already exist')
    }
});


const loginUserCtrl = asyncHandler (async(req, res) =>{
    const { email, password} = req.body;
    //console.log(email, password);
    //check if user exist or not
    const findUser = await User.findOne ({email});
    if (findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken (findUser?._id);
        const updateUser = await User.findByIdAndUpdate (findUser.id,{
            refreshToken: refreshToken,
        },
        {new: true});
        res.cookie('refreshToken', refreshToken,
        {
            httpOnly: true,
            maxAge: 72 * 60 *60 * 1000
        })
        // res.json ({
        //     _id: findUser?._id,
        //     name: findUser?.name,
        //     surname: findUser?.surname,
        //     email: findUser?.email,
        //     token: generateToken(findUser?._id)
        // });
        res.render ('main',{
            name: findUser?.name,
            surname: findUser?.surname,
            email: findUser?.email,
        });
    }else{
        throw new Error ('Invalid credential')
    }
});

//Login Admin

const loginAdminCtrl = asyncHandler (async(req, res) =>{
    const { email, password} = req.body;
    //console.log(email, password);
    //check if user exist or not
    const findAdmin = await User.findOne ({email});
    if (findAdmin.role !== 'admin') {throw new Error ('Not authorized')}
    if (findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken (findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate (findAdmin.id,{
            refreshToken: refreshToken,
        },
        {new: true});
        res.cookie('refreshToken', refreshToken,
        {
            httpOnly: true,
            maxAge: 72 * 60 *60 * 1000
        })
        res.json ({
            _id: findAdmin?._id,
            name: findAdmin?.name,
            surname: findAdmin?.surname,
            email: findAdmin?.email,
            token: generateToken(findAdmin?._id)
        });
    }else{
        throw new Error ('Invalid credential')
    }
})

// Get all users

const getAllUser = asyncHandler(async (req, res) =>{
    try {
        const getAllUsers = await User.find()
        res.json(getAllUsers)
    } catch (error) {
        throw new Error (error);
    }
})

//Get a single User

const getUser = asyncHandler (async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    // console.log(id);
    try {
        const getUser = await User.findById(id);
        res.json({getUser});
    } catch (error) {
        throw new Error ('Single User not found');
    }
});

//Handle refresh user

const handleRefreshToken = asyncHandler (async (req, res) =>{
    const cookie = await req.cookies;
    if (!cookie?.refreshToken) throw new Error ('Not refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error ('Not refresh token in DB');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
        if (err || user.id !== decoded.id){
            throw new Error ('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json ({accessToken});
        console.log(decoded);
    })
    res.json (user)
})

//Logout

const logOut = asyncHandler (async (req, res) =>{
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error ('Not refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: '',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);
})


//Update user

const updateUser = asyncHandler (async (req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
        {
            name: req?.body?.name,
            email: req?.body?.email
        },
        {
            new: true
        });
        res.json({updateUser});
    } catch (error) {
        throw new Error ('Update is unsuccessfully')
    }
})

//Delete a single User

const deleteUser = asyncHandler (async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    // console.log(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    } catch (error) {
        throw new Error ('Single User not delete');
    }
});

const blockUser = asyncHandler (async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const blockUser = await User.findByIdAndUpdate (id,
            {isBlocked: true},
            {new: true}
            );
            res.json({
                message: 'User blocked'
            })
    } catch (error) {
        throw new Error (error)
    }
});


const unblockUser = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblockUser = await User.findByIdAndUpdate (id,
            {isBlocked: false},
            {new: false}
            );
            res.json({
                message: 'User unblocked'
            })
    } catch (error) {
        throw new Error (error)
    }
});

const updatePassword = asyncHandler (async (req, res) =>{
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById (_id);
    if (password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    }else {res.json(user)};
})

const forgotPasswordToken = asyncHandler (async (req, res) =>{
    const { email } = req.body;
    const user = await User.findOne ({ email });
    if (!user) throw new Error (error);
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Please follow this link to reset your Password.
        This link is valid till 10' from now. <a href="http://localhost:3000/api/user/reset-password/${token}">Reset you password</a>`
        const data ={
            to:email,
            subject:"forgot password Link",
            text:"Hey User",
            htm:resetUrl
        }
        sendEmail(data);
        res.json(token)
    } catch (error) {
        throw new Error (error)
    }
});

const resetPassword = asyncHandler (async (req, res) =>{
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash ('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error ('Token Expired, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    res.json(user)
});


// Save address
const getAddress = asyncHandler (async (req, res, next) =>{
        const {_id} = req.user;
        validateMongoDbId(_id);
        try {
            const updateAddress = await User.findByIdAndUpdate(
                _id,
            {
                address: req?.body?.address,
            },
            {
                new: true
            });
            res.json(updateAddress);
        } catch (error) {
            throw new Error ('Update is unsuccessfully')
        }
    });

    const userCart = asyncHandler (async (req, res, next)=>{
        const { cart } = req.body
        const {_id} = req.user;
        validateMongoDbId(_id)
        const user = await User.findById (_id);
        try {
            let products = [];

            //check if already have product in cart
            const alreadyExistCart = await Cart.findOne({orderBy:user._id});
            if(alreadyExistCart){
                alreadyExistCart.remove();
            }
            for (let i = 0; i<cart.length; i++){
                let object = {};
                object.products = cart[i]._id;
                object.count = cart[i].count;
                object.color = cart[i].color;
                let getPrice = await Product.findById(cart[i]._id)
                                            .select('price')
                                            .exec();
                object.price = getPrice.price;
                products.push(object)
            }
            console.log(products);
        } catch (error) {
            throw new Error (error)
        }
    });


module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    unblockUser,
    blockUser,
    handleRefreshToken,
    logOut,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdminCtrl,
    getAddress,
    userCart
}