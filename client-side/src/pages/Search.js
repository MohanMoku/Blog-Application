import React, { useEffect, useState, useCallback } from 'react'
import { Button, Select, TextInput } from 'flowbite-react'
import { useLocation, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/PostCard'

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
  })
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation()
  const navigate = useNavigate()

  const fetchPosts = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getposts?${searchQuery}`);
      if (!res.ok) return;
      const data = await res.json();
      setPosts(data.posts);
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSearchParams = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');

    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      sort: sortFromUrl || 'desc',
    });

    return urlParams.toString();
  }, [location.search]);

  useEffect(() => {
    const searchQuery = updateSearchParams();
    fetchPosts(searchQuery);
  }, [updateSearchParams, fetchPosts]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prev => ({
      ...prev,
      [id]: id === 'sort' ? (value || 'desc') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getposts?${searchQuery}`);
      if (!res.ok) return;
      const data = await res.json();
      setPosts(prev => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Search Term:</label>
            <TextInput
              type='text'
              id='searchTerm'
              placeholder='Search...'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select
              id='sort'
              value={sidebarData.sort}
              onChange={handleChange}
            >
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
