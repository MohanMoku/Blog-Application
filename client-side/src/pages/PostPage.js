import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import { PostCard } from '../components/PostCard'

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState({})
    const [error, setError] = useState(null)
    const [recentPosts, setRecentPosts] = useState([])

    useEffect(() => {

        const fetchPost = async () => {
            try {
                setLoading(true)

                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getposts?slug=${postSlug}`)
                const data = await res.json()

                if (!res.ok) {
                    setError(data.message)
                    setLoading(false)
                    return
                }
                if (res.ok) {
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(false)
                }

            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getposts?limit=3&sort=asc`)
                const data = await res.json()
                if (res.ok) {
                    setRecentPosts(data.posts)
                }
            }

            fetchRecentPosts()

        } catch (error) {
            console.log(error);
        }
    })

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-red-500'>{error}</p>
            </div>
        )
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>

            <div className='text-3xl mt-10 text-center font-serif max-w-2xl lg:text-4xl mx-auto'>
                {post && post.title}
            </div>

            <Link to={`/search?category=${post.category}`} className='self-center mt-5'>
                <Button color='gray' pill size='xs'>
                    {post && post.category}
                </Button>
            </Link>

            <img src={post && post.image} alt={post && post.title}
                className='p-3 mxh[600px] w-full object-cover mt-10' />

            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} min read</span>
            </div>

            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>
            </div>
            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction />
            </div>

            <CommentSection postId={post._id} />

            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className='text-xl mt-5'>Recent Articles</h1>
                <div className='flex flex-wrap gap-5 justify-center mt-5'>

                    {
                        recentPosts &&
                        recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))

                    }

                </div>
            </div>

        </main>
    )
}

export default PostPage