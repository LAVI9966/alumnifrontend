"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "../../../../context/ThemeProvider";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Icon } from "@iconify/react";

const ProductDetail = ({ params }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const productId = React.use(params).id;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                stock: product.stock,
                category: product.category,
                quantity: quantity
            });
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <Icon icon="mdi:loading" className="animate-spin" width="48" height="48" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <Icon icon="mdi:alert-circle" className="mx-auto mb-4" width="48" height="48" />
                        <p className="text-xl">Error loading product: {error || 'Product not found'}</p>
                        <Link href="/alumni/souvenir_shop" className="mt-4 inline-block">
                            <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} transition-colors duration-200`}>
                                Back to Shop
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Link href="/alumni/souvenir_shop" className="inline-block mb-8">
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-[#2A3057] hover:bg-[#3D437E]' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}>
                        <Icon icon="mdi:arrow-left" width="20" height="20" />
                        Back to Shop
                    </button>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-lg`}>
                        <div className="relative h-96">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className={`rounded-xl p-6 ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-lg`}>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {product.description}
                        </p>
                        <div className="mb-6">
                            <span className="text-2xl font-bold">₹{product.price}</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block mb-2">Quantity</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className={`px-3 py-1 rounded-lg ${isDark ? 'bg-[#3D437E] hover:bg-[#4A52A0]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                    className={`px-3 py-1 rounded-lg ${isDark ? 'bg-[#3D437E] hover:bg-[#4A52A0]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
                                >
                                    +
                                </button>
                            </div>
                            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {product.stock} items available
                            </p>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-3 rounded-lg font-medium ${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} transition-colors duration-200`}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;