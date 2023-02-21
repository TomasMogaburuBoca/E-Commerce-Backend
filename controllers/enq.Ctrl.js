const mongoose = require ('mongoose');
const Enquiry = require ('../models/enqModal');
const asyncHandler = require ('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createEnquiry = asyncHandler (async (req, res) =>{
    try {
        const createEnquiry = await Enquiry.create(req.body);
        res.json(createEnquiry)
    } catch (error) {
        throw new Error (error)
    }
});

const getAllEnquiry = asyncHandler (async (req, res) =>{
    try {
        const getAllEnquiry = await Enquiry.find();
        res.json(getAllEnquiry);
    } catch (error) {
        throw new Error (error)
    }
});

const getEnquiry = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const getEnquiry = await Enquiry.findOne (objectId)
        {res.json(getEnquiry)}
    } catch (error) {
        throw new Error (error)
    }
});

const updateEnquiry = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
            const updateEnquiry = await Enquiry.findOneAndUpdate(
                objectId, req.body, {new:true}
            );
            res.json(updateEnquiry)
    } catch (error) {
        throw new Error (error)
    }
});

const deleteEnquiry = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    const objectId = await mongoose.Types.ObjectId (id);
    validateMongoDbId (objectId);
    try {
        const deleteEnquiry = await Enquiry.findOneAndDelete (objectId);
        res.json(deleteEnquiry);
    } catch (error) {
        throw new Error (error)
    }
});

module.exports = { createEnquiry, getAllEnquiry, getEnquiry, updateEnquiry, deleteEnquiry };