import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
dotenv.config();

const app = express();

app.use(express.json());

mongoose
.connect(process.env.MONGO)
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.use((err, req,res, next)=>{
    const statusCode= err.statusCode || 500;
    const mesage= err.message || 'Internal Server error'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})



app.listen(8080,()=>{
    console.log('Server Connected')
})