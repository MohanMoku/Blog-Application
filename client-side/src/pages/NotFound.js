import { Button } from 'flowbite-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    HiOutlineEmojiSad, 
    HiHome 
} from 'react-icons/hi';
import { 
    FaRegCompass, 
    FaSearch, 
    FaExclamationTriangle 
} from 'react-icons/fa';

export default function NotFound() {

  const navigate = useNavigate();

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-2xl mx-auto p-8 text-center'>
                {/* Main Error Section */}
                <div className='mb-8 relative'>
                    <div className='text-9xl font-bold text-gray-200 dark:text-gray-700'>404</div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full'>
                        <HiOutlineEmojiSad className='text-6xl mx-auto text-blue-500 dark:text-blue-400 mb-4' />
                        <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                            Oops! Page Not Found
                        </h1>
                    </div>
                </div>

                {/* Error Details */}
                <div className='mb-8'>
                    <p className='text-gray-600 dark:text-gray-300 mb-4'>
                        We searched high and low, but couldn't find what you're looking for.
                    </p>
                    <div className='flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-4'>
                        <FaExclamationTriangle className='text-yellow-500' />
                        <span>The page might have been moved or deleted.</span>
                    </div>
                </div>

                {/* Helpful Links Section */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer' onClick={() => navigate('/')}>
                        <HiHome className='text-3xl mx-auto mb-2 text-blue-500' />
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Go Home</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Return to the homepage</p>
                    </div>
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer' onClick={() => navigate('/search')}>
                        <FaSearch className='text-3xl mx-auto mb-2 text-green-500' />
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Search</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Try searching for content</p>
                    </div>
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer' onClick={() => navigate('/about')}>
                        <FaRegCompass className='text-3xl mx-auto mb-2 text-purple-500' />
                        <h3 className='font-semibold text-gray-800 dark:text-white'>Explore</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Browse our sitemap</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link to='/'>
                        <Button gradientDuoTone='purpleToBlue' size='lg' className='w-full sm:w-auto'>
                            <HiHome className='mr-2 text-xl' />
                            Back to Homepage
                        </Button>
                    </Link>
                    <Link to='/about'>
                        <Button gradientDuoTone='cyanToBlue' outline size='lg' className='w-full sm:w-auto'>
                            <FaRegCompass className='mr-2 text-xl' />
                            Explore Site
                        </Button>
                    </Link>
                </div>

                {/* Animated Element */}
                <div className='mt-12 text-gray-500 dark:text-gray-400 animate-bounce'>
                    <FaSearch className='text-2xl mx-auto' />
                    <p className='text-sm mt-2'>Keep scrolling to explore more</p>
                </div>
            </div>
        </div>
    );
}