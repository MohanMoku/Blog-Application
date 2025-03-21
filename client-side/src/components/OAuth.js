import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { fireBase } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/UserSlice'
import { useNavigate } from 'react-router-dom'
import {normalizeUserData} from '../utils/userUtils'

const OAuth = () => {
    
    const dispatch = useDispatch()
    const auth = getAuth(fireBase)
    const navigate = useNavigate()    
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
            prompt: 'select_account'
        })

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('http://localhost:4000/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                })
            })

            const data = await res.json()
            if(res.ok){
                const normalizedData = normalizeUserData(data)
                dispatch(signInSuccess(normalizedData))
                navigate('/')
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Button type='button' gradientDuoTone='purpleToBlue' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth