import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPosts() {

  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {

      try {
        // const res = await fetch(`http://localhost:4000/post/getposts`)
        const res = await fetch(`http://localhost:4000/post/getposts?userId=${currentUser._id}`, {
          credentials: 'include',
        })

        const data = await res.json()

        if (res.ok) {

          setUserPosts(data.posts)
          if (data.posts.length < 9)
            setShowMore(false)
        }

      } catch (error) {
        console.log(error);
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts()
    }

  }, [currentUser])

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(`http://localhost:4000/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUserPosts([...userPosts, ...data.posts])
        if (data.posts.length < 9)
          setShowMore(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelDeletePost = async () => {
    setShowModel(false)
    try {
      const res = await fetch(`http://localhost:4000/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',

        })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete))

    } catch (error) {
      console.log(error);

    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPosts.length > 0 ? (
          <div className='min-w-full w-[800px] md:w-auto'> {/* Added wrapper with minimum width */}
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {
                userPosts.map((post, index) => (
                  <Table.Body className='divide-y' key={index}>
                    <Table.Row className='bg-white dark:border-gray-800 dark:bg-gray-800'>
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={() => {
                          setShowModel(true)
                          setPostIdToDelete(post._id)
                        }}>
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'>
                          <span>Edit</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              }
            </Table>
            {showMore && <button onClick={handleShowMore} className='block mx-auto my-5 text-center text-gray-500 dark:text-gray-400'>Show More</button>}
          </div>
        ) : (
          <p className='text-center text-gray-500 dark:text-gray-400'>No posts found</p>
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
              <Button color="failure" onClick={handelDeletePost}>
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