import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/UserSlice'

export default function DasSidebar() {

    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl === 'profile') {
            setTab('profile')
        }
    }, [location.search])

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
                else{
                    dispatch(signoutSuccess())
                }
    
            } catch (error) {
                console.log(error);
                
            }
        }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handelSignout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
