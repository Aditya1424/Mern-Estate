import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser'
import path from 'path';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


mongoose
.connect(process.env.MONGO)
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve();

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname,'/client/dist')))

app.use('*', (req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})

app.use((err, req,res, next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || 'Internal Server error'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})



app.listen(8080,()=>{
    console.log('Server Connected')
})