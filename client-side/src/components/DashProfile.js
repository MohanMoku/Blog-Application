import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
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
    // Get user state from Redux
    const { currentUser, } = useSelector((state) => state.user)
    
    // State management
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(currentUser?.profilePicture || '')
    const [formData, setFormData] = useState({})
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserDataSuccess, setUpdateUserDataSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false) // Fixed typo in variable name
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handleImageChange = (e) => { // Fixed typo in function name
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setImageFileUploadError('File size must be less than 2MB')
                return
            }
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
        
    }

    const uploadImage = useCallback(async () => {
        try {
            setImageFileUploading(true)
            setImageFileUploadError(null)

            const data = new FormData()
            data.append('file', imageFile)
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
            data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: data
            })

            const imageData = await res.json()
            if (!res.ok) {
                throw new Error(imageData.message || 'Could not upload image')
            }
            setImageFileUrl(imageData.secure_url)

        } catch (error) {
            setImageFileUploadError('Could not upload image (File must be less than 2MB)')
        } finally {
            setImageFileUploading(false)
        }
    }, [imageFile]) // Add imageFile as a dependency since it's used inside the function

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile, uploadImage]) // Add uploadImage to the dependency array

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim()
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload')
            return
        }

        if (Object.keys(formData).length === 0 && imageFileUrl === currentUser.profilePicture) {
            setUpdateUserError('No changes made')
            return
        }

        try {
            dispatch(updateUserStart())
            const res = await fetch(`http://localhost:4000/user/update/${currentUser._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    profilePicture: imageFileUrl
                })
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message)
            }

            dispatch(updateUserSuccess(data))
            setUpdateUserDataSuccess("User's profile updated successfully")
            setUpdateUserError(null)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

    const handleDeleteUser = async () => { // Fixed typo in function name
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`http://localhost:4000/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message)
            }
            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignout = async () => { // Fixed typo in function name
        try {
            const res = await fetch('http://localhost:4000/user/signout', {
                method: 'POST',
                credentials: 'include',
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message)
            }
            dispatch(signoutSuccess())
        } catch (error) {
            console.error('Signout error:', error)
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept='image/*' 
                    onChange={handleImageChange} 
                    ref={filePickerRef} 
                    hidden 
                />
                <div 
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" 
                    onClick={() => filePickerRef.current.click()}
                >
                    <img 
                        src={imageFileUrl || currentUser.profilePicture} 
                        alt="profile" 
                        className='rounded-full w-full h-full object-cover border-8 border-[#746e6e]' 
                        onChange={handleImageChange}
                    />
                </div>

                {imageFileUploadError && (
                    <Alert color='failure'>{imageFileUploadError}</Alert>
                )}

                <TextInput 
                    type='text' 
                    id='username' 
                    placeholder='username' 
                    defaultValue={currentUser.username} 
                    onChange={handleChange} 
                />
                <TextInput 
                    type='email' 
                    id='email' 
                    placeholder='email' 
                    defaultValue={currentUser.email} 
                    onChange={handleChange} 
                    readOnly 
                />
                <TextInput 
                    type='password' 
                    id='password' 
                    placeholder='password' 
                    onChange={handleChange} 
                />

                <Button 
                    type='submit' 
                    gradientDuoTone='purpleToBlue' 
                    outline 
                    disabled={imageFileUploading}
                >
                    {imageFileUploading ? 'Loading...' : 'Update'}
                </Button>

                {currentUser.isAdmin && (
                    <Link to={'/create-post'}>
                        <Button 
                            type='button' 
                            gradientDuoTone='purpleToBlue' 
                            className='w-full'
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>

            <div className="text-red-500 flex justify-between mt-5">
                <span 
                    className='cursor-pointer' 
                    onClick={() => setShowModal(true)}
                >
                    Delete Account
                </span>
                <span 
                    className='cursor-pointer' 
                    onClick={handleSignout}
                >
                    Sign Out
                </span>
            </div>

            {/* {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )} */}

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

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}