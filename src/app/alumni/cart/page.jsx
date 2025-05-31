"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeProvider';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const { cart, total, removeFromCart, updateQuantity } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleRemoveFromCart = (item) => {
        removeFromCart(item._id);
        toast.success(`${item.name} removed from cart`, {
            style: {
                background: isDark ? '#2A3057' : '#fff',
                color: isDark ? '#fff' : '#131A45',
                border: `1px solid ${isDark ? '#3D437E' : '#e5e7eb'}`
            }
        });
    };

    const handleUpdateQuantity = (item, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(item._id, newQuantity);
        toast.success(`Updated ${item.name} quantity to ${newQuantity}`, {
            style: {
                background: isDark ? '#2A3057' : '#fff',
                color: isDark ? '#fff' : '#131A45',
                border: `1px solid ${isDark ? '#3D437E' : '#e5e7eb'}`
            }
        });
    };

    if (cart.length === 0) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
                        <Icon icon="mdi:cart-off" className="mx-auto mb-4" width="64" height="64" />
                        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                        <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            href="/alumni/souvenir_shop"
                            className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center`}
                        >
                            <Icon icon="mdi:shopping" className="mr-2" width="20" height="20" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className={`p-6 border-b ${isDark ? 'border-[#3D437E]' : 'border-gray-200'} last:border-b-0`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 relative flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <h3 className="font-semibold mb-2">{item.name}</h3>
                                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        className={`p-1 rounded ${isDark ? 'hover:bg-[#1F2447]' : 'hover:bg-gray-100'}`}
                                                    >
                                                        <Icon icon="mdi:minus" width="20" height="20" />
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        className={`p-1 rounded ${isDark ? 'hover:bg-[#1F2447]' : 'hover:bg-gray-100'}`}
                                                    >
                                                        <Icon icon="mdi:plus" width="20" height="20" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                                                    <button
                                                        onClick={() => handleRemoveFromCart(item)}
                                                        className={`p-1 rounded ${isDark ? 'hover:bg-[#1F2447]' : 'hover:bg-gray-100'}`}
                                                    >
                                                        <Icon icon="mdi:delete" width="20" height="20" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-8`}>
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                                    <span className="font-semibold">₹{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                                    <span className="font-semibold">Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-lg">₹{total}</span>
                                </div>
                            </div>

                            <Link
                                href="/alumni/checkout"
                                className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} w-full py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                            >
                                <Icon icon="mdi:cart-check" className="mr-2" width="20" height="20" />
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/alumni/souvenir_shop"
                                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#131A45]'} mt-4 text-center block transition-colors duration-200`}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 