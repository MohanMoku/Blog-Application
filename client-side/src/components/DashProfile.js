import { Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function DashProfile() {

    const { currentUser } = useSelector((state) => state.user)
    const [imageFile , setImageFile] = useState('')
    const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture)
    
    const filePickerRef = useRef()

    const handelImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImageFile(e.target.files[0])
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(()=>{
        if(imageFile){
            uploadImage(imageFile);
        }
    }, [imageFile])

    const uploadImage = async (file) => {
        
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
        data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: data
        })

        const imageUrlData = await res.json()
        setImageFileUrl(imageUrlData.secure_url)
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>

            <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>

            <form className='flex flex-col gap-4'>

                <input type="file" accept='image/*' onChange={handelImageChange} ref={filePickerRef} hidden/>

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    <img src={imageFileUrl} alt="img" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>

                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
                <TextInput type='password' id='password' placeholder='password' />

                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>

            </form>

            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}