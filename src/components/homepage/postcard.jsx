// Improved Postcard.jsx with better state management for immediate re-rendering
import React, { useState, useRef, useEffect } from "react";
import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { LuReply } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import CreatePostDialogue from "./createpostdialogue";
import Link from "next/link";
import ReplyItem from "./ReaplyItem";
import ImprovedReplyItem from "./ImprovedReplyItem";
import { useTheme } from "@/context/ThemeProvider";
import ImageGallery from "./ImageGallery";
import ShareButton from "./ShareButton";
import PostShareModal from "./PostShareModal";
import { timeAgo } from "./utils";
// export const timeAgo = (timestamp) => {
//   if (!timestamp) return "Invalid date";

//   const now = new Date();
//   const past = new Date(timestamp);

//   if (isNaN(past.getTime())) return "Invalid date"; // Handle invalid timestamps

//   const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

//   if (diffInSeconds < 1) return "Just now"; // If less than 1 second difference

//   const intervals = {
//     year: 31536000,
//     month: 2592000,
//     day: 86400,
//     hour: 3600,
//     minute: 60,
//     second: 1,
//   };

//   for (const [unit, seconds] of Object.entries(intervals)) {
//     const count = Math.floor(diffInSeconds / seconds);
//     if (count > 0) {
//       return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
//     }
//   }

//   return "Just now";
// };

// Update this part in your Postcard.jsx file

