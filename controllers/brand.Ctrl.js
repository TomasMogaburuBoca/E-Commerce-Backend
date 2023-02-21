const mongoose = require ('mongoose');
const Brand = require ('../models/brandModal');
const asyncHandler = require ('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createBrand = asyncHandler (async (req, res) =>{
    try {
        const createBrand = await Brand.create(req.body);
        res.json(createBrand)
    } catch (error) {
        throw new Error (error)
    }
});

const getAllBrand = asyncHandler (async (req, res) =>{
    try {
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    } catch (error) {
        throw new Error (error)
    }
});

const getBrand = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const getBrand = await Brand.findOne (objectId)
        {res.json(getBrand)}
    } catch (error) {
        throw new Error (error)
    }
});

const updateBrand = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
            const updateBrand = await Brand.findOneAndUpdate(
                objectId, req.body, {new:true}
            );
            res.json(updateBrand)
    } catch (error) {
        throw new Error (error)
    }
});

const deleteBrand = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const deleteBrand = await Brand.findOneAndDelete (objectId);
        res.json(deleteBrand);
    } catch (error) {
        throw new Error (error)
    }
});

module.exports = { createBrand, getAllBrand, getBrand, updateBrand, deleteBrand }