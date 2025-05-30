import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

const ReplyItem = ({ reply, postId, commentId, onReplyAdded, onReplyDelete, path = [] }) => {
    const [localReplies, setLocalReplies] = useState(reply.replies || []);
    const [localLikes, setLocalLikes] = useState(reply.likes || []);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setLocalReplies(reply.replies || []);
        setLocalLikes(reply.likes || []);
    }, [reply]);

    const handleLikeReply = async () => {
        try {
            const token = gettoken();
            if (!token) {
                toast.error("Please login to like replies");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}/replies/${reply._id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ path }),
            });

            if (!response.ok) {
                throw new Error("Failed to like reply");
            }

            const data = await response.json();
            setLocalLikes(data.likes);
            toast.success("Reply liked successfully");
        } catch (error) {
            console.error("Error liking reply:", error);
            toast.error("Failed to like reply");
        }
    };

    const handleAddReply = async () => {
        if (!replyText.trim()) {
            toast.error("Please enter a reply");
            return;
        }

        try {
            const token = gettoken();
            if (!token) {
                toast.error("Please login to reply");
                return;
            }

            const toastId = toast.loading("Adding reply...");

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}/replies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: replyText,
                    commentId,
                    parentReplyId: reply._id,
                    path: [...path, reply._id],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add reply");
            }

            const newReply = await response.json();
            setLocalReplies([...localReplies, newReply]);
            setReplyText("");
            setShowReplyForm(false);
            toast.success("Reply added successfully", { id: toastId });
            if (onReplyAdded) onReplyAdded(newReply);
        } catch (error) {
            console.error("Error adding reply:", error);
            toast.error("Failed to add reply");
        }
    };

    const handleDeleteReply = async () => {
        if (isDeleting) return;

        try {
            const token = gettoken();
            if (!token) {
                toast.error("Please login to delete replies");
                return;
            }

            const toastId = toast.loading("Deleting reply...");
            setIsDeleting(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}/reply/${reply._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete reply");
            }

            toast.success("Reply deleted successfully", { id: toastId });
            if (onReplyDelete) onReplyDelete(reply._id);
        } catch (error) {
            console.error("Error deleting reply:", error);
            toast.error("Failed to delete reply");
        } finally {
            setIsDeleting(false);
        }
    };

    const isLiked = localLikes.some((like) => like.user === reply.user._id);
    const hasReplies = localReplies.length > 0;

    return (
        <div className="ml-8 mt-4 border-l-2 border-gray-200 pl-4">
            <div className="flex items-start space-x-2">
                <img
                    src={reply.user.profilePicture || "/default-avatar.png"}
                    alt={reply.user.name}
                    className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">{reply.user.name}</span>
                                <span className="text-gray-500 text-sm">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {(reply.user._id === reply.user._id || reply.postAuthor === reply.user._id) && (
                                <button
                                    onClick={handleDeleteReply}
                                    disabled={isDeleting}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Icon icon="mdi:delete" className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <p className="mt-1">{reply.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                        <button
                            onClick={handleLikeReply}
                            className={`flex items-center space-x-1 ${isLiked ? "text-blue-500" : "text-gray-500"
                                }`}
                        >
                            <Icon icon="mdi:thumb-up" className="w-4 h-4" />
                            <span>{localLikes.length}</span>
                        </button>
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Reply
                        </button>
                        {hasReplies && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {showReplies ? "Hide Replies" : `Show Replies (${localReplies.length})`}
                            </button>
                        )}
                    </div>
                    {showReplyForm && (
                        <form onSubmit={handleAddReply} className="mt-2">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReplyForm(false)}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {showReplies && hasReplies && (
                <div className="mt-4">
                    {localReplies.map((nestedReply) => (
                        <ReplyItem
                            key={nestedReply._id}
                            reply={nestedReply}
                            postId={postId}
                            commentId={commentId}
                            onReplyAdded={onReplyAdded}
                            onReplyDelete={onReplyDelete}
                            path={[...path, reply._id]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReplyItem; 