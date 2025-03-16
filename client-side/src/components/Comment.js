import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react'

export default function Comment({ comment, onLike, onEdit, onDelete }) {

    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {

        const getUser = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getUser()

    }, [comment])

    const handleEdit = () => {
        setIsEditing(true)
        setEditedContent(comment.content)

    }

    const handleSave = async () => {
        try {

            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    content: editedContent
                })
            })

            if (res.ok) {
                onEdit(comment, editedContent)
                setIsEditing(false)
            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='flex p-4 border-b border-gray-300 dark:border-gray-700 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt="img" />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : `anonymous user`}
                    </span>
                    <span className='text-gray-800 text-xs dark:text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                </div>

                {isEditing ? (
                    <>
                        <Textarea className='mb-2'
                            value={editedContent} rows={2}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button
                                gradientDuoTone='purpleToBlue'
                                type='button'
                                size='sm'
                                onClick={handleSave}
                            >Save</Button>
                            <Button
                                gradientDuoTone='purpleToBlue'
                                type='button'
                                size='sm'
                                outline
                                onClick={() => setIsEditing(false)}
                            >Cancel</Button>
                        </div>

                    </>
                ) : (
                    <>
                        <p className='text-gray-500 dark:text-gray-300  pb-2'>{comment.content}</p>

                        <div className="flex items-center gap-2 text-xs border-t max-w-fit pt-2 dark:border-gray-700">
                            <button type='button' onClick={() => onLike(comment._id)}
                                className={`text-gray-500 hover:text-blue-500 
                            ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                                <FaThumbsUp className='text-sm' />
                            </button>
                            <p className='text-gray-500 dark:text-gray-400 mr-2'>
                                {comment.numberOfLikes >= 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                            </p>

                            {currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) && (

                                <>
                                    <button type='button' onClick={handleEdit}
                                        className='text-gray-300 hover:text-blue-500'>
                                        Edit
                                    </button>
                                    <button type='button' onClick={() => onDelete(comment._id)}
                                        className='text-gray-300 hover:text-blue-500'>
                                        Delete
                                    </button>
                                </>
                            )}

                        </div>
                    </>
                )}

            </div>

        </div>
    )
}