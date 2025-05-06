// ReplyItem.jsx - Recursive Component for Rendering Replies at Any Level
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

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

// Recursive Reply Component
const ReplyItem = ({ reply, postId, userId, refreshComments, level = 0, path = "" }) => {
    const [isLiked, setIsLiked] = useState(
        reply.likes?.some(like => like._id === userId) || false
    );
    const [likesCount, setLikesCount] = useState(reply.likes?.length || 0);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [localReplies, setLocalReplies] = useState(reply.replies || []);
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
                toast.success(data.isLiked ? "Reply liked!" : "Reply unliked!");
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
            toast.error("Reply cannot be empty!");
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

                // Then refresh from server to ensure data consistency
                await refreshComments();
                setShowReplies(true);
                toast.success("Reply added successfully!");
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
        // Use toast for confirmation instead of alert
        const toastId = toast.loading("Deleting reply...");

        try {
            const token = await gettoken();

            // Log the delete request details for debugging
            console.log("Deleting reply:", {
                postId,
                replyId: reply._id,
                path,
                userId,
                replyUserId: reply.user?._id
            });

            const response = await fetch(
                `${url}/api/posts/${postId}/reply/${reply._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        path: path,
                        replyId: reply._id,
                        userId: userId // Add userId to the request
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success("Reply deleted successfully!", { id: toastId });
                // Force a thorough refresh to ensure UI is updated
                await refreshComments();
            } else {
                console.error("Delete error response:", data);
                toast.error(data?.message || "Failed to delete reply. Please try again.", { id: toastId });
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
            toast.error("An error occurred while deleting the reply. Please try again.", { id: toastId });
        }
    };

    // Use a consistent indentation with a vertical line
    const indentClassName = level > 0 ? `pl-3 ml-2 border-l border-gray-200` : '';

    // Check if the current user is the author of this reply
    const isReplyAuthor = userId === reply.user?._id;

    return (
        <div className={`mt-2 ${indentClassName}`}>
            <div className="flex gap-2">
                {/* User avatar with consistent size */}
                <div className="w-6 h-6 flex-shrink-0">
                    <img
                        className="w-6 h-6 rounded-full object-cover"
                        src={
                            reply.user?.profilePicture
                                ? `${url}/uploads/${reply.user?.profilePicture?.split("\\").pop()}`
                                : "/memberpage/member.png"
                        }
                        alt="avatar"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="rounded-lg px-3 py-2 text-sm relative group bg-gray-50">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-xs">{reply.user?.name || "User"}</p>
                            <p className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</p>
                        </div>
                        <p className="text-sm break-words">{reply.text}</p>

                        {/* Delete Button - Show for reply author */}
                        {isReplyAuthor && (
                            <button
                                onClick={handleDeleteReply}
                                className="hidden group-hover:block absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                aria-label="Delete reply"
                            >
                                <Icon icon="mdi:delete-outline" width="16" height="16" />
                            </button>
                        )}
                    </div>

                    {/* Reply interaction buttons */}
                    <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
                        <button
                            onClick={handleLikeReply}
                            className={`${isLiked ? "text-blue-600" : "text-gray-500"} hover:underline`}
                        >
                            Like {likesCount > 0 ? `(${likesCount})` : ""}
                        </button>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-gray-500 hover:underline"
                        >
                            Reply
                        </button>
                    </div>

                    {/* Reply form */}
                    {isReplying && (
                        <form onSubmit={handleSubmitReply} className="mt-2 ml-2 flex gap-2">
                            <div className="w-6 h-6 flex-shrink-0">
                                <img
                                    className="w-6 h-6 rounded-full"
                                    src="/memberpage/member.png"
                                    alt="avatar"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full px-3 py-1 text-xs border rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:text-gray-300"
                                >
                                    <Icon icon="mdi:send" width="14" height="14" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Nested Replies Section - Recursively render replies */}
                    {hasReplies && (
                        <div className="ml-1 mt-2">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-xs text-blue-500 font-medium mb-2 flex items-center hover:underline"
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
                                        <ReplyItem
                                            key={nestedReply._id || `nested-${index}-${Date.now()}`}
                                            reply={nestedReply}
                                            postId={postId}
                                            userId={userId}
                                            refreshComments={refreshComments}
                                            level={level + 1} // Increment the level for each nesting
                                            path={`${path ? path + '.' : ''}${reply._id}.replies.${index}`} // Track path for deletion
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

export default ReplyItem;