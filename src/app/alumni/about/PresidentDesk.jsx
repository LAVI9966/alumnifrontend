import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
const PresidentDesk = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div id='presidentmessage'>
            <div className="text-center my-10 md:my-14">
                <div className="relative inline-block px-4">
                    {/* Top line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C7A006] -translate-y-3" />

                    {/* Text */}
                    <h2 className={`${isDark ? '' : 'bg-white'} font-bold text-3xl sm:text-4xl md:text-5xl px-2 md:whitespace-nowrap`}>
                        FROM THE PRESIDENT'S DESK
                    </h2>

                    {/* Bottom line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C7A006] translate-y-3" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 my-8 md:my-12 font-serif">
                <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-6 md:gap-8">
                    {/* Left Text Section */}
                    <div className="w-full md:w-3/4 text-justify text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed font-[500] p-4">
                        <p className="mb-4">
                            Warm Greetings to all Rimcollians and their families. The year 2021
                            is more than half way through and we seem to be standing at the
                            threshold of our Centenary Celebrations. The global pandemic
                            continues to wreck havoc with our lives and work, however the
                            preparations for this significant event is continuing unabated.
                            Forever resilient in the face of adversity, we are assured to mark
                            the 100th Founders’ Day celebration with zeal and enthusiasm.
                        </p>
                        <p className="mb-4">
                            With steely grit, RIMC continues offline classes with physical
                            presence of cadets, the staff and the entire administration round
                            the clock, ensuring quality education and extra-curricular
                            activities during these challenging times. Commandant & Team RIMC
                            deserves special mention for keeping the edifice running with
                            adroitness during the pandemic and ensuring that everyone is
                            performing to their best. Lastly, my heart swells with pride when I
                            tell people about the performance of RIMC Cadets in the recent NDA
                            entry exams. 18 Cadets are joining this term, with 5 cadets making
                            it in the top 10 in the NDA Merit list (4 in the first 5). Vive La
                            Rimcollians! Congratulations to the Commandant and his team for
                            this stupendous effort in these tough times. Living up to adage
                            “When the going gets tough, the tough get going!”
                        </p>
                        <p className="mb-4">
                            As we are rapidly approaching the milestone event, the pace of the
                            work is reaching a crescendo with unparallel enthusiasm and passion.
                            I request all Rimcollians to share necessary details with ROBA
                            Office and help in whichever way possible.
                        </p>
                        <p className="mb-6">
                            Heart warming Wishes to all Rimcollians and their families, with the
                            hope to see you all next year at the mega event.
                        </p>
                        <p className="text-center text-[15px] sm:text-[16px] font-semibold italic">
                            God Bless Rimcollians – ICH DIEN
                        </p>
                    </div>

                    {/* Right Image and Caption Section */}
                    <div className="w-full md:w-1/4 flex flex-col items-center text-center">
                        <img
                            src="/President_img.avif"
                            alt="Air Chief Marshal BS Dhanoa"
                            className="w-40 sm:w-48 md:w-full max-w-[250px] object-contain"
                        />
                        <p className="mt-3 sm:mt-4 italic text-[#1A1A1A] font-medium text-sm">
                            <span className={`block ${isDark ? 'text-white' : 'text-[#1F2937]'} text-[15px]`}>Air Chief Marshal BS Dhanoa</span>
                            <span className="text-[13px] text-[#7A6A13] font-semibold">
                                PVSM, AVSM, YSM, VM, ADC
                            </span>
                        </p>
                        <div className="w-full h-[2px] bg-[#C7A006] mt-2 mb-1" />
                        <div className="w-12 h-1 border-b-4 border-[#C7A006] border-dotted" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PresidentDesk
