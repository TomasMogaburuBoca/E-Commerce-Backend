const { mongoose } = require ('mongoose');
mongoose.set('strictQuery', true)


const dbConnect = () =>{
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('DB Connected successfully');
    } catch (error) {
        console.log('DB FAIL');
    }
};

module.exports = dbConnect;