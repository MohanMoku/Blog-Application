import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/UserSlice'
import OAuth from '../components/OAuth'
import { normalizeUserData } from '../utils/userUtils'

const SignIn = () => {

  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('All fields are required'))
    }

    try {
      dispatch(signInStart())
      const res = await fetch('http://localhost:4000/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }

      if (res.ok) {
        const normalizedData = normalizeUserData(data)
        dispatch(signInSuccess(normalizedData))
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

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
            Welcome Back
          </p>

        </div>

        {/* {rightSide} */}
        <div className='flex-1'>
          <div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

              <div className=''>
                <Label value='Email' />
                <TextInput type='email'
                  placeholder='Enter your email'
                  id='email'
                  // required
                  onChange={handelChange}
                />
              </div>
              <div className=''>
                <Label value='Password' />
                <TextInput type='password'
                  placeholder='Enter your password'
                  id='password'
                  // required
                  onChange={handelChange}
                />
              </div>
              <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                {
                  loading ? (
                    <><Spinner size='sm' /><span className='pl-3'>Loading...</span></>
                  ) : 'Sign In'
                }
              </Button>

                <OAuth/>
            </form>
            <div className='flex gap-2 txt-sm mt-5'>
              <span>Have an account</span>
              <Link to={'/sign-up'} className='text-blue-500'>
                Sign Up
              </Link>
            </div>
            {
              errorMessage && (
                <Alert color='failure' className='mt-5'>
                  {errorMessage}
                </Alert>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn