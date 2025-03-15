import { Alert, Button, FileInput, Textarea, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {

    const [file, setFile] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(false)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()

    const handleUploadImage = async () => {

        try {

            if (!file) {
                setImageUploadError('Please select an image')
                return
            }

            setImageUploadError(null)
            setImageUploadProgress(true)

            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
            data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: data
            })

            if (!res.ok) {
                console.log('Could not upload image');
                setImageUploadProgress(false)
                return
            }

            const imageUrlData = await res.json()
            console.log(imageUrlData.secure_url);
            setFormData({ ...formData, image: imageUrlData.secure_url })
            setImageUploadProgress(false)

        } catch (error) {
            setImageUploadError('Could not upload image')
            console.log(error);
            setImageUploadProgress(false)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:4000/post/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                setPublishError(data.message)
                return
            }

            if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)

            }

        } catch (error) {
            setPublishError('Could not publish post')
        }
    }

    return (
        <div className='min-h-screen p-3 max-w-3xl mx-auto'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextInput type='text' placeholder='Category' required id='category' className='flex-1' 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>

                <div className="flex ga-4 items-center justify-between border-4 border-gray-300 border-dotted p-3">
                    <FileInput type='file' accept='images/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button gradientDuoTone='purpleToBlue' outline type='button' size='sm' onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ?
                                <div className="w-16 h-16">
                                    <CircularProgressbar value={imageUploadProgress} text='*' />
                                </div>
                                : 'Upload Image'
                        }
                    </Button>
                </div>
                {
                    imageUploadError && (
                        <Alert color='failure'>{imageUploadError}</Alert>
                    )
                }

                {
                    formData.image && (
                        <img src={formData.image} alt="img" className='w-full h-96 object-cover' />
                    )
                }

                <Textarea type='text' placeholder='Write Something...' required id='content' className='h-72 mb-12 text-2xl' onChange={(e) => setFormData({ ...formData, content: e.target.value })}/>
                <Button gradientDuoTone='purpleToBlue' type='submit'>
                    Publish
                </Button>

                {
                    publishError && (
                        <Alert className='mt-5' color='failure'>{publishError}</Alert>
                    )
                }

            </form>
        </div>
    )
}

export default CreatePost