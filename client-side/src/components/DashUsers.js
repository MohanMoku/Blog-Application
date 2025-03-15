import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function DashUsers() {

    const { currentUser } = useSelector((state) => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModel, setShowModel] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/getusers`, {
                    credentials: 'include',
                })

                const data = await res.json()

                if (res.ok) {

                    setUsers(data.users)
                    if (data.users.length < 9)
                        setShowMore(false)
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers()
        }

    }, [currentUser])

    const handleShowMore = async () => {
        const startIndex = users.length;

        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/getusers?&startIndex=${startIndex}`, {
                credentials: 'include',
            })
            const data = await res.json()
            if (res.ok) {
                setUsers([...users, ...data.users])
                if (data.users.length < 9)
                    setShowMore(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handelDeleteUser = async () => {
            setShowModel(false)
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/delete/${userIdToDelete}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',

                    })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)
                setUsers(users.filter((user) => user._id !== userIdToDelete))

            } catch (error) {
                console.log(error);

            }
    }


    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full'>
            {
                currentUser.isAdmin && users.length > 0 ? (
                    <div className='min-w-full md:w-auto'> {/* Added wrapper with minimum width */}
                        <Table hoverable className='shadow-md w-full'>
                            <Table.Head>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>User image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                users.map((user, index) => (
                                    <Table.Body className='divide-y' key={index}>
                                        <Table.Row className='bg-white dark:border-gray-800 dark:bg-gray-800'>
                                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                <img src={user.profilePicture} alt='img' className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>
                                                {user.isAdmin ?
                                                    (<FaCheck className='text-green-500'/>) :
                                                    (<FaTimes className='text-red-500'/>)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={() => {
                                                    setShowModel(true)
                                                    setUserIdToDelete(user._id)
                                                }}>
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))
                            }
                        </Table>
                        {showMore && <button onClick={handleShowMore} className='block mx-auto my-5 text-center text-gray-500 dark:text-gray-400'>Show More</button>}
                    </div>
                ) : (
                    <p className='text-center text-gray-500 dark:text-gray-400'>No Users found</p>
                )
            }

            <Modal show={showModel} onClose={() => setShowModel(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 mx-auto text-red-500' />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Post?
                        </h3>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={handelDeleteUser}>
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