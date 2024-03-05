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



app.listen(8080,()=>{
    console.log('Server Connected')
})