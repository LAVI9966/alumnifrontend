"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import gettoken from "@/app/function/gettoken";
import Postcard from '@/components/homepage/postcard';
import { useTheme } from '@/context/ThemeProvider';

// Individual post page component
const PostPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const url = process.env.NEXT_PUBLIC_URL;

    // Get the current user
    useEffect(() => {
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
    }, []);

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;

            setIsLoading(true);
            try {
                const token = await gettoken();
                const response = await fetch(`${url}/api/posts/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch post: ${response.status}`);
                }

                const data = await response.json();
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
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-cyan-50'} py-8`}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="bg-gray-300 h-12 rounded-t-lg"></div>
                        <div className="bg-gray-200 h-64 rounded-b-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Display error state
    if (error || !post) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-cyan-50'} py-8`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}>
                        <h1 className="text-xl font-bold mb-4">
                            {error || 'Post not found'}
                        </h1>
                        <p className="mb-4">
                            {error ? 'There was an error loading this post.' : 'The post you are looking for does not exist or has been removed.'}
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-cyan-50'} py-8`}>
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Post Details
                </h1>

                {/* Post Card */}
                <Postcard
                    postData={post}
                    getPosts={refreshPost}
                    userid={user?.id}
                />

                {/* Back Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className={`px-4 py-2 ${isDark ? 'bg-[#3271FF] hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg`}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostPage;