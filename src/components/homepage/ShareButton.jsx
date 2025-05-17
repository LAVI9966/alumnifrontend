// ShareButton.jsx - Reusable share button component with dropdown
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import ShareService from "./ShareService";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";

const ShareButton = ({ postData, handleShareCallback }) => {
    const [isSharing, setIsSharing] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleShare = async () => {
        try {
            setIsSharing(true);

            // Call the API to log the share
            const result = await ShareService.sharePost(postData._id);

            if (result.success) {
                // Update the parent component's state
                if (handleShareCallback) {
                    handleShareCallback(result.shares);
                }

                // We don't show toast here since we're showing the dropdown
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while sharing the post.");
        } finally {
            setIsSharing(false);
        }
    };

    const shareToSocialMedia = async (platform) => {
        // Log the share to the server first
        await handleShare();

        // Then share to the selected platform
        const shared = ShareService.shareToSocialMedia(postData, platform);

        if (shared) {
            toast.success(`Sharing to ${platform}...`);
        } else {
            toast.error(`Unable to share to ${platform}`);
        }
    };

    const copyLink = async () => {
        // Log the share to the server first
        await handleShare();

        // Then copy the link
        const copied = await ShareService.copyPostLink(postData._id);

        if (copied) {
            toast.success("Link copied to clipboard!");
        } else {
            toast.error("Failed to copy link");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Icon
                    icon="mdi:share-outline"
                    width="24"
                    height="24"
                    className={`cursor-pointer ${isDark ? "text-white" : "text-[#131A45]"}`}
                    onClick={() => { }}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-48 p-2 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} shadow-lg rounded-lg`}>
                <DropdownMenuLabel className="px-2 py-1 text-sm">Share Post</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => shareToSocialMedia('facebook')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:facebook" className="text-blue-600" width="20" height="20" />
                    <span>Facebook</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => shareToSocialMedia('twitter')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:twitter" className="text-blue-400" width="20" height="20" />
                    <span>Twitter</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => shareToSocialMedia('linkedin')}
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-blue-50 rounded-md"
                >
                    <Icon icon="mdi:linkedin" className="text-blue-700" width="20" height="20" />
                    <span>LinkedIn</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => shareToSocialMedia('whatsapp')}
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ShareButton;