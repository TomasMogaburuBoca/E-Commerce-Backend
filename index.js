const express = require ('express');
const dbConnect = require('./config/dbConnect');
const app = express();
require ('dotenv').config();
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
const handlebars = require ('express-handlebars');
const passport = require ('passport');

PORT = process.env.PORT || 4000;
dbConnect();

//Setting Morgan
app.use(morgan('dev'));

//Setting Postman
app.use (bodyParser.json());
app.use (bodyParser.urlencoded ({extended: false}));

// Setting Handlebars
app.set('view engine', 'hbs');
app.set('views', './views');

const appEngine = app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutDir:__dirname + './views/partials',
    partialsDir: __dirname + './views/partials'
}));
console.log(appEngine);

app.use(express.static('public'));

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