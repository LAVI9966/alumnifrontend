// PostShareModal.jsx - A modal for sharing posts with more options
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import ShareService from "./ShareService";
import { useTheme } from "@/context/ThemeProvider";

const PostShareModal = ({ postData, isOpen, onClose, onShare }) => {
    const [isSharing, setIsSharing] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isOpen) return null;

    const handleShare = async (platform) => {
        try {
            setIsSharing(true);

            // Call the API to log the share
            const result = await ShareService.sharePost(postData._id);

            if (result.success) {
                // Update the parent component's state
                if (onShare) {
                    onShare(result.shares);
                }

                if (platform) {
                    // Share to the selected platform
                    const shared = ShareService.shareToSocialMedia(postData, platform);

                    if (shared) {
                        toast.success(`Sharing to ${platform}...`);
                    } else {
                        toast.error(`Unable to share to ${platform}`);
                    }
                } else {
                    toast.success(result.message);
                }

                // Close the modal
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while sharing the post.");
        } finally {
            setIsSharing(false);
        }
    };

    const copyLink = async () => {
        // Log the share to the server first
        const result = await ShareService.sharePost(postData._id);

        if (result.success && onShare) {
            onShare(result.shares);
        }

        // Then copy the link
        const copied = await ShareService.copyPostLink(postData._id);

        if (copied) {
            toast.success("Link copied to clipboard!");
            onClose();
        } else {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md mx-4`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Share Post</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Post Preview */}
                    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-[#1F2447]' : 'bg-gray-100'}`}>
                        <p className="text-sm line-clamp-2">
                            {postData.content}
                        </p>
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
                            value={ShareService.getPostUrl(postData._id)}
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

                    {/* Share Button */}
                    <button
                        onClick={() => handleShare()}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                        disabled={isSharing}
                    >
                        {isSharing ? (
                            <>
                                <Icon icon="mdi:loading" width="20" height="20" className="animate-spin" />
                                <span>Sharing...</span>
                            </>
                        ) : (
                            <>
                                <Icon icon="mdi:share" width="20" height="20" />
                                <span>Share Post</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostShareModal;