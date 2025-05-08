import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeProvider';
const ManagementCommitee = () => {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    // Combine all members into one array for gallery navigation
    const members = [
        {
            name: 'Lt Gen CP Mohanty',
            image: '/Lt_Gen_CP_Mohanty.avif',
            tenure: '(1973–78, SHI)',
            role: 'Member',
        },
        {
            name: 'Lt Gen BS Pawar',
            image: '/Lt_Gen_BS_Pawar.avif',
            tenure: '(1960–64, PRA)',
            role: 'Member',
        },
        {
            name: 'Lt Gen Nav K Khanduri',
            image: '/Lt_Gen_Nav_K_Khanduri.avif',
            tenure: '(1975–79, CHA)',
            role: 'Member',
        },
        {
            name: 'Air Mshl PP Reddy',
            image: '/Air_Mshl_PP_Reddy.avif',
            tenure: '(1968-72, SHI)',
            role: 'Editor',
        },
        {
            name: 'Lt Gen Adosh Kumar ',
            image: '/Lt_Gen_Adosh_Kumar.avif',
            tenure: '(1977-82, PRA)',
            role: 'Member',
        },
        {
            name: 'AVM N Tiwari',
            image: '/AVMN_Tiwari.avif',
            tenure: '(1977-82, CHA)',
            role: 'Member',
        },
        {
            name: 'Maj Gen H Dharmarajan',
            image: '/Maj_Gen_H_Dharmarajan.avif',
            tenure: '(1978-82, CHA)',
            role: 'Member',
        },
        {
            name: 'Cmde Raghunath K Nair',
            image: '/Cmde_Raghunath_K_Nair.avif',
            tenure: '(1980-84, SHI)',
            role: 'Member',
        },
        {
            name: 'Maj MS Bedi',
            image: '/Maj_MS_Bedi.avif',
            tenure: '(1964-69, SHI)',
            role: 'Hony Treasurer',
        },
        {
            name: 'Col Ajay Kumar',
            image: '/Col_Ajay_Kumar.avif',
            tenure: '(1980-85, PRA)',
            role: 'Commandant',
        },
        {
            name: 'Gp Capt Deepak Ahluwalia',
            image: '/Gp_Capt_Deepak_Ahluwalia.avif',
            tenure: '(1981-85, RAN)',
            role: 'Hony Secretary',
        },
        {
            name: 'CAPT(IN) MANISH SAIN',
            image: '/CAPT(IN)_MANISH_SAIN.avif',
            tenure: '(1983-87, CHA)',
            role: 'Hony Treasurer',
        },
        {
            name: 'Col Shailender Arya',
            image: '/Col_Shailender_Arya.avif',
            tenure: '(1990-94, SHI)',
            role: 'Member',
        },
    ];

    const members2 = [
        {
            name: 'Air Mshl PP Reddy',
            image: '/Air_Mshl_PP_Reddy.avif',
            tenure: '(1968-72, SHI)',
            role: 'Editor',
        },
        {
            name: 'Lt Gen Adosh Kumar ',
            image: '/Lt_Gen_Adosh_Kumar.avif',
            tenure: '(1977-82, PRA)',
            role: 'Member',
        },
        {
            name: 'AVM N Tiwari',
            image: '/AVMN_Tiwari.avif',
            tenure: '(1977-82, CHA)',
            role: 'Member',
        },
    ];

    const members3 = [
        {
            name: 'Maj Gen H Dharmarajan',
            image: '/Maj_Gen_H_Dharmarajan.avif',
            tenure: '(1978-82, CHA)',
            role: 'Member',
        },
        {
            name: 'Cmde Raghunath K Nair',
            image: '/Cmde_Raghunath_K_Nair.avif',
            tenure: '(1980-84, SHI)',
            role: 'Member',
        },
        {
            name: 'Maj MS Bedi',
            image: '/Maj_MS_Bedi.avif',
            tenure: '(1964-69, SHI)',
            role: 'Hony Treasurer',
        },
    ];

    const members4 = [
        {
            name: 'Col Ajay Kumar',
            image: '/Col_Ajay_Kumar.avif',
            tenure: '(1980-85, PRA)',
            role: 'Commandant',
        },
        {
            name: 'Gp Capt Deepak Ahluwalia',
            image: '/Gp_Capt_Deepak_Ahluwalia.avif',
            tenure: '(1981-85, RAN)',
            role: 'Hony Secretary',
        },
        {
            name: 'CAPT(IN) MANISH SAIN',
            image: '/CAPT(IN)_MANISH_SAIN.avif',
            tenure: '(1983-87, CHA)',
            role: 'Hony Treasurer',
        },
        {
            name: 'Col Shailender Arya',
            image: '/Col_Shailender_Arya.avif',
            tenure: '(1990-94, SHI)',
            role: 'Member',
        },
    ];

    // Handle fullscreen mode
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            const galleryElement = document.getElementById('gallery-container');
            if (galleryElement && galleryElement.requestFullscreen) {
                galleryElement.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const openGallery = (index) => {
        setCurrentImageIndex(index);
        setGalleryOpen(true);
        // Prevent body scrolling when gallery is open
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        setGalleryOpen(false);
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1));
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!galleryOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case 'Escape':
                    closeGallery();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [galleryOpen]);

    const MemberCard = ({ member, index }) => {
        const { theme, toggleTheme } = useTheme(); // Use the theme context
        const isDark = theme === 'dark';
        return <motion.div
            className="flex flex-col items-center text-center w-full font-serif"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div
                className="w-32 h-40 md:w-[140px] md:h-[180px] overflow-hidden mx-auto cursor-pointer"
                onClick={() => openGallery(index)}
            >
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
            </div>
            <p className={`text-lg mt-3 ${isDark ? 'text-white' : 'text-[#1F2937]'} `}>{member.name}</p>
            <p className="text-sm text-gray-500">{member.tenure}</p>
            <p className="text-sm font-medium">{member.role}</p>
        </motion.div>
    }

    // Icons for gallery controls
    const CloseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    const ArrowLeftIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );

    const ArrowRightIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );

    const FullscreenIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen ? (
                <>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </>
            ) : (
                <>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </>
            )}
        </svg>
    );

    return (
        <div id='managementcommittee' className={`w-full ${isDark ? '' : 'bg-white'}`}>
            {/* Section 1: Title + Members */}
            <div className="px-4 py-3">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Left Title */}
                    <div className="md:w-[380px] text-center md:text-left shrink-0 mb-6 md:mb-0">
                        <div className="inline-block">
                            <div className="h-0.5 bg-[#C7A006] mb-2" />
                            <h2 className={`text-[36px] md:text-[40px] font-extrabold leading-tight ${isDark ? '' : 'bg-white'} tracking-tight whitespace-nowrap`}>
                                MANAGEMENT <br /> COMMITTEE
                            </h2>
                            <div className="h-0.5 bg-[#C7A006] mt-2" />
                        </div>
                    </div>

                    {/* Right Members - 3 per row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        {members.slice(0, 3).map((member, idx) => (
                            <MemberCard key={idx} member={member} index={idx} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 2: Long Text + Members */}
            <div className="px-4 py-3 ">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
                    {/* Left Long Text */}
                    <div className="md:w-[380px] w-full text-center md:text-left shrink-0 mb-6 md:mb-0">
                        <div className="inline-block max-w-xs md:max-w-none ">
                            <p className="text-[15px] font-serif text-justify leading-relaxed">
                                The management of business of ROBA is vested in Working Committee subject to direction of the general body, and is empowered to frame rules and prescribe fees & charges for Reunions, cultural activities etc. and to give financial assistance as deemed fit and within the resources of ROBA. The Working Committee is duly elected from amongst the life members at the AGM and comprises office bearers living in the Delhi and or from dedicated volunteers from other stations to form, President, Honorary Secretary – a serving officer, Honorary Treasurer, Honorary Asst. Secretaries – 2 (serving offrs), Regional Secretaries – 5, Members – 9. Besides these, suitable Life members may be invited to join the Working Committee as co-opted members for a specific purpose and a specific duration, for assisting in furthering the aims and objects of ROBA. However, no one can become a member of the Working Committee, whether elected or co-opted; unless he has paid all dues including the minimum donation to ROBA Trust, or has been convicted by any court for any offence involving moral turpitude and / or has been sentenced to imprisonment. The Commandant of the RIMC and the Honorary Editor of the Rimcollian Journal shall be ex- officio members of the Working Committee
                            </p>
                        </div>
                    </div>

                    {/* Right Members Grid - 3 per row on larger screens, responsive on smaller */}
                    <div className="grid grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        {members2.map((member, idx) => (
                            <MemberCard key={idx} member={member} index={idx + 3} />
                        ))}
                        {members3.map((member, idx) => (
                            <MemberCard key={idx} member={member} index={idx + 6} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: Contact button + Members */}
            <div className="w-full py-3 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10">
                    {/* Left: Button Section */}
                    <div className="md:w-[380px] w-full text-center md:text-left shrink-0 mb-6 md:mb-0 flex flex-col items-center justify-center">
                        <button className="border font-serif border-[#C7A006]  px-5 py-3 text-sm font-semibold hover:bg-[#C7A006] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C7A006] rounded shadow">
                            CONNECT WITH US
                        </button>
                    </div>

                    {/* Right: Members Section - 3 per row on larger screens, responsive on smaller */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        {members4.slice(0, 3).map((member, idx) => (
                            <MemberCard key={idx} member={member} index={idx + 9} />
                        ))}
                    </div>
                </div>

                {/* Fourth member in a new row, centered */}
                {members4.length > 3 && (
                    <div className="max-w-5xl mx-auto mt-10">
                        <div className="flex justify-center">
                            <div className="w-full max-w-[140px]">
                                <MemberCard member={members4[3]} index={12} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Full Screen Gallery */}
            {galleryOpen && (
                <div
                    className="fixed inset-0 bg-white z-50 flex items-center justify-center"
                    id="gallery-container"
                >
                    <div className="relative w-full h-full flex flex-col md:flex-row">
                        {/* Left: Image */}
                        <div className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center p-4">
                            <img
                                src={members[currentImageIndex].image}
                                alt={members[currentImageIndex].name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        {/* Right: Member Info */}
                        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-gray-100 p-8 flex flex-col justify-center">
                            <h2 className="text-3xl text-gray-800 font-bold mb-2">{members[currentImageIndex].name}</h2>
                            <p className="text-xl text-gray-600 mb-2">{members[currentImageIndex].tenure}</p>
                            <p className="text-xl text-gray-800 font-medium">{members[currentImageIndex].role}</p>
                        </div>

                        {/* Controls */}
                        <div className="absolute top-4 right-4 flex gap-4">
                            <button
                                onClick={toggleFullscreen}
                                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all"
                                aria-label="Toggle fullscreen"
                            >
                                <FullscreenIcon />
                            </button>
                            <button
                                onClick={closeGallery}
                                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all"
                                aria-label="Close gallery"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all"
                            aria-label="Previous image"
                        >
                            <ArrowLeftIcon />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-all"
                            aria-label="Next image"
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementCommitee;