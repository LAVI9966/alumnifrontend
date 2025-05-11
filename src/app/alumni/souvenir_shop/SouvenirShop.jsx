"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeProvider";
import Link from "next/link";

const SouvenirShop = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Sample souvenir items with prices in Rupees (₹)
  const souvenirItems = [
    {
      id: 1,
      name: "Rimcollian Cap",
      price: 2150,
      description: "Official Rimcollian Cap with embroidered school crest. One size fits all.",
      image: "https://i.etsystatic.com/21657310/r/il/7a3da6/4302335850/il_fullxfull.4302335850_rpiq.jpg",
      stock: 15,
    },
    {
      id: 2,
      name: "Rimcollian Tie",
      price: 1650,
      description: "Elegant silk tie featuring the Rimcollian colors and subtle crest pattern.",
      image: "https://shop.mango.com/assets/rcs/pics/static/T8/fotos/S/87010615_56_B.jpg?imwidth=2048&imdensity=1&ts=1722443642969",
      stock: 23,
    },
    {
      id: 3,
      name: "Rimcollian Crest",
      price: 2899,
      description: "Beautiful wall-mountable metal crest, perfect for displaying your Rimcollian pride.",
      image: "https://upload.wikimedia.org/wikipedia/en/c/c1/Newcrest.jpg",
      stock: 8,
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-100 text-[#131A45]' : 'bg-[#F0F4F8] text-[#131A45]'} transition-colors duration-200`}>
      {/* Hero Section - Matching with Nav */}
      <div className={`w-full py-12 ${isDark ? 'bg-white' : 'bg-custom-blue'} transition-colors duration-200`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className={`text-4xl font-bold mb-4 text-center ${isDark ? 'text-[#131A45]' : 'text-white'}`}>Rimcollian Souvenir Shop</h1>
          <p className={`text-lg text-center mb-6 ${isDark ? 'text-[#131A45]' : 'text-gray-300'}`}>
            Show your Rimcollian pride with our exclusive merchandise
          </p>
          <div className="flex justify-center">
            <div className={`border-2 ${isDark ? 'border-[#131A45]' : 'border-[#C7A006]'} w-24 mb-8`}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Shop Header with filters and search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-[#131A45]' : 'text-[#131A45]'}`}>Featured Items</h2>

          <div className="flex items-center mt-4 md:mt-0">
            <div className={`relative mr-4 ${isDark ? 'text-[#131A45]' : 'text-[#131A45]'}`}>
              <input
                type="text"
                placeholder="Search souvenirs..."
                className={`pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-gray-300 bg-white' : 'border-gray-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-[#131A45] transition-colors duration-200`}
              />
              <Icon
                icon="eva:search-fill"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                width="18"
                height="18"
              />
            </div>

            <div className={`${isDark ? 'bg-white text-[#131A45]' : 'bg-white text-[#131A45]'} rounded-lg border border-gray-300 px-3 py-2 flex items-center cursor-pointer transition-colors duration-200`}>
              <span className="mr-2">Sort By</span>
              <Icon icon="mdi:chevron-down" width="18" height="18" />
            </div>
          </div>
        </div>

        {/* Souvenir Cards - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {souvenirItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden shadow-lg border ${isDark ? 'bg-white border-gray-200' : 'bg-white border-gray-200'} transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {/* Actual image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />

                {/* Fallback for image error */}
                <div className="absolute inset-0 bg-gray-300 hidden items-center justify-center">
                  <Icon icon="mdi:image-outline" width="48" height="48" className="text-gray-500" />
                </div>

                {/* Stock badge */}
                <div className={`absolute top-2 right-2 ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                  {item.stock < 10 ? `Only ${item.stock} left!` : 'In Stock'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-[#131A45]">{item.name}</h3>
                <p className="text-gray-600 mb-4 text-sm h-12 overflow-hidden">{item.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#131A45]">₹{item.price}</span>

                  <button className={`${isDark ? 'bg-[#131A45] text-white hover:bg-[#2A3057]' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-4 py-2 rounded-lg transition-colors duration-200 flex items-center`}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="flex justify-center">
          <Link
            href="/alumni/souvenir_shop"
            className={`${isDark ? 'bg-[#131A45] text-white hover:bg-[#2A3057]' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center`}
          >
            View All Souvenirs
            <Icon icon="mdi:chevron-right" className="ml-1" width="20" height="20" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SouvenirShop;