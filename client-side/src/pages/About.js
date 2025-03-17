import React from 'react'

function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <h1 className='text-3xl font font-semibold text-center my-7'>About Mohan's Blog</h1>
        <div className='text-md text-gray-500 flex flex-col gap-6 dark:text-white'>
          <p>
            This is a blog about Mohan's life and experiences. It is a place where he can share his thoughts and ideas with the world.
          </p>

          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. In omnis obcaecati totam possimus nam dolorum error consequatur provident voluptas perferendis animi eum, reprehenderit modi perspiciatis quod odit dolores vitae quam!</p>
        </div>
      </div>
    </div>
  )
}

export default About