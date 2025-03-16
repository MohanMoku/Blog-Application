import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashComments() {

  const { currentUser } = useSelector((state) => state.user)
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState('')

  useEffect(() => {
    const fetchComments = async () => {

      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getcomments`, {
          credentials: 'include',
        })

        const data = await res.json()

        if (res.ok) {

          setComments(data.comments)
          if (data.comments.length < 9)
            setShowMore(false)
        }

      } catch (error) {
        console.log(error);
      }
    }

    if (currentUser.isAdmin) {
      fetchComments()
    }

  }, [currentUser])

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getcomments?&startIndex=${startIndex}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setComments([...comments, ...data.comments])
        if (data.comments.length < 9)
          setShowMore(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelDeleteComment = async () => {
    setShowModel(false)
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
          credentials: 'include',

        })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setComments(comments.filter((comment) => comment._id !== commentIdToDelete))

    } catch (error) {
      console.log(error);

    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full'>
      {
        currentUser.isAdmin && comments.length > 0 ? (
          <div className='min-w-full md:w-auto'> {/* Added wrapper with minimum width */}
            <Table hoverable className='shadow-md w-full'>
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {
                comments.map((comment, index) => (
                  <Table.Body className='divide-y' key={index}>
                    <Table.Row className='bg-white dark:border-gray-800 dark:bg-gray-800'>
                      <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{comment.content}</Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      <Table.Cell>{comment.postId}</Table.Cell>
                      <Table.Cell>{comment.userId}</Table.Cell>
                      <Table.Cell>
                        <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={() => {
                          setShowModel(true)
                          setCommentIdToDelete(comment._id)
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
          <p className='text-center text-gray-500 dark:text-gray-400'>No Comments found</p>
        )
      }

      <Modal show={showModel} onClose={() => setShowModel(false)} size='md' popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='w-14 h-14 mx-auto text-red-500' />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Comment?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handelDeleteComment}>
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