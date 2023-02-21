const express = require ('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require ('dotenv').config();
const authRouter = require ('./routes/authRoute');
const productRouter = require ('./routes/productRoute');
const blogRouter = require ('./routes/blogRoute');
const categoryRouter = require ('./routes/categoryRoute');
const blogCatRouter = require ('./routes/blogCatRoute')
const brandRouter = require ('./routes/brandRoute')
const colorRouter = require ('./routes/colorRoute')
const enqRouter = require ('./routes/enqRoute')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require ('morgan');

PORT = process.env.PORT || 4000;
dbConnect();

//Setting Morgan
app.use(morgan('dev'));

//Setting Postman
app.use (bodyParser.json());
app.use (bodyParser.urlencoded ({extended: false}));

//Setting Cookie Parser
app.use(cookieParser());


//Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog-category', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/color', colorRouter);
app.use('/api/enquiry', enqRouter);

app.use (notFound);
app.use (errorHandler)

// Initialize Server
const server = app.listen(PORT, () =>{
    console.log(`Server is running in PORT ${PORT}`);
})
server.on ('error', error => (console.log(error)));