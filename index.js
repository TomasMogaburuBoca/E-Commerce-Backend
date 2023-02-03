const express = require ('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require ('dotenv').config();
const authRouter = require ('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
PORT = process.env.PORT || 4000;
dbConnect();


//Setting Postman
app.use (bodyParser.json());
app.use (bodyParser.urlencoded ({extended: false}));


//Routes
app.use('/api/user', authRouter);

app.use (notFound);
app.use (errorHandler)

// Initialize Server
const server = app.listen(PORT, () =>{
    console.log(`Server is running in PORT ${PORT}`);
})
server.on ('error', error => (console.log(error)));