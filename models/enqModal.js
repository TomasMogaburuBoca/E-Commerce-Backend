const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var enqSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true },
        email: {
            type: String,
            required: true, unique: true},
        mobile: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "Submitted",
            enum: ['Submitted', 'Contacted', 'In progress']
        }
    },{timestamps: true}
    );


module.exports= mongoose.model ('Enquiry', enqSchema)