const Comment = ({ comment, postId, userId, handleDeleteComment, refreshComments }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.some(like => like._id === userId)
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
  const [visibleReplies, setVisibleReplies] = useState(3); // Show only first 3 replies initially
  const [localReplies, setLocalReplies] = useState(comment.replies || []);
  const [isDeleting, setIsDeleting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Update localReplies when comment.replies changes
  useEffect(() => {
    setLocalReplies(comment.replies || []);
  }, [comment.replies]);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleShowMoreReplies = () => {
    setVisibleReplies(localReplies.length);
  };

  const handleLikeComment = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${postId}/comment/${comment._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likes);
      } else {
        toast.error(data?.message || "Failed to like comment.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const token = await gettoken();
      // Use the generic reply endpoint
      const response = await fetch(`${url}/api/posts/${postId}/reply/${comment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText }),
      });
      const data = await response.json();
      if (response.ok) {
        setReplyText("");
        setIsReplying(false);

        // Optimistic update: Add the reply locally before refreshing from server
        if (data.reply) {
          setLocalReplies(prevReplies => [...prevReplies, data.reply]);
        }

        // Then refresh from server to ensure data consistency
        refreshComments();
        setShowReplies(true); // Show replies after adding a new one
      } else {
        toast.error(data?.message || "Failed to add reply.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`flex gap-2 mb-4 ${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-lg p-1 `}>
      <div className="flex-1 min-w-0">
        <div className="rounded-lg relative group">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                comment.user?.profilePicture
                  ? `${url}/uploads/${comment.user?.profilePicture?.split("\\").pop()}`
                  : "/memberpage/member.png"
              }
              alt="avatar"
            />

            {/* Username */}
            <p className="text-[18px] whitespace-nowrap">{comment.user?.name || "User"}</p>

            {/* Timestamp */}
            <p className="text-[16px] text-gray-500">{timeAgo(comment.createdAt)}</p>
          </div>

          <p className="text-[16px] mt-2 break-words">{comment.text}</p>

          {/* Comment Actions */}
          {(userId === comment.user?._id) && !isDeleting && (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="hidden group-hover:block absolute top-2 right-2 text-gray-400 hover:text-red-500"
              aria-label="Delete comment"
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

        {/* Comment interaction buttons */}
        <div className="flex items-center gap-4 mt-2 text-[16px] text-gray-500">
          <button
            onClick={handleLikeComment}
            className={`${isLiked ? "text-blue-600" : "text-gray-500"} `}
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

        {/* Reply Form */}
        {isReplying && !isDeleting && (
          <form onSubmit={handleAddReply} className="mt-3 ml-2 flex items-center justify-center gap-2">
            <div className="w-6 h-6 mb-5 flex-shrink-0">
              <img
                className="w-6 h-6 rounded-full"
                src={
                  comment.user?.profilePicture
                    ? `${url}/uploads/${comment.user?.profilePicture?.split("\\").pop()}`
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

        {/* Replies Section */}
        {localReplies.length > 0 && !isDeleting && (
          <div className="mt-3">
            <button
              onClick={handleToggleReplies}
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
              <div className="space-y-1 mt-2">
                {/* Show only the visible number of replies */}
                {localReplies.slice(0, visibleReplies).map((reply, index) => (
                  <ImprovedReplyItem
                    key={reply._id || `reply-${index}-${Date.now()}`}
                    reply={reply}
                    postId={postId}
                    userId={userId}
                    refreshComments={refreshComments}
                    level={0} // Start at level 0 for top-level replies
                    nestingLevel={0} // Start at nesting level 0
                  />
                ))}

                {/* Show more replies button */}
                {localReplies.length > visibleReplies && (
                  <button
                    onClick={handleShowMoreReplies}
                    className="text-xs text-blue-500 font-medium mt-2 ml-2 hover:underline"
                  >
                    Show {localReplies.length - visibleReplies} more {localReplies.length - visibleReplies === 1 ? "reply" : "replies"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Reply Component with Fixed Key Props
const Reply = ({ reply, postId, commentId, userId, onDelete, refreshComments }) => {
  const [isLiked, setIsLiked] = useState(
    reply.likes?.some(like => like._id === userId)
  );
  const [likesCount, setLikesCount] = useState(reply.likes?.length || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [nestedReplyText, setNestedReplyText] = useState("");
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;

  // Check if reply has nested replies
  const hasNestedReplies = reply.replies && reply.replies.length > 0;

  const handleLikeReply = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(
        `${url}/api/posts/${postId}/comment/${commentId}/reply/${reply._id}/like`,
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
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleNestedReply = async (e) => {
    e.preventDefault();
    if (!nestedReplyText.trim()) return;

    try {
      const token = await gettoken();
      const response = await fetch(
        `${url}/api/posts/${postId}/comment/${commentId}/reply/${reply._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: nestedReplyText }),
        }
      );

      if (response.ok) {
        setNestedReplyText("");
        setIsReplying(false);
        toast.success("Reply added successfully!");

        // After successfully adding a reply, refresh the comments
        await refreshComments();

        // Show nested replies section after adding a new reply
        setShowNestedReplies(true);
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to add reply.");
      }
    } catch (error) {
      console.error("Error adding nested reply:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeleteNestedReply = async (nestedReplyId) => {
    try {
      const token = await gettoken();
      const response = await fetch(
        `${url}/api/posts/${postId}/comment/${commentId}/reply/${reply._id}/reply/${nestedReplyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Reply deleted successfully!");
        // After successfully deleting a reply, refresh the comments
        await refreshComments();
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to delete reply.");
      }
    } catch (error) {
      console.error("Error deleting nested reply:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage
          className="w-6 h-6 rounded-full"
          src={
            reply.user?.profilePicture
              ? `${url}/uploads/${reply.user?.profilePicture
                ?.split("\\")
                .pop()}`
              : "/memberpage/member.png"
          }
          alt="avatar"
        />
      </Avatar>
      <div className="flex-1">
        <div className="rounded-lg px-3 py-2 text-sm relative group">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-xs">{reply.user?.name}</p>
            <p className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</p>
          </div>
          <p className="text-sm">{reply.text}</p>

          {/* Reply Actions */}
          {(userId === reply.user?._id) && (
            <button
              onClick={() => onDelete(reply._id)}
              className="hidden group-hover:block absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <Icon icon="mdi:delete-outline" width="16" height="16" />
            </button>
          )}
        </div>

        {/* Reply interaction buttons */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
          <button
            onClick={handleLikeReply}
            className={`${isLiked ? "text-blue-600" : "text-gray-500"}`}
          >
            Like {likesCount > 0 ? `(${likesCount})` : ""}
          </button>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-gray-500"
          >
            Reply
          </button>
          <span className="text-gray-500">{timeAgo(reply.createdAt)}</span>
        </div>

        {/* Nested Reply Form */}
        {isReplying && (
          <form onSubmit={handleNestedReply} className="mt-2 ml-2 flex gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                className="w-6 h-6 rounded-full"
                src="/memberpage/member.png"
                alt="avatar"
              />
            </Avatar>
            <div className="flex-1 relative">
              <input
                type="text"
                value={nestedReplyText}
                onChange={(e) => setNestedReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-1 text-sm border rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!nestedReplyText.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:text-gray-300"
              >
                <Icon icon="mdi:send" width="16" height="16" />
              </button>
            </div>
          </form>
        )}

        {/* Nested Replies Section */}
        {hasNestedReplies && (
          <div className="ml-6 mt-2">
            <button
              onClick={() => setShowNestedReplies(!showNestedReplies)}
              className="text-[16px] text-blue-500 font-medium mb-2 flex items-center"
            >
              <Icon
                icon={showNestedReplies ? "mdi:chevron-down" : "mdi:chevron-right"}
                width="16"
                height="16"
              />
              {showNestedReplies ? "Hide" : "View"} {reply.replies.length} {reply.replies.length === 1 ? "reply" : "replies"}
            </button>

            {showNestedReplies && (
              <div className="space-y-2">
                {/* Fixed key prop issue here - making sure each NestedReply has a unique key */}
                {reply.replies.map(nestedReply => (
                  <NestedReply
                    key={nestedReply._id || `nested-${Math.random()}`} // Ensure a unique key
                    nestedReply={nestedReply}
                    postId={postId}
                    commentId={commentId}
                    replyId={reply._id}
                    userId={userId}
                    onDelete={handleDeleteNestedReply}
                    refreshComments={refreshComments}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// NestedReply Component for Deeper Level Replies
const NestedReply = ({ nestedReply, postId, commentId, replyId, userId, onDelete, refreshComments }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const url = process.env.NEXT_PUBLIC_URL;

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const token = await gettoken();
      // We're replying to a nested reply
      const response = await fetch(
        `${url}/api/posts/${postId}/comment/${commentId}/reply/${replyId}/reply`,
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
        setReplyText("");
        setIsReplying(false);
        toast.success("Reply added successfully!");

        // Critical: Always refresh the entire comments section
        await refreshComments();
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to add reply.");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex gap-2 mt-2" key={nestedReply._id}>
      <Avatar className="w-5 h-5">
        <AvatarImage
          className="w-5 h-5 rounded-full"
          src={
            nestedReply.user?.profilePicture
              ? `${url}/uploads/${nestedReply.user?.profilePicture
                ?.split("\\")
                .pop()}`
              : "/memberpage/member.png"
          }
          alt="avatar"
        />
      </Avatar>
      <div className="flex-1">
        <div className="rounded-lg px-3 py-2 text-sm relative group">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-xs">{nestedReply.user?.name}</p>
            <p className="text-xs text-gray-500">{timeAgo(nestedReply.createdAt)}</p>
          </div>
          <p className="text-sm">{nestedReply.text}</p>

          {/* Delete button for nested replies */}
          {(userId === nestedReply.user?._id) && (
            <button
              onClick={() => onDelete(nestedReply._id)}
              className="hidden group-hover:block absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <Icon icon="mdi:delete-outline" width="16" height="16" />
            </button>
          )}
        </div>

        {/* Reply option for nested replies */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
          <button
            onClick={() => {
              setIsReplying(!isReplying);
              if (!isReplying) {
                setReplyText(`@${nestedReply.user?.name} `);
              }
            }}
            className="text-gray-500"
          >
            Reply
          </button>
          <span className="text-gray-500">{timeAgo(nestedReply.createdAt)}</span>
        </div>

        {/* Reply form for nested replies */}
        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-2 ml-2 flex gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage
                className="w-5 h-5 rounded-full"
                src="/memberpage/member.png"
                alt="avatar"
              />
            </Avatar>
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
      </div>
    </div>
  );
};


const Postcard = ({ postData, getPosts, userid }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(
    postData?.likes?.some((like) => like._id === userid)
  );
  const [likesCount, setLikesCount] = useState(postData?.likes?.length || 0);
  const [comments, setComments] = useState(postData?.comments || []);
  const [visibleComments, setVisibleComments] = useState(3); // Show only first 3 comments initially
  const [sharesCount, setSharesCount] = useState(postData?.shares?.length || 0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const commentInputRef = useRef(null);
  const url = process.env.NEXT_PUBLIC_URL;

  // Update local state when postData changes
  useEffect(() => {
    setComments(postData?.comments || []);
    setLikesCount(postData?.likes?.length || 0);
    setSharesCount(postData?.shares?.length || 0);
    setIsLiked(postData?.likes?.some((like) => like._id === userid));
  }, [postData, userid]);

  const handleDelete = async (id) => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message || "Successfully deleted.");
        getPosts();
      } else {
        toast.error(data?.message || "Failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${postData._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Update local state immediately
        setIsLiked(data.isLiked);
        setLikesCount(data.likes);
      } else {
        toast.error(data?.message || "Failed to like post.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleShare = async () => {
    // Open the share modal instead of direct API call
    setShowShareModal(true);
  };

  const handleShareComplete = (newSharesCount) => {
    // Update the shares count after successful share
    setSharesCount(newSharesCount);
  };

  const handleShowMoreComments = () => {
    setVisibleComments(comments.length);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${postData._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await response.json();
      if (response.ok) {
        setCommentText("");

        // Optimistic update: Add the comment locally
        if (data.comment) {
          setComments(prevComments => [...prevComments, data.comment]);
        }

        setShowComments(true);
      } else {
        toast.error(data?.message || "Failed to add comment.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = await gettoken();
      const response = await fetch(
        `${url}/api/posts/${postData._id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Optimistic update: Remove the comment locally
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        toast.success("Comment deleted successfully!");
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to delete comment.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Improved refreshComments function that properly updates the state
  const refreshComments = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${postData._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh comments: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        // Update all the relevant state with the fresh data
        if (data.comments) {
          setComments(data.comments);
        }

        if (data.likes) {
          setLikesCount(data.likes.length);
          setIsLiked(data.likes.some(like => like._id === userid));
        }

        if (data.shares) {
          setSharesCount(data.shares.length);
        }
      } else {
        console.error("Invalid data structure received:", data);
      }
    } catch (error) {
      console.error("Error refreshing comments:", error);
      toast.error("Failed to update comments. Please try again.");
    }
  };

  const handleFocusComment = () => {
    setShowComments(true);
    // Focus the comment input field
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  const { theme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  return (
    <div className={`mb-4 p-4 relative ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-md rounded-lg`}>
      {/* User Info */}
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center mb-2">
          {userid === postData?.user?._id ? (
            <div className="w-10 h-10 flex-shrink-0">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={
                  postData?.user?.profilePicture
                    ? `${url}/uploads/${postData?.user?.profilePicture
                      ?.split("\\")
                      .pop()}`
                    : "/memberpage/member.png"
                }
                alt="avatar"
              />
            </div>
          ) : (
            <Link href={`chat/${postData?.user?._id}`}>
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={
                    postData?.user?.profilePicture
                      ? `${url}/uploads/${postData?.user?.profilePicture
                        ?.split("\\")
                        .pop()}`
                      : "/memberpage/member.png"
                  }
                  alt="avatar"
                />
              </div>
            </Link>
          )}

          <div className="ml-3">
            <p className="font-semibold text-sm">{postData.user.name}</p>
            <p className={`text-xs ${isDark ? 'text-white' : 'text-gray-500'} `}>
              {timeAgo(postData?.createdAt)}
            </p>
          </div>
        </div>
        {userid === postData?.user?._id ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Icon
                icon="qlementine-icons:menu-dots-16"
                width="28"
                height="28"
                className="cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 mr-10 sm:mr-16 bg-white shadow-lg rounded-lg">
              <CreatePostDialogue getPosts={getPosts} postData={postData} />
              <DropdownMenuItem
                onClick={() => handleDelete(postData?._id)}
                className="cursor-pointer w-full mx-auto hover:bg-gray-100 px-4 py-2 text-red-600"
              >
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div></div>
        )}
      </div>

      {/* Post Content */}
      <p className="font-bold text-sm">{postData?.content}</p>

      {/* Post Images - Updated Section */}
      {postData?.imageUrl ? (
        // For backward compatibility with single image posts
        <div className="w-full h-auto bg-gray-200 mt-3">
          <Image
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${url}/uploads/${postData?.imageUrl?.split("\\").pop()}`}
            alt="postimg"
            width={400}
            height={400}
            style={{ objectFit: "contain", width: "100%" }}
            className="max-h-[400px]"
          />
        </div>
      ) : postData?.images && postData.images.length > 0 ? (
        // For multiple images
        <ImageGallery images={postData.images} url={url} />
      ) : null}

      {/* Updated Like, Comment, Share Section with "Liked by X members" text */}
      <div className="mt-4 flex items-center justify-between py-2">
        {/* Left side - Liked by X members */}
        <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-500'}`}>
          {likesCount > 0 && (
            <span>Liked by {likesCount} {likesCount === 1 ? 'member' : 'members'}</span>
          )}
          {/* {sharesCount > 0 && (
            <span className="ml-2">• Shared {sharesCount} {sharesCount === 1 ? 'time' : 'times'}</span>
          )} */}
        </div>

        {/* Right side - Icons with ShareButton for better sharing experience */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center justify-center"
          >
            <Icon
              icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
              width="24"
              height="24"
              className={`cursor-pointer ${isLiked ? "text-red-500" : isDark ? "text-white" : "text-[#131A45]"}`}
            />
          </button>

          <button
            onClick={handleFocusComment}
            className="flex items-center justify-center"
          >
            <Icon
              icon="mdi:comment-outline"
              width="24"
              height="24"
              className={`cursor-pointer ${isDark ? "text-white" : "text-[#131A45]"}`}
            />
          </button>

          {/* Replace the old share icon with our new ShareButton component */}
          <ShareButton
            postData={postData}
            handleShareCallback={handleShareComplete}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className={`mt-4 ${showComments ? 'block' : 'hidden'}`}>
        {/* Comments List */}
        <div className="space-y-3">
          {comments.length > 0 ? (
            <>
              {/* Show only the visible number of comments */}
              {comments.slice(0, visibleComments).map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={postData._id}
                  userId={userid}
                  handleDeleteComment={handleDeleteComment}
                  refreshComments={refreshComments}
                />
              ))}

              {/* Show more comments button */}
              {comments.length > visibleComments && (
                <button
                  onClick={handleShowMoreComments}
                  className="text-[16px] text-[#131A45] font-medium my-2 block hover:underline"
                >
                  View all {comments.length} comments
                </button>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 text-[14px] py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-4 flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-[#2A3057]' : 'bg-white'} focus:outline-none focus:ring-1 focus:ring-[#131A45]`}
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#131A45] disabled:text-gray-300"
            >
              <Icon icon="mdi:send" width="20" height="20" />
            </button>
          </div>
        </form>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <PostShareModal
          postData={postData}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShareComplete}
        />
      )}
    </div>
  );
};

export default Postcard;

