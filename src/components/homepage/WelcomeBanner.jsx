import React from 'react';

const WelcomeBanner = () => {
    return (
        <div className="w-full rounded-lg overflow-hidden mb-6 relative">
            {/* Main banner container with gradient background */}
            <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                {/* Text content */}
                <div className="z-10 md:w-2/3">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome to Rimcollian Portal
                    </h1>
                    <p className="text-white/90 text-sm md:text-base mb-4 md:mb-6 max-w-xl">
                        Connect with fellow alumni, stay updated with events, and be part of our growing community.
                    </p>
                    <button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors px-4 py-2 rounded-md font-medium text-sm">
                        Explore Features
                    </button>
                </div>

                {/* Image collage */}
                <div className="mt-6 md:mt-0 flex justify-center relative md:w-1/3">
                    <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                        {/* Image 1 */}
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-lg transform rotate-3">
                            <img
                                src="/api/placeholder/300/300"
                                alt="Campus"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Image 2 */}
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-lg transform -rotate-2 -mt-2">
                            <img
                                src="/api/placeholder/300/300"
                                alt="Students"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Image 3 */}
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-lg transform rotate-1 mt-1">
                            <img
                                src="/api/placeholder/300/300"
                                alt="Event"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Abstract decorative shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full -mb-20"></div>
            </div>
        </div>
    );
};

export default WelcomeBanner;