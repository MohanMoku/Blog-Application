import React from 'react'
import { Link } from 'react-router-dom'

export const PostCard = ({ post }) => {

    return (
        <div className='group relative w-full border border-teal-500 hover:border-2 h-[350px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
            <Link to={`/post/${post.slug}`} className='flex flex-col gap-3'>
                <img src={post.image} alt={post.title} className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
            </Link>

            <div className="p-3 flex flex-col gap-2">
                <p className='font-semibold text-lg line-clamp-2'>{post.title}</p>
                <span className='text-xs italic'>{post.category}</span>
                <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 p-2 text-center rounded-md !rounded-tl-none m-2'>
                    Read article
                </Link>
            </div>

        </div>
    )
}
