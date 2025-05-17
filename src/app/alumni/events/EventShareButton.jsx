// Fixed EventShareButton.jsx - Resolved button nesting issue
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import EventShareService from "./EventShareService";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";

const EventShareButton = ({ eventData }) => {
    const [isSharing, setIsSharing] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleShare = async (platform) => {
        try {
            setIsSharing(true);

            if (platform) {
                // Share to the selected platform
                const shared = EventShareService.shareToSocialMedia(eventData, platform);

                if (shared) {
                    toast.success(`Sharing to ${platform}...`);
                } else {
                    toast.error(`Unable to share to ${platform}`);
                }
            } else {
                // Try native sharing (for mobile devices)
                const shared = await EventShareService.nativeShare(eventData);

                if (!shared) {
                    // If native sharing fails, fall back to copying the link
                    const copied = await EventShareService.copyEventLink(eventData._id);

                    if (copied) {
                        toast.success("Event link copied to clipboard!");
                    } else {
                        toast.error("Failed to share event");
                    }
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
        } else {
            toast.error("Failed to copy link");
        }
    };

    const addToCalendar = () => {
        try {
            EventShareService.downloadCalendarEvent(eventData);
            toast.success("Calendar event downloaded");
        } catch (error) {
            console.error("Failed to download calendar event:", error);
            toast.error("Failed to download calendar event");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* Use a div instead of a button to prevent nesting issues */}
                <div className={`flex items-center gap-1 text-sm border border-[#C7A006] rounded-lg p-1 px-2 cursor-pointer ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    <Icon
                        icon="mdi:share-outline"
                        width="18"
                        height="18"
                        className="text-[#C7A006]"
                    />
                    <span>Share</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-48 p-2 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} shadow-lg rounded-lg`}>
                <DropdownMenuLabel className="px-2 py-1 text-sm">Share Event</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:facebook" className="text-blue-600" width="20" height="20" />
                    <span>Facebook</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:twitter" className="text-blue-400" width="20" height="20" />
                    <span>Twitter</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:linkedin" className="text-blue-700" width="20" height="20" />
                    <span>LinkedIn</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:whatsapp" className="text-green-500" width="20" height="20" />
                    <span>WhatsApp</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={copyLink}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:content-copy" width="20" height="20" />
                    <span>Copy Link</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={addToCalendar}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:calendar" width="20" height="20" />
                    <span>Add to Calendar</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EventShareButton;