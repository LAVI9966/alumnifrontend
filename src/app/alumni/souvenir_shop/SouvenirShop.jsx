"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeProvider';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const SouvenirShop = () => {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    if (!item._id) {
      console.error('Item missing _id:', item);
      return;
    }
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      stock: item.stock,
      category: item.category,
      quantity: 1
    });
  };

  const filteredItems = products.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

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

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Icon icon="mdi:alert-circle" className="mx-auto mb-4" width="48" height="48" />
            <p className="text-xl">Error loading products: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search souvenirs..."
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

          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-[#1F2447] border-[#3D437E]' : 'bg-white border-gray-300'}`}
            >
              <Icon icon="mdi:sort" width="20" height="20" />
              Sort
            </button>

            {showSortOptions && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${isDark ? 'bg-[#1F2447]' : 'bg-white'} border ${isDark ? 'border-[#3D437E]' : 'border-gray-300'}`}>
                <button
                  onClick={() => {
                    setSortOption('price-low');
                    setShowSortOptions(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => {
                    setSortOption('price-high');
                    setShowSortOptions(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => {
                    setSortOption('name-asc');
                    setShowSortOptions(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
                >
                  Name: A to Z
                </button>
                <button
                  onClick={() => {
                    setSortOption('name-desc');
                    setShowSortOptions(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
                >
                  Name: Z to A
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item._id}
              className={`rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-[#2A3057]' : 'bg-white'}`}
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`px-4 py-2 rounded-lg ${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} transition-colors duration-200`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl">No souvenirs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SouvenirShop;