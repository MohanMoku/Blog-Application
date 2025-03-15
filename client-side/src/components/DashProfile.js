import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signoutSuccess
} from '../redux/user/UserSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function DashProfile() {

    const { currentUser, error, loading } = useSelector((state) => state.user)

    const [imageFile, setImageFile] = useState('')
    const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture)
    const [formData, setFormData] = useState({})
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserDataSuccess, setUpdateUserDataSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModel, setShowModel] = useState(false)
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

        setImageFileUploading(true);
        setImageFileUploadError(null);

        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
        data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: data
        })

        if (!res.ok) {
            setImageFileUploadError('Could not upload image (File must be less than 2MB)')
            setImageFileUploading(false);
            return
        }
        setImageFileUploading(false);

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
        setUpdateUserError(null);
        setUpdateUserDataSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
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
                setUpdateUserError(data.message);
            } else {
                dispatch(updateUserSuccess(data))
                setUpdateUserDataSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            setUpdateUserError(error.message);
        }
    }

    const HandelDeleteUser = async () => {
        setShowModel(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`http://localhost:4000/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handelSignout = async () => {
        try {
            const res = await fetch('http://localhost:4000/user/signout', {
                method: 'POST',
                credentials: 'include',
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signoutSuccess())
            }

        } catch (error) {
            console.log(error);

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

                {imageFileUploadError && (
                    <Alert color='failure'>{imageFileUploadError}</Alert>
                )}

                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} readOnly />
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />

                <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
                    {loading ? 'Loading...' : 'Update'}
                </Button>

                {
                    currentUser.isAdmin && (

                        <Link to={'/create-post'}>
                            <Button type='button' gradientDuoTone='purpleToBlue' className='w-full'>
                                Create a post
                            </Button>
                        </Link>


                    )
                }

            </form>

            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer' onClick={() => setShowModel(true)}>Delete Account</span>
                <span className='cursor-pointer' onClick={handelSignout}>Sign Out</span>
            </div>

            {error && <Alert className='text-red-500'>{error}</Alert>}

            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}

            {updateUserDataSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserDataSuccess}
                </Alert>
            )}

            <Modal show={showModel} onClose={() => setShowModel(false)} size='md' popup>
                <Modal.Header />

                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 mx-auto text-red-500' />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={HandelDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowModel(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>

        </div>
    )
}