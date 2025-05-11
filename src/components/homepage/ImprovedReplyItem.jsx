// ImprovedReplyItem.jsx - Fully Recursive Component for Infinite Nesting
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { LuReply } from "react-icons/lu"; // Import LuReply icon to match Comment component
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import { useTheme } from "@/context/ThemeProvider";
// Helper function to calculate time ago
export const timeAgo = (timestamp) => {
    if (!timestamp) return "Invalid date";
    const now = new Date();
    const past = new Date(timestamp);
    if (isNaN(past.getTime())) return "Invalid date";
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffInSeconds < 1) return "Just now";
    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };
    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(diffInSeconds / seconds);
        if (count > 0) {
            return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
};

// Recursive Reply Component - Supports up to any level of nesting
const ImprovedReplyItem = ({ reply, postId, userId, refreshComments, level = 0, nestingLevel = 0 }) => {
    const [isLiked, setIsLiked] = useState(
        reply.likes?.some(like => like._id === userId) || false
    );
    const [likesCount, setLikesCount] = useState(reply.likes?.length || 0);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(nestingLevel < 2); // Auto-expand first two levels
    const [localReplies, setLocalReplies] = useState(reply.replies || []);
    const [isDeleting, setIsDeleting] = useState(false);
    const url = process.env.NEXT_PUBLIC_URL;

    // Update localReplies when reply.replies changes
    useEffect(() => {
        if (reply.replies) {
            setLocalReplies(reply.replies);
        }
    }, [reply.replies]);

    // Whether this reply has nested replies
    const hasReplies = localReplies && localReplies.length > 0;

    // Handle liking a reply
    const handleLikeReply = async () => {
        try {
            const token = await gettoken();
            const response = await fetch(
                `${url}/api/posts/${postId}/reply/${reply._id}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();

            if (response.ok) {
                setIsLiked(data.isLiked);
                setLikesCount(data.likes);
            } else {
                toast.error(data?.message || "Failed to like reply.");
            }
        } catch (error) {
            console.error("Error liking reply:", error);
            toast.error("An error occurred while liking the reply.");
        }
    };

    // Handle submitting a reply to this reply
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) {
            return;
        }

        try {
            const token = await gettoken();
            const response = await fetch(
                `${url}/api/posts/${postId}/reply/${reply._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text: replyText }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setReplyText("");
                setIsReplying(false);

                // Optimistic update: Add the reply locally
                if (data.reply) {
                    setLocalReplies(prevReplies => [...prevReplies, data.reply]);
                }

                // Ensure replies are shown after adding a new one
                setShowReplies(true);

                // Then refresh from server to ensure data consistency
                await refreshComments();
            } else {
                const data = await response.json();
                toast.error(data?.message || "Failed to add reply.");
            }
        } catch (error) {
            console.error("Error adding reply:", error);
            toast.error("An error occurred while adding the reply.");
        }
    };

    // Delete reply function with improved error handling
    const handleDeleteReply = async () => {
        if (isDeleting) return; // Prevent multiple delete attempts

        setIsDeleting(true);
        const toastId = toast.loading("Deleting reply...");

        try {
            const token = await gettoken();

            // Improved delete API call
            const response = await fetch(
                `${url}/api/posts/${postId}/reply/${reply._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Reply deleted successfully", { id: toastId });

                // Optimistic UI update - remove the reply locally
                setLocalReplies([]);

                // Force refresh to ensure UI is updated correctly
                setTimeout(() => {
                    refreshComments();
                }, 300);
            } else {
                console.error("Delete error response:", data);
                toast.error(data?.message || "Failed to delete reply", { id: toastId });
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
            toast.error("An error occurred while deleting the reply", { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    // Calculate indentation based on nesting level
    const indentClassName = level > 0
        ? `pl-${Math.min(level * 2, 8)} ml-${Math.min(level, 4)} border-l border-gray-200`
        : '';

    // Check if the current user is the author of this reply
    const isReplyAuthor = userId === reply.user?._id;
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`mt-2 ${indentClassName}`}>
            <div className="flex gap-2">
                {/* Updated to match Comment component's avatar size */}

                <div className="flex-1 min-w-0">
                    <div className="rounded-lg px-3 py-2 relative group">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={
                                        reply.user?.profilePicture
                                            ? `${url}/uploads/${reply.user?.profilePicture?.split("\\").pop()}`
                                            : "/memberpage/member.png"
                                    }
                                    alt="avatar"
                                />
                            </div>
                            {/* Updated username styling to match Comment component */}
                            <p className="text-[18px] whitespace-nowrap">{reply.user?.name || "User"}</p>
                            {/* Updated timestamp styling to match Comment component */}
                            <p className="text-[16px] text-gray-500">{timeAgo(reply.createdAt)}</p>
                        </div>
                        {/* Updated text size to match Comment component */}
                        <p className="text-[16px] mt-2 break-words">{reply.text}</p>

                        {/* Delete Button - Show for reply author */}
                        {isReplyAuthor && !isDeleting && (
                            <button
                                onClick={handleDeleteReply}
                                className="hidden group-hover:block absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                aria-label="Delete reply"
                            >
                                <Icon icon="mdi:delete-outline" width="16" height="16" />
                            </button>
                        )}

                        {/* Deleting indicator */}
                        {isDeleting && (
                            <div className="absolute top-2 right-2 text-gray-400">
                                <Icon icon="mdi:loading" className="animate-spin" width="16" height="16" />
                            </div>
                        )}
                    </div>

                    {/* Reply interaction buttons - Updated to match Comment styling */}
                    <div className="flex items-center gap-4 mt-2 text-[16px] text-gray-500">
                        <button
                            onClick={handleLikeReply}
                            className={`${isLiked ? "text-blue-600" : "text-gray-500"}`}
                            disabled={isDeleting}
                        >
                            {likesCount > 0 ? `${likesCount} ` : ""}Like
                        </button>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-gray-500"
                            disabled={isDeleting}
                        >
                            <span className="flex items-center flex-row gap-2">
                                <LuReply />
                                Reply
                            </span>
                        </button>
                    </div>

                    {/* Reply form - Updated to match Comment styling */}
                    {isReplying && !isDeleting && (
                        <form onSubmit={handleSubmitReply} className="mt-3 ml-2 flex items-center justify-center gap-2">
                            <div className="w-6 h-6 mb-5 flex-shrink-0">
                                <img
                                    className="w-6 h-6 rounded-full"
                                    src={
                                        reply.user?.profilePicture
                                            ? `${url}/uploads/${reply.user?.profilePicture?.split("\\").pop()}`
                                            : "/memberpage/member.png"
                                    }
                                    alt="avatar"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className={`w-full px-3 py-2 mb-5 text-sm border rounded-lg ${isDark ? 'bg-[#2A3057]' : 'bg-white'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="absolute right-3 top-1/3 transform -translate-y-1/2 text-blue-500 disabled:text-gray-300"
                                >
                                    <Icon icon="mdi:send" width="16" height="16" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Nested Replies Section - Recursively render replies */}
                    {hasReplies && !isDeleting && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-[16px] text-blue-500 font-medium mb-2 flex items-center hover:underline"
                            >
                                <Icon
                                    icon={showReplies ? "mdi:chevron-down" : "mdi:chevron-right"}
                                    width="16"
                                    height="16"
                                    className="mr-1"
                                />
                                {showReplies ? "Hide" : "View"} {localReplies.length} {localReplies.length === 1 ? "reply" : "replies"}
                            </button>

                            {showReplies && (
                                <div className="space-y-1">
                                    {localReplies.map((nestedReply, index) => (
                                        <ImprovedReplyItem
                                            key={nestedReply._id || `nested-${index}-${Date.now()}`}
                                            reply={nestedReply}
                                            postId={postId}
                                            userId={userId}
                                            refreshComments={refreshComments}
                                            level={level + 1} // Increment the level for each nesting
                                            nestingLevel={nestingLevel + 1} // Track total nesting depth
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImprovedReplyItem;