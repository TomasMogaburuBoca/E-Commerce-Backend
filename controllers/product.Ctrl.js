const ProductESchema = require  ('../models/productModel');
const User = require  ('../models/userModel');
const asyncHandler= require ('express-async-handler');
const slugify = require ('slugify');
const { default: mongoose } = require('mongoose');
const validateMongoDbId = require ('../utils/validateMongoDbId')
const { cloudinaryUploadingImg, cloudinaryDeleteImg }= require('../utils/cloudinary');

const createProduct = asyncHandler (async (req, res) =>{
    try {
        if (req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await ProductESchema.create(req.body);
        res.json ( newProduct )
    } catch (error) {
        throw new Error (error)
    }
});

const getProduct = asyncHandler (async (req, res) =>{
    try {
        const { id } = req.params
        const findProduct = await ProductESchema.findById(id);
        res.json ( findProduct )
    } catch (error) {
        throw new Error (error)
    }
});

const getAllProducts = asyncHandler (async (req, res) =>{
    try {

        //Filtering
        const queryObject = { ...req.query };
        const excludesFields = [ 'page', 'sort', 'limits', 'fields' ];
        excludesFields.forEach ((el) => delete queryObject [el]);
        let queryString = JSON.stringify (queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
            console.log(JSON.parse(queryString));

        let query = ProductESchema.find (JSON.parse(queryString));


        //Sorting
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort (sortBy);
        }else{
            query = query.sort('-createdAt');
        }

        //Limiting the fields
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select (fields);
        }else{
            query = query.select ('-__v');
        };

        //Pages
        const page = req.query.page;
        const limit = req.query.limit;
        const  skip = (page -1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const productCount = await ProductESchema.countDocuments();
            if(skip >= productCount){throw new Error ('This page does not exist');}
        }

        const product = await query;
        res.json ( product )
    } catch (error) {
        throw new Error (error);
    }
});

const updateProduct = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    try {
        if (req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await ProductESchema.findByIdAndUpdate (id, req.body,
            { new:true });
        res.json (updateProduct);
    } catch (error) {
        throw new Error (error)
    }
});

const deleteProduct = asyncHandler (async (req, res) =>{
    const { id } = req.params;
    try {
        const deleteProduct = await ProductESchema.findByIdAndDelete (id);
        res.json (deleteProduct);
    } catch (error) {
        throw new Error (error);
    }
});

const addToWishList = asyncHandler (async (req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    const userId = await mongoose.Types.ObjectId(_id)
    const { prodId } = req.body
    try {
        const user = await User.findOne (userId);
        console.log(user);
        const alreadyAdded = await user.wishlist.find ((productId) => productId.toString() === prodId);
        if (alreadyAdded){
            let user = await User.findByIdAndUpdate (
                userId,
                {$pull: {wishlist: prodId}},
                {new: true}
            );
            res.json(user)
        }else{
            let user = await User.findByIdAndUpdate (
                userId,
                {$push: {wishlist: prodId}},
                {new: true}
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error (error)
    }
});

const rating = asyncHandler (async (req, res) =>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    const { star, prodId } = req.body;
    const product = await ProductESchema.findById (prodId);
    let alreadyRated = product.ratings.find(
        (userId) => userId.toString() === _id.toString()
    )
try {
    if (alreadyRated){
        const updateRating = await ProductESchema.findOne(
            {
                ratings:{ $elemMatch: alreadyRated },
            },
            {
                $set: {"ratings.$.star": star}
            },
            {new: true}
            );
            res.json(updateRating);
    }else{
        const rateProduct = await ProductESchema.findByIdAndUpdate(
            prodId,
            {$push:
                {ratings:
                    {
                    star: star,
                    postedBy:_id
                    }
                }
            },
            {new: true}
            );
        res.json(rateProduct)
    }
} catch (error) {
    throw new Error (error)
}
});

const uploadImages = asyncHandler (async (req, res) =>{
    try {
        const uploader = (path) => cloudinaryUploadingImg(path, 'images');
        const urls = [];
        const files = req.files;
        const fileValues = Object.values(files);
        for (const file of fileValues){
            const { path } = file;
            const newPath = await uploader(path);
            console.log(newPath);
            urls.push(newPath);
        };
        const images = urls.map((file) =>{
            return file;
        });
        res.json(images);
    } catch (error) {
        throw  new Error (error)
    }
});

const deleteImages = asyncHandler (async (req, res) =>{
    const {id} =req.params
    try {
        const deleted = cloudinaryDeleteImg(id, 'images');
        res.json({message: "Deleted"})
    } catch (error) {
        throw  new Error (error)
    }
});

module.exports= {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages,
    deleteImages
}