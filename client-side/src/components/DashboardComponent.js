import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function DashboardComponent() {

    const { currentUser } = useSelector((state) => state.user)

    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)

    useEffect(() => {

        const fetchUsers = async () => {

            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/getusers?limit=5`, {
                    credentials: 'include',
                })
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            } catch (error) {
                console.log(error);

            }
        }

        const fetchComments = async () => {

            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getcomments?limit=5`, {
                    credentials: 'include',
                })
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
            } catch (error) {
                console.log(error);
            }

        }

        const fetchPosts = async () => {

            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getposts?limit=5`, {
                    credentials: 'include',
                })
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.posts)
                    setTotalPosts(data.totalPost)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error);
            }

        }

        if (currentUser.isAdmin) {
            fetchUsers()
            fetchComments()
            fetchPosts()
        }

    }, [currentUser])

    return (

        <div className="p-3 md:mx-auto ">
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col gap-4 p-3 w-full md:w-72 rounded-md shadow-md dark:bg-slate-800">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-400 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-400 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-400">Last month</div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-3 w-full md:w-72 rounded-md shadow-md dark:bg-slate-800">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-400 text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-400 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-400">Last month</div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-3 w-full md:w-72 rounded-md shadow-md dark:bg-slate-800">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='text-gray-400 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-400 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-400">Last month</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent Users</h1>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            <Link to='/dashboard?tab=users' className=''>View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users &&
                            users.map((user) => (
                                <Table.Body key={user._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>
                                            <img
                                                src={user.profilePicture}
                                                alt='user'
                                                className='w-10 h-10 rounded-full bg-gray-500'
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent Comments</h1>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            <Link to='/dashboard?tab=comments' className=''>View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment Contents</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments &&
                            comments.map((comment) => (
                                <Table.Body key={comment._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell className='w-96'>
                                            <p className='line-clamp-2'>{comment.content}</p>
                                        </Table.Cell>
                                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent Posts</h1>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            <Link to='/dashboard?tab=posts' className=''>View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {posts &&
                            posts.map((post) => (
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt='img'
                                                className='w-14 h-10 rounded-md bg-gray-500'
                                            />
                                        </Table.Cell>
                                        <Table.Cell className='w-96 line-clamp-1'>{post.title}</Table.Cell>
                                        <Table.Cell className='w-5'>{post.category}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}
