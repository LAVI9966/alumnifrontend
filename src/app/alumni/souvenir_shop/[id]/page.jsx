"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../../context/ThemeProvider";
import Link from "next/link";
import souvenirItems from "../souvenirItems"; // Import the souvenirItems array
import { useCart } from "@/context/CartContext";

// Fix for params in Next.js 14
const Page = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // All hooks MUST be declared at the top level, before any conditional logic
    const [productId, setProductId] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useCart();

    // Get the product ID from the URL using window.location in useEffect
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/');
            const id = pathParts[pathParts.length - 1];
            setProductId(id);
        }
    }, []);

    // Get product data once we have the ID
    useEffect(() => {
        if (productId) {
            const fetchedProduct = souvenirItems.find(item => item.id === parseInt(productId));
            setProduct(fetchedProduct);
            setLoading(false);
        }
    }, [productId]);

    // Handle quantity change
    const handleQuantityChange = (newQuantity) => {
        if (product && newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    // Add to cart function
    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            // Show success message
            alert(`Added ${quantity} ${product.name}(s) to cart`);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F0F4F8] text-[#131A45]'} flex items-center justify-center`}>
                <div className="animate-spin mr-2">
                    <Icon icon="mdi:loading" width="32" height="32" />
                </div>
                <p className="text-lg font-medium">Loading product details...</p>
            </div>
        );
    }

    // Error state - product not found
    if (!product) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F0F4F8] text-[#131A45]'} flex flex-col items-center justify-center p-4`}>
                <Icon icon="mdi:alert-circle-outline" className="text-red-500 mb-4" width="64" height="64" />
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>The product you're looking for doesn't exist or has been removed.</p>
                <Link
                    href="/alumni/souvenir_shop"
                    className={`${isDark ? 'bg-white text-[#131A45]' : 'bg-[#131A45] text-white'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center`}
                >
                    <Icon icon="mdi:arrow-left" className="mr-2" width="20" height="20" />
                    Return to Shop
                </Link>
            </div>
        );
    }

    // Create a simple array of features from the description for the Features tab
    const features = product.description.split('.').filter(sentence => sentence.trim() !== '');

    // Create specifications object
    const specifications = {
        'Item Code': `RIMC-${product.id.toString().padStart(3, '0')}`,
        'Category': getCategoryFromId(product.id),
        'Material': getMaterialFromName(product.name),
        'Care': 'See product description',
        'Availability': product.stock > 10 ? 'In Stock' : `Limited Stock (${product.stock} left)`
    };

    // Helper function to determine category
    function getCategoryFromId(id) {
        if (id >= 1 && id <= 5) return 'Accessories';
        if (id >= 6 && id <= 10) return 'Apparel';
        if (id >= 11 && id <= 15) return 'Clothing';
        if (id >= 16 && id <= 20) return 'Memorabilia';
        if (id >= 21 && id <= 25) return 'Sportswear';
        if (id >= 26 && id <= 30) return 'Collectibles';
        if (id >= 31 && id <= 36) return 'Literature';
        return 'Miscellaneous';
    }

    // Helper function to guess material from name
    function getMaterialFromName(name) {
        if (name.includes('SILVER')) return 'Silver';
        if (name.includes('WHITE METAL')) return 'White Metal';
        if (name.includes('METAL')) return 'Metal';
        if (name.includes('SHIRT') || name.includes('T SHIRT')) return 'Cotton';
        if (name.includes('BOOK')) return 'Paper';
        if (name.includes('MUG')) return 'Ceramic';
        if (name.includes('TIE')) return 'Polyester/Silk';
        return 'Various';
    }

    // Main product view - only render when product exists
    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            {/*             
            <div className={`w-full py-4 border-b ${isDark ? 'bg-[#2A3057] border-[#3D437E]' : 'bg-white border-gray-200'}`}>
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center text-sm">
                        <Link href="/" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]'} transition-colors duration-200`}>Home</Link>
                        <Icon icon="mdi:chevron-right" className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} width="16" height="16" />
                        <Link href="/alumni" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]'} transition-colors duration-200`}>Alumni</Link>
                        <Icon icon="mdi:chevron-right" className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} width="16" height="16" />
                        <Link href="/alumni/souvenir_shop" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]'} transition-colors duration-200`}>Souvenir Shop</Link>
                        <Icon icon="mdi:chevron-right" className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} width="16" height="16" />
                        <span className="font-medium">{product.name}</span>
                    </div>
                </div>
            </div> */}

            {/* Main product section */}
            <div className="container  px-4 py-8 max-w-6xl mx-auto">
                <div className={`flex flex-col lg:flex-row ${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    {/* Product image section */}
                    <div className="w-full lg:w-2/5 p-6">
                        {/* Main image with fallback */}
                        <div className={`mb-4 rounded-lg overflow-hidden border ${isDark ? 'border-[#3D437E] bg-[#1F2447]' : 'border-gray-200 bg-gray-50'} h-80 relative`}>
                            {/* Image fallback */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className={`text-6xl font-bold ${isDark ? 'text-[#1F2447]' : 'text-gray-300'}`}>
                                    RIMC
                                </div>
                            </div>

                            <img
                                src={product.image}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Product details section */}
                    <div className={`w-full lg:w-3/5 p-6 border-t lg:border-t-0 lg:border-l ${isDark ? 'border-[#3D437E]' : 'border-gray-200'}`}>
                        {/* Stock badge */}
                        <div className={`inline-block mb-4 ${product.stock < 10 ? (isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800') : (isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800')} rounded-full px-3 py-1 text-sm font-medium`}>
                            {product.stock < 10 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                        </div>

                        {/* Product name and price */}
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#131A45]'} mb-2`}>{product.name}</h1>

                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#131A45]'} mb-6`}>₹{product.price}</div>

                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6`}>{product.description}</p>

                        {/* Quantity selector and Add to Cart */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                            <div className={`flex items-center border rounded-lg mb-4 sm:mb-0 sm:mr-4 ${isDark ? 'border-[#3D437E]' : 'border-gray-300'}`}>
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    className={`px-4 py-2 ${quantity <= 1 ? (isDark ? 'text-gray-500' : 'text-gray-400') : (isDark ? 'text-gray-300 hover:bg-[#1F2447]' : 'text-gray-700 hover:bg-gray-100')} focus:outline-none transition-colors duration-200`}
                                >
                                    <Icon icon="mdi:minus" width="20" height="20" />
                                </button>
                                <span className={`px-4 py-2 ${isDark ? 'text-white font-medium' : 'text-gray-700 font-medium'}`}>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= product.stock}
                                    className={`px-4 py-2 ${quantity >= product.stock ? (isDark ? 'text-gray-500' : 'text-gray-400') : (isDark ? 'text-gray-300 hover:bg-[#1F2447]' : 'text-gray-700 hover:bg-gray-100')} focus:outline-none transition-colors duration-200`}
                                >
                                    <Icon icon="mdi:plus" width="20" height="20" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center w-full sm:w-auto justify-center`}
                            >
                                <Icon icon="mdi:cart" className="mr-2" width="20" height="20" />
                                Add to Cart
                            </button>
                        </div>

                        {/* Additional product information */}
                        <div className={`border-t pt-6 ${isDark ? 'border-[#3D437E]' : 'border-gray-200'}`}>
                            <div className={`flex border-b ${isDark ? 'border-[#3D437E]' : 'border-gray-200'}`}>
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'description' ? (isDark ? 'text-white border-b-2 border-white' : 'text-[#131A45] border-b-2 border-[#131A45]') : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]')}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('features')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'features' ? (isDark ? 'text-white border-b-2 border-white' : 'text-[#131A45] border-b-2 border-[#131A45]') : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]')}`}
                                >
                                    Features
                                </button>
                                {/* <button
                                    onClick={() => setActiveTab('specifications')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'specifications' ? (isDark ? 'text-white border-b-2 border-white' : 'text-[#131A45] border-b-2 border-[#131A45]') : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#131A45]')}`}
                                >
                                    Specifications
                                </button> */}
                            </div>

                            {/* Tab content */}
                            <div className="py-4">
                                {activeTab === 'description' && (
                                    <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <p>{product.description}</p>
                                        <p className="mt-4">This authentic Rimcollian merchandise is part of our official collection, showcasing the tradition and pride of the Rashtriya Indian Military College. Each item is crafted with care to represent the prestigious heritage of RIMC.</p>
                                    </div>
                                )}

                                {activeTab === 'features' && (
                                    <ul className={`list-disc pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                                        {features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                        <li>Official Rimcollian merchandise</li>
                                        <li>Premium quality craftsmanship</li>
                                        <li>Exclusive design</li>
                                    </ul>
                                )}

                                {/* {activeTab === 'specifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(specifications).map(([key, value]) => (
                                            <div key={key} className={`border-b pb-2 ${isDark ? 'border-[#3D437E]' : 'border-gray-200'}`}>
                                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium capitalize`}>{key}: </span>
                                                <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return to shop button */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/alumni/souvenir_shop"
                        className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center`}
                    >
                        <Icon icon="mdi:arrow-left" className="mr-2" width="20" height="20" />
                        Return to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;