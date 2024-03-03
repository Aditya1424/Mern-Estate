import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
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





app.listen(8080,()=>{
    console.log('Server Connected')
})