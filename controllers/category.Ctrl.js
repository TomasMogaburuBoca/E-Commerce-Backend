const Category = require ('../models/categoryModal')
const asyncHandler = require ('express-async-handler');
const validateMongoDbId = require("../utils/validateMongoDbId");
const { default: mongoose } = require('mongoose');


const createCategory = asyncHandler (async (req, res) =>{
    try {
        const createCategory = await Category.create (req.body)
        res.json(createCategory)
    } catch (error) {
        throw new Error (error)
    }
});

const getAllCategories = asyncHandler (async (req, res) =>{
    try {
        const getAllCategories = await Category.find()
        if(getAllCategories){res.json(getAllCategories)}
    } catch (error) {
        throw new Error (error)
    }
})

const getCategory = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId(id);
    validateMongoDbId(objectId);
    try {
        const getCategory = await Category.findById ( objectId )
        if (getCategory){res.json (getCategory)}
    } catch (error) {
        throw new Error (error)
    }
});

const updateCategory = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId(objectId);
    try {
        const updateCategory = await Category.findOneAndUpdate
        ( objectId, req.body,{new: true} );
        res.json (updateCategory);
    } catch (error) {
        throw new Error (error);
    }
});

const deleteCategory = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId(id);
    validateMongoDbId(objectId);
    try {
        const deleteCategory = await Category.findOneAndDelete(objectId);
        res.json(deleteCategory)
    } catch (error) {
        throw new Error (error)
    }
})

module.exports = {createCategory, getAllCategories, getCategory,updateCategory, deleteCategory}