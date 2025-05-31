"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import gettoken from '@/app/function/gettoken';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrdersPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [retryCount]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await gettoken();
            if (!token) {
                console.error('No token found');
                throw new Error('Please login to view orders');
            }

            console.log('Fetching orders with token:', token.substring(0, 10) + '...');

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to fetch orders');
            }

            const data = await response.json();
            console.log('Received orders data:', data);

            // Validate the data structure
            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                throw new Error('Invalid data format received from server');
            }

            // Transform and validate each order
            const validatedOrders = data.map(order => {
                console.log('Validating order:', order._id);
                return {
                    ...order,
                    items: order.items.map(item => {
                        console.log('Validating item:', item._id);
                        return {
                            ...item,
                            product: {
                                ...item.product,
                                name: item.product?.name || 'Product not found',
                                image: item.product?.image || '/images/default-product.png',
                                price: item.product?.price || 0
                            }
                        };
                    })
                };
            });

            console.log('Validated orders:', validatedOrders);
            setOrders(validatedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
            case 'pending':
                return isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
            default:
                return isDark ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders
        .filter(order => {
            if (filter === 'all') return true;
            return order.status?.toLowerCase() === filter.toLowerCase();
        })
        .filter(order => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                order._id?.toLowerCase().includes(searchLower) ||
                order.items?.some(item =>
                    item.product?.name?.toLowerCase().includes(searchLower)
                ) ||
                order.shippingAddress?.name?.toLowerCase().includes(searchLower)
            );
        });

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Icon icon="mdi:loading" className="animate-spin" width="48" height="48" />
                        <p className="text-lg">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <Icon icon="mdi:alert-circle" className="mx-auto mb-4" width="48" height="48" />
                        <p className="text-xl mb-4">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleRetry}
                                className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200`}
                            >
                                Try Again
                            </button>
                            <Link
                                href="/alumni/souvenir_shop"
                                className={`${isDark ? 'bg-[#2A3057] text-white hover:bg-[#3D437E]' : 'bg-gray-200 text-[#131A45] hover:bg-gray-300'} px-6 py-3 rounded-lg font-medium transition-colors duration-200`}
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold">My Orders</h1>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full p-2 pl-10 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                            />
                            <Icon
                                icon="mdi:magnify"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                width="20"
                                height="20"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={`p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                        >
                            <option value="all">All Orders</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
                        <Icon icon="mdi:package-variant" className="mx-auto mb-4" width="64" height="64" />
                        <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
                        <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {searchTerm || filter !== 'all'
                                ? 'No orders match your search criteria.'
                                : 'You haven\'t placed any orders yet.'}
                        </p>
                        <Link
                            href="/alumni/souvenir_shop"
                            className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center`}
                        >
                            <Icon icon="mdi:shopping" className="mr-2" width="20" height="20" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold">Order #{order._id?.slice(-6)}</h2>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items?.map((item) => (
                                            <div key={item._id} className="flex items-center gap-4">
                                                <div className="w-16 h-16 relative flex-shrink-0">
                                                    <Image
                                                        src={item.product?.image || '/images/default-product.png'}
                                                        alt={item.product?.name || 'Product'}
                                                        fill
                                                        sizes="64px"
                                                        className="object-contain"
                                                        onError={(e) => {
                                                            e.target.src = '/images/default-product.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <Link
                                                        href={`/alumni/souvenir_shop/${item.product?._id}`}
                                                        className="font-medium hover:underline inline-block"
                                                    >
                                                        {item.product?.name || 'Product not found'}
                                                    </Link>
                                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <span className="font-semibold">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Shipping Address:
                                                </p>
                                                <p className="text-sm">
                                                    {order.shippingAddress?.name}<br />
                                                    {order.shippingAddress?.address}<br />
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Amount</p>
                                                <p className="text-xl font-bold">₹{order.totalAmount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage; 