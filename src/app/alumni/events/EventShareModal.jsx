// EventShareModal.jsx - Modal component for sharing events
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import EventShareService from "./EventShareService";
import { useTheme } from "@/context/ThemeProvider";

const EventShareModal = ({ eventData, isOpen, onClose }) => {
    const [isSharing, setIsSharing] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isOpen) return null;

    const handleShare = async (platform) => {
        try {
            setIsSharing(true);

            // Share to the selected platform
            if (platform) {
                const shared = EventShareService.shareToSocialMedia(eventData, platform);

                if (shared) {
                    toast.success(`Sharing to ${platform}...`);
                    onClose();
                } else {
                    toast.error(`Unable to share to ${platform}`);
                }
            } else {
                // Try native sharing first
                const shared = await EventShareService.nativeShare(eventData);

                if (shared) {
                    onClose();
                } else {
                    toast.error("Please select a specific sharing method");
                }
            }
        } catch (error) {
            toast.error("An error occurred while sharing the event.");
        } finally {
            setIsSharing(false);
        }
    };

    const copyLink = async () => {
        const copied = await EventShareService.copyEventLink(eventData._id);

        if (copied) {
            toast.success("Event link copied to clipboard!");
            onClose();
        } else {
            toast.error("Failed to copy link");
        }
    };

    const addToCalendar = () => {
        try {
            EventShareService.downloadCalendarEvent(eventData);
            toast.success("Calendar event downloaded");
            onClose();
        } catch (error) {
            console.error("Failed to download calendar event:", error);
            toast.error("Failed to download calendar event");
        }
    };

    // Format the event date for display
    const formattedDate = eventData.date
        ? new Date(eventData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'TBD';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md mx-4`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Share Event</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Event Preview */}
                    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-[#1F2447]' : 'bg-gray-100'}`}>
                        <h3 className="font-bold">{eventData.title}</h3>
                        <p className="text-sm mb-1">{formattedDate}</p>
                        <p className="text-sm line-clamp-2">{eventData.description}</p>
                    </div>

                    {/* Share Options */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50"
                            disabled={isSharing}
                        >
                            <Icon icon="mdi:facebook" className="text-blue-600" width="32" height="32" />
                            <span className="text-xs mt-1">Facebook</span>
                        </button>

                        <button
                            onClick={() => handleShare('twitter')}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50"
                            disabled={isSharing}
                        >
                            <Icon icon="mdi:twitter" className="text-blue-400" width="32" height="32" />
                            <span className="text-xs mt-1">Twitter</span>
                        </button>

                        <button
                            onClick={() => handleShare('linkedin')}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50"
                            disabled={isSharing}
                        >
                            <Icon icon="mdi:linkedin" className="text-blue-700" width="32" height="32" />
                            <span className="text-xs mt-1">LinkedIn</span>
                        </button>

                        <button
                            onClick={() => handleShare('whatsapp')}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50"
                            disabled={isSharing}
                        >
                            <Icon icon="mdi:whatsapp" className="text-green-500" width="32" height="32" />
                            <span className="text-xs mt-1">WhatsApp</span>
                        </button>
                    </div>

                    {/* Copy Link */}
                    <div className={`flex items-center p-2 rounded-md mb-4 ${isDark ? 'bg-[#1F2447]' : 'bg-gray-100'}`}>
                        <input
                            type="text"
                            value={EventShareService.getEventUrl(eventData._id)}
                            className={`flex-1 bg-transparent outline-none text-sm p-1 mr-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            readOnly
                        />
                        <button
                            onClick={copyLink}
                            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                            disabled={isSharing}
                        >
                            <Icon icon="mdi:content-copy" width="16" height="16" />
                        </button>
                    </div>

                    {/* Calendar button */}
                    <button
                        onClick={addToCalendar}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 mb-3"
                        disabled={isSharing}
                    >
                        <Icon icon="mdi:calendar" width="20" height="20" />
                        <span>Add to Calendar</span>
                    </button>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`w-full py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg`}
                        disabled={isSharing}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventShareModal;