"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeProvider';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gettoken from '@/app/function/gettoken';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, total, clearCart } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Add Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        // Redirect if cart is empty
        if (cart.length === 0) {
            router.push('/alumni/cart');
        }
    }, [cart, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.phone.trim()) return 'Phone is required';
        if (!formData.address.trim()) return 'Address is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.state.trim()) return 'State is required';
        if (!formData.pincode.trim()) return 'PIN code is required';
        if (!/^\d{6}$/.test(formData.pincode)) return 'PIN code must be 6 digits';
        if (!/^[0-9]{10}$/.test(formData.phone)) return 'Phone number must be 10 digits';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
        return null;
    };

    const validateCart = () => {
        if (!cart || cart.length === 0) return 'Cart is empty';
        for (const item of cart) {
            if (!item._id) {
                console.error('Invalid item in cart:', item);
                return 'Invalid product ID in cart';
            }
            if (!item.quantity || item.quantity < 1) {
                console.error('Invalid quantity for item:', item);
                return 'Invalid quantity in cart';
            }
            if (!item.price || item.price <= 0) {
                console.error('Invalid price for item:', item);
                return 'Invalid price in cart';
            }
        }
        return null;
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const token = await gettoken();
            if (!token) {
                toast.error('Please login to continue');
                return;
            }

            // Create order
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress: {
                        name: formData.name,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        phone: formData.phone
                    },
                    status: 'pending'
                })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Wait for Razorpay script to load
            if (!window.Razorpay) {
                throw new Error('Payment gateway not loaded. Please try again.');
            }

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Alumni Association",
                description: "Payment for your order",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || 'Payment verification failed');
                        }

                        // Clear cart and redirect to success page
                        clearCart();
                        router.push('/alumni/payment-success');
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate form
            const formError = validateForm();
            if (formError) {
                throw new Error(formError);
            }

            // Validate cart
            const cartError = validateCart();
            if (cartError) {
                console.error('Cart validation error:', cartError);
                throw new Error(cartError);
            }

            await handlePayment();
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        }
    };

    if (cart.length === 0) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            pattern="[0-9]{10}"
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">PIN Code</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                            pattern="[0-9]{6}"
                                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} w-full py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                                >
                                    {loading ? (
                                        <>
                                            <Icon icon="mdi:loading" className="animate-spin mr-2" width="20" height="20" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="mdi:credit-card" className="mr-2" width="20" height="20" />
                                            Pay ₹{total}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-8`}>
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 relative flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-sm">{item.name}</h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                                        <span className="font-semibold">₹{total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                                        <span className="font-semibold">Free</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-lg">₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 