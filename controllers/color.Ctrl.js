const mongoose = require ('mongoose');
const Color = require ('../models/colorModal');
const asyncHandler = require ('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createColor = asyncHandler (async (req, res) =>{
    try {
        const createColor = await Color.create(req.body);
        res.json(createColor)
    } catch (error) {
        throw new Error (error)
    }
});

const getAllColor = asyncHandler (async (req, res) =>{
    try {
        const getAllColor = await Color.find();
        res.json(getAllColor);
    } catch (error) {
        throw new Error (error)
    }
});

const getColor = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const getColor = await Color.findOne (objectId)
        {res.json(getColor)}
    } catch (error) {
        throw new Error (error)
    }
});

const updateColor = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
            const updateColor = await Color.findOneAndUpdate(
                objectId, req.body, {new:true}
            );
            res.json(updateColor)
    } catch (error) {
        throw new Error (error)
    }
});

const deleteColor = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const deleteColor = await Color.findOneAndDelete (objectId);
        res.json(deleteColor);
    } catch (error) {
        throw new Error (error)
    }
});

module.exports = { createColor, getAllColor, getColor, updateColor, deleteColor };