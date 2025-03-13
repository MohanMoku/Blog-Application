import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const SignUp = () => {

  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage('All fields are required')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('http://localhost:4000/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success === false) {
        setErrorMessage(data.message)
        setLoading(false)
        return
      }
      setLoading(false)

      if (res.ok) {
        navigate('/sign-in')
      }

    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
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
            Welcome
          </p>

        </div>

        {/* {rightSide} */}
        <div className='flex-1'>
          <div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

              <div className=''>
                <Label value='Username' />
                <TextInput type='text'
                  placeholder='Enter your username'
                  id='username'
                  // required
                  onChange={handelChange}
                />
              </div>
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
                  ) : 'Sign Up'
                }
              </Button>
              <OAuth />
            </form>
            <div className='flex gap-2 txt-sm mt-5'>
              <span>Have an account</span>
              <Link to={'/sign-in'} className='text-blue-500'>
                Sign In
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

export default SignUp