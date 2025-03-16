import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'

export default function CommentSection({ postId }) {

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id
        })
      })

      const data = await res.json()

      if (data) {
        setComment('')
        setError(null)
        setComments([data, ...comments])
      }

      if (!res.ok) {
        setError('Error creating comment')
      }

    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {

    const getComments = async () => {
      try {

        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getPostComments/${postId}`)
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }


      } catch (error) {
        console.log(error);

      }
    }

    getComments()

  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in')
        return
      }
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/likeComment/${commentId}`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setComments(comments.map((comment) => comment._id === commentId ? data : comment))
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async (content, editedContent) => {

    setComments(
      content.map((c) => c._id === content ? { ...c, content: editedContent } : c)
    )

  }

  return (

    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
          <div className="flex items-center gap-2 my-5 text-gray-500 text-sm dark:text-white">
            <p>Signed in as : </p>
            <img src={currentUser.profilePicture} alt="img" className='h-5 w-5 object-cover rounded-full' />
            <Link to={'/dashboard?tab=profile'} className='font-xs text-blue-300 dark:text-blue-400'>
              @ {currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 my-5 flex gap-1 dark:text-white">
            <p>Sign in to comment</p>
            <Link to={'/sign-in'} className='text-blue-500 hover:underline dark:text-blue-400'>Sign In</Link>
          </div>
        )
      }

      {
        currentUser && (
          <form className='border border-gray-300 p-3 rounded-md dark:border-gray-700' onSubmit={handleSubmit}>
            <Textarea
              className='w-full'
              placeholder='Add a comment...'
              rows={4}
              maxLength='200'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />

            <div className="flex justify-between items-center mt-5">
              <p className='text-gray-500 dark:text-gray-400 size-xs'>
                {200 - comment.length} character remaining
              </p>

              <Button gradientDuoTone='purpleToBlue' outline type='submit'>
                Submit
              </Button>
            </div>
            {
              error &&
              <Alert color='failure' className='mt-5'>{error}</Alert>
            }

          </form>

        )
      }

      {comments.length === 0 ? (
        <p className='text-center text-gray-500 dark:text-gray-400'>No comments found</p>
      ) : (
        <>
          <div className='flex gap-2 text-sm my-5 items-center'>
            <p>Comments</p>
            <div className="border border-gray-300 p-1 rounded-md dark:border-gray-700 py-1 px-2">
              <p>{comments.length}</p>
            </div>
          </div>

          {
            comments.map((comment) => (

              <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit}/>
            ))}

        </>

      )}

    </div>


  )
}
