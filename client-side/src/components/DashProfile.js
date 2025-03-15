import { Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserFailure, updateUserStart, updateUserSuccess, } from '../redux/user/UserSlice'

export default function DashProfile() {

    const { currentUser } = useSelector((state) => state.user)
    
    const [imageFile, setImageFile] = useState('')
    const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handelImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(e.target.files[0])
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage(imageFile);
        }
    }, [imageFile,])

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.keys(formData).length === 0) {
            alert('No changes made');
            return;
        }
        try {
            dispatch(updateUserStart())
            const res = await fetch(`http://localhost:4000/user/update/${currentUser._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    profilePicture: imageFileUrl
                })
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(updateUserFailure(data.message))
            } else {
                dispatch(updateUserSuccess(data))
            }
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }    

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>

            <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                <input type="file" accept='image/*' onChange={handelImageChange} ref={filePickerRef} hidden />

                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    <img src={imageFileUrl || currentUser.profilePicture} alt="img" className='rounded-full w-full h-full object-cover border-8 border-[#746e6e]' />
                </div>

                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} readOnly/>
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />

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