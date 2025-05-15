// ImageGallery.jsx - Complete component
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const ImageGallery = ({ images, url }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no images or empty array, return null
    if (!images || images.length === 0) return null;

    // If only one image, display it without the gallery controls
    if (images.length === 1) {
        return (
            <div className="w-full h-auto bg-gray-200 mt-3">
                <Image
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={`${url}/uploads/${images[0]?.split("\\").pop()}`}
                    alt="post image"
                    width={400}
                    height={400}
                    style={{ objectFit: "contain", width: "100%" }}
                    className="max-h-[400px]"
                />
            </div>
        );
    }

    // For multiple images, create a gallery with navigation
    return (
        <div className="w-full h-auto bg-gray-200 mt-3 relative">
            <div className="relative">
                <Image
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={`${url}/uploads/${images[currentIndex]?.split("\\").pop()}`}
                    alt={`post image ${currentIndex + 1}`}
                    width={400}
                    height={400}
                    style={{ objectFit: "contain", width: "100%" }}
                    className="max-h-[400px]"
                />

                {/* Image counter indicator */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Navigation buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1"
                    aria-label="Previous image"
                >
                    <Icon icon="mdi:chevron-left" width="24" height="24" className="text-white" />
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1"
                    aria-label="Next image"
                >
                    <Icon icon="mdi:chevron-right" width="24" height="24" className="text-white" />
                </button>
            )}

            {/* Thumbnail navigation */}
            <div className="hidden md:flex justify-center mt-2 space-x-2 p-1">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-blue-500" : "bg-gray-400"
                            }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;