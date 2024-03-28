import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from'react-redux';
import OAuth from '../components/OAuth';
export default function SignIn() {

  const [formData , setFormData]=useState({})
  const {error, loading} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange= (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit= async(e)=>{
    e.preventDefault(); // prevent from refreshing the form page
    try{
      dispatch(signInStart());

      const res= await fetch('/api/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data= await res.json();
      console.log(data)
  
      if(data.success==false) {
        dispatch(signInFailure(data.message));
       
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    }
    catch(error){
      dispatch(signInFailure(error.message));
    }
    
  }

 

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
       
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

        <button disabled={loading} className='bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95'>
          {loading ? 'Loading...' :'Sign In'}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-3 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
        <span className='text-blue-500'>Sign up</span>
        </Link>
        
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}


    </div>
  )
}
