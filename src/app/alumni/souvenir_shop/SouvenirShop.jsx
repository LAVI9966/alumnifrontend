"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeProvider";
import Link from "next/link";
import souvenirItems from "./souvenirItems"; // Import the souvenirItems array

const SouvenirShop = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sortDropdownRef = useRef(null); // Add ref for the sort dropdown

  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Filter and sort items
  const filteredAndSortedItems = () => {
    // First filter by search term
    let filtered = souvenirItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort according to the selected option
    switch (sortOption) {
      case "priceLow":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "priceHigh":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "nameAZ":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "nameZA":
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case "stock":
        return [...filtered].sort((a, b) => b.stock - a.stock);
      default:
        return filtered;
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort option selection
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  // Get the displayed sort option text
  const getSortOptionText = () => {
    switch (sortOption) {
      case "priceLow": return "Price: Low to High";
      case "priceHigh": return "Price: High to Low";
      case "nameAZ": return "Name: A to Z";
      case "nameZA": return "Name: Z to A";
      case "stock": return "Availability";
      default: return "Sort By";
    }
  };

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };

    // Add event listener when dropdown is open
    if (showSortOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortOptions]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
      {/* Hero Section - Matching with Nav */}
      <div className={`w-full py-12 ${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue'} transition-colors duration-200`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className={`text-4xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-white'}`}>Rimcollian Souvenir Shop</h1>
          <p className={`text-lg text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-300'}`}>
            Show your Rimcollian pride with our exclusive merchandise
          </p>
          <div className="flex justify-center">
            <div className={`border-2 ${isDark ? 'border-white' : 'border-[#C7A006]'} w-24 mb-8`}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Shop Header with filters and search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#131A45]'}`}>
            {searchTerm ? `Search results for "${searchTerm}"` : "Featured Items"}
            {filteredAndSortedItems().length === 0 && searchTerm && " (No results found)"}
          </h2>

          <div className="flex items-center mt-4 md:mt-0">
            <div className={`relative mr-4 ${isDark ? 'text-white' : 'text-[#131A45]'}`}>
              <input
                type="text"
                placeholder="Search souvenirs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} focus:outline-none focus:ring-2 focus:ring-[#131A45] transition-colors duration-200`}
              />
              <Icon
                icon="eva:search-fill"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                width="18"
                height="18"
              />
            </div>

            <div className="relative" ref={sortDropdownRef}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortOptions(!showSortOptions);
                }}
                className={`${isDark ? 'bg-[#2A3057] text-white border-[#3D437E]' : 'bg-white text-[#131A45] border-gray-300'} rounded-lg border px-3 py-2 flex items-center cursor-pointer transition-colors duration-200`}
              >
                <span className="mr-2">{getSortOptionText()}</span>
                <Icon icon="mdi:chevron-down" width="18" height="18" />
              </div>

              {/* Sort options dropdown */}
              {showSortOptions && (
                <div
                  className={`absolute right-0 z-10 mt-1 w-48 rounded-lg shadow-lg overflow-hidden border ${isDark ? 'bg-[#2A3057] border-[#3D437E]' : 'bg-white border-gray-200'}`}
                >
                  <ul>
                    <li
                      onClick={() => handleSortChange("default")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "default" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "default" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Default
                    </li>
                    <li
                      onClick={() => handleSortChange("priceLow")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "priceLow" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "priceLow" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Price: Low to High
                    </li>
                    <li
                      onClick={() => handleSortChange("priceHigh")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "priceHigh" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "priceHigh" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Price: High to Low
                    </li>
                    <li
                      onClick={() => handleSortChange("nameAZ")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "nameAZ" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "nameAZ" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Name: A to Z
                    </li>
                    <li
                      onClick={() => handleSortChange("nameZA")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "nameZA" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "nameZA" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Name: Z to A
                    </li>
                    <li
                      onClick={() => handleSortChange("stock")}
                      className={`px-4 py-2 cursor-pointer ${isDark ? (sortOption === "stock" ? "bg-[#1F2447] font-medium" : "hover:bg-[#1F2447]") : (sortOption === "stock" ? "bg-gray-100 font-medium" : "hover:bg-gray-100")}`}
                    >
                      Availability
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Souvenir Cards - Display filtered and sorted items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {filteredAndSortedItems().map((item) => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden shadow-lg border ${isDark ? 'bg-[#2A3057] border-[#3D437E]' : 'bg-white border-gray-200'} transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {/* Image placeholder if real image fails to load */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className={`text-4xl font-bold ${isDark ? 'text-[#1F2447]' : 'text-gray-300'}`}>
                    RIMC
                  </div>
                </div>

                {/* Actual image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />

                {/* Stock badge */}
                <div className={`absolute top-2 right-2 ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                  {item.stock < 10 ? `Only ${item.stock} left!` : 'In Stock'}
                </div>
              </div>

              <div className="p-5">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#131A45]'}`}>{item.name}</h3>
                <p className={`mb-4 text-sm h-12 overflow-hidden ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>

                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#131A45]'}`}>₹{item.price}</span>

                  <Link
                    href={`/alumni/souvenir_shop/${item.id}`}
                    className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-4 py-2 rounded-lg transition-colors duration-200 flex items-center`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show message when no items match search */}
        {filteredAndSortedItems().length === 0 && (
          <div className="text-center py-8">
            <Icon icon="mdi:search-off" className={`mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} width="64" height="64" />
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>No souvenirs found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Try adjusting your search term or clear filters</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`mt-4 px-4 py-2 rounded-lg transition-colors duration-200 ${isDark ? 'bg-[#3D437E] hover:bg-[#4D5390] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SouvenirShop;