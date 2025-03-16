import moment from 'moment';
import React, { useEffect, useState } from 'react';

export default function Comment({ comment }) {

    const [user, setUser] = useState({})

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

    return (
        <div className='flex p-4 border-b border-gray-300 dark:border-gray-700 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt="img" />
            </div>

            <div className="">
                <div className="flex items-center gap-2 mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : `anonymous user`}
                    </span>
                    <span className='text-gray-800 text-xs dark:text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                </div>

                <p className='text-gray-500 dark:text-gray-400  pb-2'>{comment.content}</p>

            </div>

        </div>
    )
}