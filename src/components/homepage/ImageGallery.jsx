import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const ImageGallery = ({ images, url }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState({});
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reset current index when images change
    useEffect(() => {
        setCurrentIndex(0);
        setImageErrors({});
    }, [images]);

    // If no images or empty array, return null
    if (!images || images.length === 0) return null;

    // Helper function to safely process image paths
    const getImagePath = (imagePath) => {
        if (!imagePath) return "";

        // Try both path separators - works on all systems
        const fileName = imagePath.includes("\\")
            ? imagePath.split("\\").pop()
            : imagePath.includes("/")
                ? imagePath.split("/").pop()
                : imagePath;

        // Ensure we have a clean URL by removing any duplicate slashes
        return `${url}/uploads/${fileName}`.replace(/([^:]\/)\/+/g, "$1");
    };

    // Handle image loading errors
    const handleImageError = (index) => {
        console.error(`Failed to load image at index ${index}:`, getImagePath(images[index]));
        // Track which images have errors
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    // Navigation handlers
    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Touch gesture handlers for mobile swiping
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            // Swipe left, go to next
            goToNext();
        }

        if (touchStart - touchEnd < -50) {
            // Swipe right, go to previous
            goToPrevious();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isFullscreen) {
                if (e.key === 'ArrowLeft') {
                    goToPrevious();
                } else if (e.key === 'ArrowRight') {
                    goToNext();
                } else if (e.key === 'Escape') {
                    setIsFullscreen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen, currentIndex]);

    // Toggle fullscreen view
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // If only one image, display it without the gallery controls
    if (images.length === 1) {
        const imagePath = getImagePath(images[0]);

        return (
            <div className="w-full h-auto bg-gray-200 mt-3">
                <div className="relative w-full" style={{ minHeight: "200px" }}>
                    <Image
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={imagePath}
                        alt="post image"
                        width={400}
                        height={400}
                        style={{ objectFit: "contain", width: "100%" }}
                        className="max-h-[400px]"
                        onError={() => handleImageError(0)}
                        onClick={toggleFullscreen}
                    />

                    {/* Fullscreen button */}
                    <button
                        onClick={toggleFullscreen}
                        className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-1 rounded-md"
                        aria-label="Toggle fullscreen"
                    >
                        <Icon
                            icon={isFullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}
                            width="20"
                            height="20"
                        />
                    </button>

                    {/* Show fallback if image fails to load */}
                    {imageErrors[0] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <p className="text-gray-500">Image could not be loaded</p>
                            <small className="block text-xs text-gray-400 mt-1">{imagePath}</small>
                        </div>
                    )}
                </div>

                {/* Fullscreen overlay for single image */}
                {isFullscreen && (
                    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 text-white"
                            aria-label="Close fullscreen"
                        >
                            <Icon icon="mdi:close" width="32" height="32" />
                        </button>
                        <img
                            src={imagePath}
                            alt="Fullscreen view"
                            className="max-h-screen max-w-full object-contain"
                            onError={() => handleImageError(0)}
                        />
                    </div>
                )}
            </div>
        );
    }

    // For multiple images, create a gallery with navigation
    const currentImagePath = getImagePath(images[currentIndex]);

    return (
        <div
            className="w-full h-auto bg-gray-200 mt-3 relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative" style={{ minHeight: "200px" }}>
                <Image
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={currentImagePath}
                    alt={`post image ${currentIndex + 1}`}
                    width={400}
                    height={400}
                    style={{ objectFit: "contain", width: "100%" }}
                    className="max-h-[400px]"
                    onError={() => handleImageError(currentIndex)}
                    onClick={toggleFullscreen}
                />

                {/* Show fallback if image fails to load */}
                {imageErrors[currentIndex] && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                        <p className="text-gray-500">Image could not be loaded</p>
                        <small className="block text-xs text-gray-400 mt-1">{currentImagePath}</small>
                    </div>
                )}

                {/* Image counter and fullscreen button */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                    {currentIndex + 1} / {images.length}
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-1 rounded-md"
                    aria-label="Toggle fullscreen"
                >
                    <Icon
                        icon={isFullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}
                        width="20"
                        height="20"
                    />
                </button>
            </div>

            {/* Navigation buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1"
                    aria-label="Previous image"
                >
                    <Icon icon="mdi:chevron-left" width="24" height="24" className="text-white" />
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1"
                    aria-label="Next image"
                >
                    <Icon icon="mdi:chevron-right" width="24" height="24" className="text-white" />
                </button>
            )}

            {/* Thumbnail gallery removed - users will navigate with arrow buttons */}

            {/* Fullscreen overlay for image gallery */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    {/* Header with close button and image counter */}
                    <div className="w-full p-4 flex justify-between items-center">
                        <span className="text-white text-sm">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button
                            onClick={toggleFullscreen}
                            className="text-white"
                            aria-label="Close fullscreen"
                        >
                            <Icon icon="mdi:close" width="28" height="28" />
                        </button>
                    </div>

                    {/* Main image area with navigation */}
                    <div className="flex-grow flex items-center justify-center relative"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}>
                        <img
                            src={currentImagePath}
                            alt={`Fullscreen view ${currentIndex + 1}`}
                            className="max-h-[calc(100vh-120px)] max-w-full object-contain"
                            onError={() => handleImageError(currentIndex)}
                        />

                        {/* Fullscreen navigation buttons */}
                        {currentIndex > 0 && (
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                                aria-label="Previous image"
                            >
                                <Icon icon="mdi:chevron-left" width="28" height="28" className="text-white" />
                            </button>
                        )}

                        {currentIndex < images.length - 1 && (
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                                aria-label="Next image"
                            >
                                <Icon icon="mdi:chevron-right" width="28" height="28" className="text-white" />
                            </button>
                        )}
                    </div>

                    {/* Thumbnail strip at bottom removed */}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;