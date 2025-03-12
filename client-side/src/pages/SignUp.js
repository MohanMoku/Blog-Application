import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'

import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* {leftSide} */}
        <div className='flex-1'>
          <Link to={'/'} className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg'>
              Mohan's
            </span>
            Blog
          </Link>

          <p className='text-lg mt-5 font-bold'>
            Welcome
          </p>

        </div>

        {/* {rightSide} */}
        <div className='flex-1'>
          <div>
            <form className='flex flex-col gap-4'>

              <div className=''>
                <Label value='Username' />
                <TextInput type='text'
                  placeholder='Enter your username'
                  id='username'
                  required
                />
              </div>
              <div className=''>
                <Label value='Email' />
                <TextInput type='email'
                  placeholder='Enter your email'
                  id='email'
                  required
                />
              </div>
              <div className=''>
                <Label value='Password' />
                <TextInput type='password'
                  placeholder='Enter your password'
                  id='password'
                  required
                />
              </div>
              <Button gradientDuoTone='purpleToPink' type='submit'>
                Sign Up
              </Button>
            </form>
            <div className='flex gap-2 txt-sm mt-5'>
              <span>Have an account</span>
              <Link to={'/sign-in'} className='text-blue-500'>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp