require('dotenv').config()
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

const PORT = process.env.PORT || 4000
app.use(
    cors({
        origin: process.env.ALLOWED_CLIENTS,//["http://localhost:3000"],
        methods: ['GET','POST','PATCH'],
        credentials: true
    })
)
app.get('/hello', function(req, res){
    res.send("Hello World!");
 });
 const userRouter = require('./routes/userRouter')
 const paymentRouter = require('./routes/paymentRouter')

app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)
app.use('/api', require('./routes/upload'))

//Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) console.log("Error: ",err);
    console.log("Connected to mongodb")
})

app.listen(PORT, () =>{
    console.log('Server is running on port ', PORT);
    // console.log(process.env.ALLOWED_CLIENTS)
})