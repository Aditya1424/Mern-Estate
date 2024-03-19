import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup = async(req,res,next)=>{
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    // to save the usernames and email addresses and password we have to create a new user object

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try{
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});
    }
    catch(err){
        next(err);
    }
}

export const signin = async(req,res,next)=>{
    const {email, password} = req.body;
    try{
    const validUser = await User.findOne({email});
    if(!validUser){
        return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){
        return next(errorHandler(401, 'Wrong credentials'));
    }
    
    const token = jwt.sign({_id: validUser._id}, process.env.JWT_SECRET);
    // does not show the password field after signin completes
    const {password: pass, ...rest} = validUser._doc;
    res
    .cookie('access_token', token, {httpOnly: true})
    .status(200).json(validUser)
}
catch(err){
    next(err);
}

   
}
