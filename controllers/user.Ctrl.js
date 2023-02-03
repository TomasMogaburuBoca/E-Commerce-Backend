const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const { generateToken } = require ('../config/jwToken');

const createUser = asyncHandler (async (req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);
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
        res.json ({
            _id: findUser?._id,
            name: findUser?.name,
            surname: findUser?.surname,
            email: findUser?.email,
            token: generateToken(findUser?._id)
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
    // console.log(id);
    try {
        const getUser = await User.findById(id);
        res.json({getUser});
    } catch (error) {
        throw new Error ('Single User not found');
    }
});

//Update user

const updateUser = asyncHandler (async (req, res) =>{
    const {id} = req.params;
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
        {
            name: req?.body?.name,
            email: req?.body?.email
        },
        {
            new: true
        });
        res.jason({updateUser});
    } catch (error) {
        throw new Error ('Update is unsuccessfully')
    }
})

//Delete a single User

const deleteUser = asyncHandler (async (req, res) =>{
    const {id} = req.params;
    // console.log(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    } catch (error) {
        throw new Error ('Single User not delete');
    }
});

module.exports = { createUser, loginUserCtrl, getAllUser, getUser,updateUser , deleteUser }