const express = require ('express');
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const  app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
app.use(express.json())
app.use('/auth',require('./Routers/userRouter'))

dotenv.config()
const PORT =  process.env.PORT || 5000;
app.listen(PORT,()=>{console.log(`Server started at port : ${PORT}`)}) 
mongoose.connect(process.env.MDB_CONNECT,(err)=>{

    useNewUrlParser:true
    useUnifiedTopology:true
    if (err) return console.error(err);
    console.log('Conneted to Mongodb')


});
