import { useState } from 'react';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
export default function CreateListing() {

    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user)
    const [files, setFiles]= useState([]);
    const [formData, setFormData]= useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type : 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,

    });
    // console.log(formData)
    


    const [imageUploadError, setImageUploadError]= useState(false);
    const [uploading , setUploading]= useState(false);
    const [error, setError]= useState(false);
    const [loading, setLoading]= useState(false);

    const handleImageSubmit = (e)=>{
        if(files.length > 0 && (files.length + formData.imageUrls.length) <7){
            setUploading(true);
            setImageUploadError(false)
            const promise = [];

            for(let i = 0; i < files.length; i++){
                promise.push(uploadFile(files[i]));
            }

            Promise.all(promise).then((urls)=>{
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
                
            }).catch((err)=>{
                setImageUploadError('Image upload failed (4 mb max per image)');
                setUploading(false);
            })

            
    }
    else{
        setImageUploadError('You can only upload up to 6 images per listing');
        setUploading(false);
    }
};

const uploadFile = async(file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime()+ file.name; // to get unique filename with time
        const storageRef = ref(storage, fileName);
        const uploadTask  = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
           console.log(`Upload is ${progress}% done`)
        },
        (error)=>{
            reject(error);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                resolve(downloadURL)
            })
        })
    })
}

    const handleRemoveImage = (index) => {
        setFormData({
           ...formData,
            imageUrls: formData.imageUrls.filter((_,i)=> i!== index), 

            })
        }


    const handleChange= (e)=>{
        if(e.target.id ==='sale' || e.target.id ==='rent'){
            setFormData({
               ...formData,
                type: e.target.id,
            })
        }

        if(e.target.id ==='parking' || e.target.id ==='offer'|| e.target.id ==='furnished'){
            setFormData({
               ...formData,
                [e.target.id]: e.target.checked,
            })
        }

        if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
            setFormData({
               ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }

    const handleSubmit =async(e) => {
        e.preventDefault();

        try {
            if(formData.imageUrls.length <1 ) return setError('You must upload at least one image');
            if(formData.regularPrice < formData.discountPrice) return setError('Discount price must be less than regular price');
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });

            const data = await res.json();
            console.log(data)
            setLoading(false);


            if(data.success === false){
                setError(data.message);
            }


            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


    

  return (
    // main tag because to make site SEO friendly
    <main className='p-3 max-w-4xl mx-auto '>
        <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
        
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder='Name' id='name' maxLength='62' minLength='10' className='border p-3 rounded-lg' required  
                onChange={handleChange} value={formData.name}/>
                <textarea type="text" placeholder='Description' id='description' className='border p-3 rounded-lg' required
                onChange={handleChange} value={formData.description} />
                <input type="text" placeholder='Address' id='address' maxLength='62' minLength='10' className='border p-3 rounded-lg' required
                onChange={handleChange} value={formData.address} />

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-4' onChange={handleChange} checked={formData.type==='sale'}/>
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-4' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking spot</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-4' onChange={handleChange} checked={formData.rent} />
                        <span>Rent</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-4' onChange={handleChange} checked={formData.furnished}/>
                        <span>Furnished</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-4' onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required 
                        onChange={handleChange} value={formData.bedrooms}/>
                        <p>Bedrooms</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required 
                        onChange={handleChange} value={formData.bathrooms}/>
                        <p>Bathrooms</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='50' max='100000' required
                        onChange={handleChange} value={formData.regularPrice} />
                        <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>($/month)</span>
                        </div>
                        
                    </div>

                    {formData.offer && (
                        <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discountPrice' min='0' max='100000' required 
                        onChange={handleChange} value={formData.discountPrice}/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>

            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>

                <div className="flex gap-4 ">
                    <input onChange={(e)=> setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover: shadow-lg disabled:opacity-80'>
                       {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                <p className='text-red-700 text-sm'> {imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>
                        <div key={url} className='flex justify-between '>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                            <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 hover: opacity-95'>Delete</button>
                        </div>
                    )
                }

                <button disabled={loading || uploading} className='bg-slate-700 text-white p-3 rounded-lg cursor-pointer hover:opacity-95 disabled:opacity-80 mt-2'>
                {loading ? 'Creating...' : 'Create Listing'}
                </button>

                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            
          
        </form>
    </main>
  )
}