import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
dotenv.config();

const app = express();

mongoose
.connect(process.env.MONGO)
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err)
})

app.use('/api/user', userRouter)



app.listen(8080,()=>{
    console.log('Server Connected')
})