import { Button, FileInput, Textarea, TextInput } from 'flowbite-react'
import React from 'react'

const CreatePost = () => {

    return (
        <div className='min-h-screen p-3 max-w-3xl mx-auto'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                    <TextInput type='text' placeholder='Category' required id='category' className='flex-1' />
                </div>

                <div className="flex ga-4 items-center justify-between border-4 border-gray-300 border-dotted p-3">
                    <FileInput type='file' accept='images/*' />
                    <Button gradientDuoTone='purpleToBlue' outline type='button' size='sm'>
                        Upload image
                    </Button>
                </div>

                <Textarea type='text' placeholder='Write Something...' required id='content' className='h-72 mb-12 text-2xl'/>
                <Button gradientDuoTone='purpleToBlue' type='submit'>
                    Publish
                </Button>
            </form>
        </div>
    )
}

export default CreatePost