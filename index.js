const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const dotenv = require('dotenv')
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoutes')
const postRoute = require('./routes/postRoutes')
const commentRoute = require('./routes/commentRoutes')
const cookieParser = require('cookie-parser')
const multer= require('multer')
const cors = require('cors')
const path=require("path")


//database connection
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is connected successfully');
    }catch(err){
        console.log(err);
    }
}

//middlewares
dotenv.config();
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute)
app.use('/api/posts',postRoute)
app.use('/api/comments',commentRoute)

//File upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})

app.listen(process.env.PORT , () => {
    connectDB();
    console.log(`App is running on port ${process.env.PORT || 5000}...`)
})