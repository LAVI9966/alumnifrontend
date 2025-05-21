"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import gettoken from "@/app/function/gettoken";
import Postcard from '@/components/homepage/postcard';
import { useTheme } from '@/context/ThemeProvider';

// Individual post page component with consistent bg-[#F2F2F2] for light mode
const PostPage = () => {
    const { postId } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const url = process.env.NEXT_PUBLIC_URL;

    // Get user data without immediate redirect
    useEffect(() => {
        const getUserData = () => {
            if (typeof window !== 'undefined') {
                const storedData = localStorage.getItem('alumni');

                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        setUser(parsedData.user);
                    } catch (error) {
                        console.error('Error parsing localStorage data:', error);
                    }
                }
            }
        };

        getUserData();
    }, []);

    // Fetch post data - attempt to fetch even without confirmed user
    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;

            setIsLoading(true);
            try {
                // Try to get token
                const token = await gettoken();

                if (!token) {
                    console.log('No token available, redirecting to login');
                    // Instead of immediate redirect, set error
                    setError('Please log in to view this post');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`${url}/api/posts/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Post fetch response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch post: ${response.status}`);
                }

                const data = await response.json();
                console.log('Post data received:', !!data);

                if (!data || !data._id) {
                    throw new Error('Invalid post data received');
                }

                setPost(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load the post. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId, url]);

    // Refresh post data (used after interactions)
    const refreshPost = async () => {
        if (!postId) return;

        try {
            const token = await gettoken();
            if (!token) return;

            const response = await fetch(`${url}/api/posts/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh post: ${response.status}`);
            }

            const data = await response.json();
            setPost(data);
        } catch (err) {
            console.error('Error refreshing post:', err);
        }
    };

    // Display loading state
    if (isLoading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className={`h-12 rounded-t-lg ${isDark ? 'bg-[#2A3057]' : 'bg-gray-300'}`}></div>
                        <div className={`h-64 rounded-b-lg ${isDark ? 'bg-[#1F2447]' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Display error state with login option
    if (error) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}>
                        <h1 className="text-xl font-bold mb-4">
                            {error}
                        </h1>
                        <p className="mb-4">
                            {error.includes('log in')
                                ? 'You need to be logged in to view this post.'
                                : 'There was an error loading this post.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {error.includes('log in') && (
                                <button
                                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/alumni/post/${postId}`)}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Log In
                                </button>
                            )}
                            <button
                                onClick={() => router.push('/alumni/homepage')}
                                className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} rounded-lg`}
                            >
                                Return to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Display post not found state
    if (!post) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}>
                        <h1 className="text-xl font-bold mb-4">
                            Post not found
                        </h1>
                        <p className="mb-4">
                            The post you are looking for does not exist or has been removed.
                        </p>
                        <button
                            onClick={() => router.push('/alumni/homepage')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Post Details
                </h1>

                {/* Post Card */}
                {post && (
                    <Postcard
                        postData={post}
                        getPosts={refreshPost}
                        userid={user?.id}
                    />
                )}

                {/* Back Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push('/alumni/homepage')}
                        className={`px-4 py-2 ${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue'} text-white rounded-lg`}
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostPage;