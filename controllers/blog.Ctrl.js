const Blog = require ("../models/blogModal");
const User = require ('../models/userModel');
const asyncHandler = require ('express-async-handler');
const validateMongoDbId = require("../utils/validateMongoDbId");
const { default: mongoose } = require("mongoose");

const createBlog = asyncHandler (async (req, res) =>{
    try {
        const newBlog = await Blog.create (req.body);
        res.json({newBlog});
    } catch (error) {
        throw new Error (error);
    }
});

const getAllBlog = asyncHandler (async (req, res) =>{
    try {
        const blogs = await Blog.find();
        res.json (blogs)
    } catch (error) {
        throw new Error (error)
    }
})

const updateBlog = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate (id, req.body, {
            new: true
        });
        res.json({updateBlog});
    } catch (error) {
        throw new Error (error);
    }
});

const getBlog = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findOne({id})
            .populate("likes")
            .populate("dislikes");
        await Blog.findByIdAndUpdate (id,
            {$inc: {numViews: 1}},
            {new: true}
            );
        res.json(getBlog);
    } catch (error) {
        throw new Error (error);
    }
});

const deleteBlog = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    const objectId = await mongoose.Types.ObjectId ({id})
    try {
        const deleteBlog = await Blog.findByIdAndDelete (objectId);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error (error);
    }
});


const likeBlog = asyncHandler(async (req, res) => {
    try {
    const { blogId } = req.body;
    const objectId = await mongoose.Types.ObjectId(blogId);
    console.log(objectId);
    validateMongoDbId(objectId);

    //Find the blog which you want to be like
    const blog = await Blog.findOne(objectId);
    console.log(blog);

    //find the login user
    const loginUserId = req?.user?._id;

    //Find if the user has liked the blog
    const isLiked = blog?.isLiked;

    if (isLiked) {
        const updatedBlog = await Blog.findOneAndUpdate(
        objectId,
        {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
        { new: true }
        );
        res.json(updatedBlog);
    } else {
        const updatedBlog = await Blog.findOneAndUpdate(
        objectId,
        {
            $push: { likes: loginUserId },
            isLiked: true,
        },
        { new: true }
        );
        res.json(updatedBlog);
    }
    } catch (error) {
    res.status(500).json({ message: 'Server Error' });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    try {
    const { blogId } = req.body;
    const objectId = await mongoose.Types.ObjectId(blogId);
    console.log(objectId);
    validateMongoDbId(objectId);

    //Find the blog which you want to be like
    const blog = await Blog.findOne(objectId);
    console.log(blog);

    //find the login user
    const loginUserId = req?.user?._id;

    //Find if the user has liked the blog
    const isDisliked = blog?.isDisliked;

    if (isDisliked) {
        const updatedBlog = await Blog.findOneAndUpdate(
        objectId,
        {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
        { new: true }
        );
        res.json(updatedBlog);
    } else {
        const updatedBlog = await Blog.findOneAndUpdate(
        objectId,
        {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        },
        { new: true }
        );
        res.json(updatedBlog);
    }
    } catch (error) {
    res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = { createBlog, getAllBlog, updateBlog, getBlog, deleteBlog, likeBlog, dislikeBlog }